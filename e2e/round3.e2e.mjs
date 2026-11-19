// End-to-end checks for the Round 3 lecturer alignment, driven over HTTP
// against a running production server seeded with the demo data.
//
//   DATABASE_URL=file:./e2e.db npx prisma migrate deploy
//   DATABASE_URL=file:./e2e.db npx tsx prisma/seed.ts
//   DATABASE_URL=file:./e2e.db AUTH_SECRET=<32+ chars> npx next start -p 3100
//   BASE_URL=http://localhost:3100 node e2e/round3.e2e.mjs
//
// Needs a fresh seed (it reserves/enters for customer01..04). Reservations are
// same-day only, so arrivals are placed halfway between now and local midnight;
// the script aborts if fewer than 2 minutes of the day remain.

const BASE = process.env.BASE_URL ?? 'http://localhost:3100'
const PASSWORD = 'password123'
let failures = 0

function check(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `  -> ${detail}`}`)
  if (!ok) failures += 1
}

async function login(email) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD }),
  })
  if (!res.ok) throw new Error(`login ${email} failed: ${res.status}`)
  const cookie = res.headers.getSetCookie().map((c) => c.split(';')[0]).join('; ')
  return async (path, init = {}) => {
    const r = await fetch(`${BASE}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', cookie, ...(init.headers ?? {}) },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    })
    let json = null
    try {
      json = await r.json()
    } catch {}
    return { status: r.status, json }
  }
}

const endOfDay = new Date()
endOfDay.setHours(23, 59, 59, 999)
const remainingMs = endOfDay.getTime() - Date.now()
if (remainingMs < 120_000) {
  console.error('Less than 2 minutes left in the local day; rerun after midnight.')
  process.exit(2)
}
// A future arrival that is still today (same-day reservation rule).
const arrivalSoon = () => new Date(Date.now() + remainingMs / 2).toISOString()

const manager = await login('manager1@demo.local')
const staff = await login('staff1@demo.local')
const c1 = await login('customer01@demo.local')
const c2 = await login('customer02@demo.local')
const c3 = await login('customer03@demo.local')
const c4 = await login('customer04@demo.local')

const lots = (await manager('/api/lots')).json
const lot = lots[0]
const zoneA = lot.zones.find((z) => z.name === 'A')
const zoneB = lot.zones.find((z) => z.name === 'B')

// --- 1. one active reservation per account --------------------------------
const v1 = (await c1('/api/vehicles')).json[0]
const second = await c1('/api/vehicles', { method: 'POST', body: { plate: '30A-E2E01', vehicleType: 'MOTORBIKE' } })
check('customer can register a second vehicle', second.status === 200, JSON.stringify(second))
const arrival = arrivalSoon()
const r1 = await c1('/api/reservations', { method: 'POST', body: { vehicleId: v1.id, zoneId: zoneA.id, arrivalTime: arrival } })
check('first reservation succeeds', r1.status === 200, JSON.stringify(r1))
const r1b = await c1('/api/reservations', { method: 'POST', body: { vehicleId: second.json.id, zoneId: zoneA.id, arrivalTime: arrival } })
check('second reservation on another vehicle -> 409 RESERVATION_LIMIT', r1b.status === 409 && r1b.json.error === 'RESERVATION_LIMIT', JSON.stringify(r1b))

// --- 2. early arrival needs staff confirmation ----------------------------
const entry = (extra = {}) =>
  staff('/api/events/entry', { method: 'POST', body: { method: 'PLATE', identifier: v1.plate, zoneId: zoneA.id, vehicleType: 'MOTORBIKE', ...extra } })
const early = await entry()
check('early entry without confirmation -> 409 EARLY_ARRIVAL', early.status === 409 && early.json.error === 'EARLY_ARRIVAL', JSON.stringify(early))
const stillPending = (await c1('/api/reservations')).json.find((r) => r.id === r1.json.id)
check('reservation still PENDING after rejected early entry', stillPending?.status === 'PENDING', JSON.stringify(stillPending))
const badFlag = await entry({ confirmEarly: 'true' })
check('non-boolean confirmEarly -> 400 VALIDATION', badFlag.status === 400 && badFlag.json.error === 'VALIDATION', JSON.stringify(badFlag))
const admitted = await entry({ confirmEarly: true })
check('early entry with confirmEarly -> admitted', admitted.status === 200 && admitted.json.status === 'OPEN', JSON.stringify(admitted))
const fulfilled = (await c1('/api/reservations')).json.find((r) => r.id === r1.json.id)
check('reservation FULFILLED after confirmed early entry', fulfilled?.status === 'FULFILLED', JSON.stringify(fulfilled))

