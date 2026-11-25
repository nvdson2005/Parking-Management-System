// A-49 / AT-100 timing run (SC-001, SC-002; NFR-04, NFR-05, NFR-06).
//
// Drives the normal 100-visit scenario through the same HTTP API the Staff
// screens use, while one availability SSE stream is open, and records per event:
//   - recording time: entry POST, or exit preview + confirm (threshold 3 s)
//   - display time: from the request that records the event to the SSE message
//     that shows the new count (threshold 5 s)
// After the run it checks every closed session for complete fields and compares
// /api/availability with an independent count from the database (read-only).
//
// Usage (dev or production server already running, ideally on a fresh
// `npx prisma migrate reset --force`):
//   STAFF_PASSWORD=... [SEED=1686] node scripts/a49-at100-latency.mjs [outDir]
// Env: STAFF_PASSWORD (required), STAFF_EMAIL (default staff1@demo.local),
// BASE_URL (default http://localhost:3000), SEED (event order; default random,
// printed in the output so a run can be repeated).

import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import prismaPkg from '@prisma/client'

const { PrismaClient } = prismaPkg

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000'
const STAFF_EMAIL = process.env.STAFF_EMAIL ?? 'staff1@demo.local'
const STAFF_PASSWORD = process.env.STAFF_PASSWORD
if (!STAFF_PASSWORD) {
  console.error('Set STAFF_PASSWORD (the seeded demo password is in README.md) before running this script.')
  process.exit(1)
}
const OUT_DIR = process.argv[2] ?? path.join('docs', 'm3', 'evidence')

const VISITS = 100
const CAR_VISITS = 20
const RECORD_LIMIT_MS = 3000
const DISPLAY_LIMIT_MS = 5000
const SSE_TIMEOUT_MS = 10000