// --- 3. suspension cancels pending reservations and notifies --------------
const v2 = (await c2('/api/vehicles')).json[0]
const v3 = (await c3('/api/vehicles')).json[0]
const r2 = await c2('/api/reservations', { method: 'POST', body: { vehicleId: v2.id, zoneId: zoneA.id, arrivalTime: arrivalSoon() } })
const r3 = await c3('/api/reservations', { method: 'POST', body: { vehicleId: v3.id, zoneId: zoneB.id, arrivalTime: arrivalSoon() } })
check('customers 02 and 03 reserve', r2.status === 200 && r3.status === 200, JSON.stringify([r2, r3]))

const unauth = await fetch(`${BASE}/api/notifications`)
check('GET /api/notifications unauthenticated -> 401', unauth.status === 401, String(unauth.status))

const suspend = await manager(`/api/lots/${lot.id}`, { method: 'PATCH', body: { status: 'SUSPENDED' } })
check('manager suspends the lot', suspend.status === 200 && suspend.json.status === 'SUSPENDED', JSON.stringify(suspend))

const n2 = (await c2('/api/notifications')).json
check('customer02 has 1 unread LOT_SUSPENDED notification', n2.unreadCount === 1 && n2.items[0]?.type === 'LOT_SUSPENDED', JSON.stringify(n2))
check('notification carries lot and arrival but no plate', n2.items[0]?.params?.lot === lot.name && !JSON.stringify(n2.items[0].params).includes(v2.plate), JSON.stringify(n2.items[0]))
const cancelled = (await c2('/api/reservations')).json.find((r) => r.id === r2.json.id)
check('customer02 reservation CANCELLED with LOT_SUSPENDED', cancelled?.status === 'CANCELLED' && cancelled?.cancelReason === 'LOT_SUSPENDED', JSON.stringify(cancelled))
check('customer04 (no reservation) has no notifications', (await c4('/api/notifications')).json.unreadCount === 0)
check('customer01 FULFILLED reservation untouched', (await c1('/api/reservations')).json.find((r) => r.id === r1.json.id)?.status === 'FULFILLED')

const n3 = (await c3('/api/notifications')).json
const foreign = await c2('/api/notifications/read', { method: 'POST', body: { ids: [n3.items[0].id] } })
check("marking another user's notification updates 0 rows", foreign.status === 200 && foreign.json.updated === 0, JSON.stringify(foreign))
check("customer03's notification still unread", (await c3('/api/notifications')).json.unreadCount === 1)
const own = await c2('/api/notifications/read', { method: 'POST', body: {} })
check('customer02 mark-all-read updates 1 row', own.json.updated === 1, JSON.stringify(own))
check('customer02 unread count is 0 afterwards', (await c2('/api/notifications')).json.unreadCount === 0)

const rejectedRes = await c4('/api/reservations', { method: 'POST', body: { vehicleId: (await c4('/api/vehicles')).json[0].id, zoneId: zoneA.id, arrivalTime: arrivalSoon() } })
check('new reservation on suspended lot -> 409 LOT_SUSPENDED', rejectedRes.status === 409 && rejectedRes.json.error === 'LOT_SUSPENDED', JSON.stringify(rejectedRes))
const rejectedEntry = await staff('/api/events/entry', { method: 'POST', body: { method: 'PLATE', identifier: '51Z-99999', zoneId: zoneA.id, vehicleType: 'MOTORBIKE' } })
check('new entry on suspended lot -> 409 LOT_SUSPENDED', rejectedEntry.status === 409 && rejectedEntry.json.error === 'LOT_SUSPENDED', JSON.stringify(rejectedEntry))
const exit = await staff('/api/events/exit/confirm', {
  method: 'POST',
  body: { sessionId: admitted.json.id, observedPlate: v1.plate, confirmMismatch: false, lostCard: false },
})
check('vehicle already inside can still exit while suspended', exit.status === 200, JSON.stringify(exit))

await manager(`/api/lots/${lot.id}`, { method: 'PATCH', body: { status: 'ACTIVE' } })

// --- 4. utilisation breakdown ---------------------------------------------
const today = new Date()
const ymd = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
const report = await manager(`/api/reports?from=${ymd}&to=${ymd}`)
check('report keeps 24-hour overall series', report.json.utilisationByHour.length === 24)
check(
  'report has a slice per zone/type with capacity (A/B motorbike, C car)',
  report.json.utilisationBySlice.map((s) => `${s.zoneName}:${s.vehicleTypeCode}`).join() === 'A:MOTORBIKE,B:MOTORBIKE,C:CAR',
  JSON.stringify(report.json.utilisationBySlice.map((s) => s.zoneName)),
)

console.log(failures === 0 ? '\nAll e2e checks passed' : `\n${failures} e2e check(s) FAILED`)
process.exit(failures === 0 ? 0 : 1)