// Deterministic PRNG so the event order can be reproduced (mulberry32).
function rng(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const now = () => performance.now()

async function login() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: STAFF_EMAIL, password: STAFF_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`)
  const cookie = res.headers.getSetCookie().find((c) => c.startsWith('session='))
  if (!cookie) throw new Error('Login returned no session cookie')
  return cookie.split(';')[0]
}

function api(cookie) {
  return async (method, url, body) => {
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: { 'content-type': 'application/json', cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    })
    const text = await res.text()
    let data
    try {
      data = text ? JSON.parse(text) : null
    } catch {
      data = text
    }
    return { ok: res.ok, status: res.status, data }
  }
}

// Keeps every availability message with its arrival time.
function openStream(cookie) {
  const messages = []
  const waiters = new Set()
  const controller = new AbortController()

  const ready = (async () => {
    const res = await fetch(`${BASE_URL}/api/availability/stream`, {
      headers: { cookie, accept: 'text/event-stream' },
      signal: controller.signal,
    })
    if (!res.ok || !res.body) throw new Error(`SSE failed: ${res.status}`)
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    ;(async () => {
      try {
        for (;;) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          let cut
          while ((cut = buffer.indexOf('\n\n')) !== -1) {
            const chunk = buffer.slice(0, cut)
            buffer = buffer.slice(cut + 2)
            const line = chunk.split('\n').find((l) => l.startsWith('data: '))
            if (!line) continue
            messages.push({ t: now(), data: JSON.parse(line.slice(6)) })
            for (const w of waiters) w()
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') console.error('SSE read error', err)
      }
    })()
  })()

  // Resolves with the first message at index >= from that satisfies pred.
  function waitFor(from, pred, timeoutMs) {
    return new Promise((resolve) => {
      const check = () => {
        for (let i = from; i < messages.length; i++) {
          if (pred(messages[i].data)) {
            cleanup()
            resolve(messages[i])
            return true
          }
        }
        return false
      }
      const timer = setTimeout(() => {
        cleanup()
        resolve(null)
      }, timeoutMs)
      const cleanup = () => {
        clearTimeout(timer)
        waiters.delete(check)
      }
      if (!check()) waiters.add(check)
    })
  }

  return { ready, messages, waitFor, close: () => controller.abort() }
}

function cell(lots, zoneId, type) {
  for (const lot of lots) {
    for (const zone of lot.zones) {
      if (zone.zoneId !== zoneId) continue
      const t = zone.byType.find((b) => b.vehicleType === type)
      if (t) return t
    }
  }
  return null
}

function stats(values) {
  const sorted = [...values].sort((a, b) => a - b)
  const pick = (p) => sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)]
  const mean = sorted.reduce((s, v) => s + v, 0) / sorted.length
  return { n: sorted.length, min: sorted[0], mean, p95: pick(95), max: sorted[sorted.length - 1] }
}

async function main() {
  const cookie = await login()
  const call = api(cookie)
  const stream = openStream(cookie)
  await stream.ready
  const first = await stream.waitFor(0, () => true, SSE_TIMEOUT_MS)
  if (!first) throw new Error('No initial availability message on the stream')
  const lots = first.data
  if (lots.length !== 1) console.warn(`Note: ${lots.length} lots returned; using the first`)
  const lot = lots[0]
  if (lot.status !== 'ACTIVE') throw new Error(`Lot status is ${lot.status}; reactivate it first`)

  const motoZones = lot.zones.filter((z) => z.byType.some((b) => b.vehicleType === 'MOTORBIKE' && b.capacity > 0))
  const carZones = lot.zones.filter((z) => z.byType.some((b) => b.vehicleType === 'CAR' && b.capacity > 0))
  if (motoZones.length === 0 || carZones.length === 0) throw new Error('Need at least one motorbike and one car zone')
  const carFree = carZones.reduce((s, z) => s + z.byType.find((b) => b.vehicleType === 'CAR').free, 0)
  if (carFree < CAR_VISITS) {
    throw new Error(`Only ${carFree} car spots free; reset the database (npx prisma migrate reset --force) first`)
  }

  // Warm-up: compile the routes without changing data (dev server compiles on first hit).
  await call('POST', '/api/events/entry', {})
  await call('POST', '/api/events/exit/preview', { method: 'PLATE', identifier: '00X-000.00', observedPlate: '00X-000.00' })
  await call('POST', '/api/events/exit/confirm', {})

  // Build the 100 visits: 80 motorbikes spread over motorbike zones, 20 cars.
  const seed = Number(process.env.SEED ?? Date.now() % 100000)
  const rand = rng(seed)
  const tag = String(seed % 100).padStart(2, '0')
  const visits = []
  for (let i = 0; i < VISITS; i++) {
    const isCar = i < CAR_VISITS
    const zones = isCar ? carZones : motoZones
    const zone = zones[i % zones.length]
    const prefix = isCar ? '51K' : '59T'
    visits.push({
      plate: `${prefix}-${tag}${String(i).padStart(3, '0')}`,
      type: isCar ? 'CAR' : 'MOTORBIKE',
      zoneId: zone.zoneId,
      zoneName: zone.zoneName,
    })
  }
  for (let i = visits.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[visits[i], visits[j]] = [visits[j], visits[i]]
  }

  // Expected open count per zone/type, tracked from the stream's first snapshot.
  const expectedOpen = new Map()
  for (const z of lot.zones) for (const b of z.byType) expectedOpen.set(`${z.zoneId}:${b.vehicleType}`, b.open)

  const db = new PrismaClient()
  // Independent count from the database vs /api/availability (FR-17, NFR-06).
  async function compareCounts(label) {
    const apiLots = (await call('GET', '/api/availability')).data
    const at = new Date()
    const out = []
    for (const z of lot.zones) {
      for (const b of z.byType) {
        const cap = await db.zoneCapacity.findUnique({
          where: { zoneId_vehicleTypeCode: { zoneId: z.zoneId, vehicleTypeCode: b.vehicleType } },
        })
        const open = await db.parkingSession.count({
          where: { zoneId: z.zoneId, vehicleTypeCode: b.vehicleType, status: 'OPEN' },
        })
        const reserved = await db.reservation.count({
          where: { zoneId: z.zoneId, vehicleTypeCode: b.vehicleType, status: 'PENDING', holdUntil: { gt: at } },
        })
        const hand = Math.max(0, (cap?.capacity ?? 0) - open - reserved)
        const shown = cell(apiLots, z.zoneId, b.vehicleType)?.free
        out.push({ check: label, zone: z.zoneName, type: b.vehicleType, capacity: cap?.capacity, open, reserved, hand, api: shown, match: hand === shown })
      }
    }
    return out
  }

  const rows = []
  const parked = []
  const sessionIds = []
  const countRows = []
  let pending = 0
  const runStart = new Date()
  const t0 = now()

  while (pending < visits.length || parked.length > 0) {
    // Mid-run check while vehicles are parked; not timed, so it does not affect the latency figures.
    if (rows.length === VISITS) countRows.push(...(await compareCounts(`after event ${VISITS}`)))
    const doEntry = pending < visits.length && (parked.length === 0 || rand() < 0.55)
    const seq = rows.length + 1
    const startIdx = stream.messages.length

    if (doEntry) {
      const v = visits[pending++]
      const key = `${v.zoneId}:${v.type}`
      const tReq = now()
      const res = await call('POST', '/api/events/entry', {
        method: 'PLATE',
        identifier: v.plate,
        zoneId: v.zoneId,
        vehicleType: v.type,
      })
      const tRes = now()
      if (!res.ok) throw new Error(`Entry ${v.plate} failed: ${res.status} ${JSON.stringify(res.data)}`)
      expectedOpen.set(key, expectedOpen.get(key) + 1)
      const target = expectedOpen.get(key)
      const msg = await stream.waitFor(startIdx, (d) => cell(d, v.zoneId, v.type)?.open === target, SSE_TIMEOUT_MS)
      sessionIds.push(res.data.id)
      parked.push({ ...v, sessionId: res.data.id })
      rows.push({
        seq,
        event: 'ENTRY',
        plate: v.plate,
        zone: v.zoneName,
        type: v.type,
        recordMs: tRes - tReq,
        displayFromRequestMs: msg ? msg.t - tReq : null,
        displayFromResponseMs: msg ? msg.t - tRes : null,
        freeShown: msg ? cell(msg.data, v.zoneId, v.type).free : null,
      })
    } else {
      const idx = Math.floor(rand() * parked.length)
      const v = parked.splice(idx, 1)[0]
      const key = `${v.zoneId}:${v.type}`
      const tReq = now()
      const preview = await call('POST', '/api/events/exit/preview', {
        method: 'PLATE',
        identifier: v.plate,
        observedPlate: v.plate,
      })
      if (!preview.ok) throw new Error(`Exit preview ${v.plate} failed: ${preview.status} ${JSON.stringify(preview.data)}`)
      const tConfirm = now()
      const res = await call('POST', '/api/events/exit/confirm', {
        sessionId: preview.data.sessionId,
        observedPlate: v.plate,
        confirmMismatch: false,
        lostCard: false,
        method: 'PLATE',
      })
      const tRes = now()
      if (!res.ok) throw new Error(`Exit confirm ${v.plate} failed: ${res.status} ${JSON.stringify(res.data)}`)
      expectedOpen.set(key, expectedOpen.get(key) - 1)
      const target = expectedOpen.get(key)
      const msg = await stream.waitFor(startIdx, (d) => cell(d, v.zoneId, v.type)?.open === target, SSE_TIMEOUT_MS)
      rows.push({
        seq,
        event: 'EXIT',
        plate: v.plate,
        zone: v.zoneName,
        type: v.type,
        recordMs: tRes - tReq,
        displayFromRequestMs: msg ? msg.t - tConfirm : null,
        displayFromResponseMs: msg ? msg.t - tRes : null,
        freeShown: msg ? cell(msg.data, v.zoneId, v.type).free : null,
      })
    }
  }
  const runSeconds = (now() - t0) / 1000
  stream.close()

  // SC-002: completeness of the closed sessions and availability vs independent count.
  const sessions = await db.parkingSession.findMany({ where: { id: { in: sessionIds } } })
  const complete = sessions.filter(
    (s) => s.status === 'CLOSED' && s.entryTime && s.exitTime && s.vehicleTypeCode && s.zoneId && s.plateSnapshot,
  )
  countRows.push(...(await compareCounts('end of run')))
  await db.$disconnect()

  const entries = rows.filter((r) => r.event === 'ENTRY')
  const exits = rows.filter((r) => r.event === 'EXIT')
  const missing = rows.filter((r) => r.displayFromRequestMs === null)
  const seen = rows.filter((r) => r.displayFromRequestMs !== null)
  const summary = {
    baseUrl: BASE_URL,
    seed,
    startedAt: runStart.toISOString(),
    runSeconds: Number(runSeconds.toFixed(1)),
    visits: VISITS,
    events: rows.length,
    entries: entries.length,
    exits: exits.length,
    record: {
      all: stats(rows.map((r) => r.recordMs)),
      entry: stats(entries.map((r) => r.recordMs)),
      exit: stats(exits.map((r) => r.recordMs)),
      overLimit: rows.filter((r) => r.recordMs > RECORD_LIMIT_MS).length,
      limitMs: RECORD_LIMIT_MS,
    },
    display: {
      fromRequest: seen.length ? stats(seen.map((r) => r.displayFromRequestMs)) : null,
      fromResponse: seen.length ? stats(seen.map((r) => Math.max(0, r.displayFromResponseMs))) : null,
      missingUpdates: missing.length,
      overLimit: seen.filter((r) => r.displayFromRequestMs > DISPLAY_LIMIT_MS).length + missing.length,
      limitMs: DISPLAY_LIMIT_MS,
    },
    completeness: { closedSessions: sessions.length, complete: complete.length },
    availabilityMatch: countRows,
  }
  summary.sc001 = summary.record.overLimit === 0 && summary.display.overLimit === 0 ? 'PASS' : 'FAIL'
  summary.sc002 =
    complete.length === VISITS && sessions.length === VISITS && countRows.every((r) => r.match) ? 'PASS' : 'FAIL'

  mkdirSync(OUT_DIR, { recursive: true })
  const stamp = runStart.toISOString().replace(/[:.]/g, '-')
  const csvPath = path.join(OUT_DIR, `a49-at100-${stamp}.csv`)
  const jsonPath = path.join(OUT_DIR, `a49-at100-${stamp}.json`)
  const fmt = (v) => (typeof v === 'number' ? v.toFixed(1) : v ?? '')
  const header = 'seq,event,plate,zone,type,record_ms,display_from_request_ms,display_from_response_ms,free_shown'
  const lines = rows.map((r) =>
    [r.seq, r.event, r.plate, r.zone, r.type, fmt(r.recordMs), fmt(r.displayFromRequestMs), fmt(r.displayFromResponseMs), r.freeShown ?? ''].join(','),
  )
  writeFileSync(csvPath, [header, ...lines].join('\n') + '\n')
  writeFileSync(jsonPath, JSON.stringify(summary, null, 2) + '\n')

  const r1 = (s) => (s ? `min ${s.min.toFixed(0)} / mean ${s.mean.toFixed(0)} / p95 ${s.p95.toFixed(0)} / max ${s.max.toFixed(0)} ms` : 'n/a')
  console.log(`\nAT-100 run: ${VISITS} visits, ${rows.length} events (${entries.length} entries, ${exits.length} exits) in ${summary.runSeconds} s, seed ${seed}`)
  console.log(`Recording time (<= 3 s):       ${r1(summary.record.all)}; over limit: ${summary.record.overLimit}`)
  console.log(`  entry: ${r1(summary.record.entry)}`)
  console.log(`  exit (preview + confirm): ${r1(summary.record.exit)}`)
  console.log(`Display update (<= 5 s):       ${r1(summary.display.fromRequest)}; missing: ${missing.length}; over limit: ${summary.display.overLimit}`)
  console.log(`  measured from the response:  ${r1(summary.display.fromResponse)}`)
  console.log(`Closed sessions complete:      ${complete.length}/${sessions.length}`)
  console.table(countRows)
  console.log(`SC-001: ${summary.sc001}   SC-002: ${summary.sc002}`)
  console.log(`Saved ${csvPath}\n      ${jsonPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
