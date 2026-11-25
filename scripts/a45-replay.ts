/**
 * A-45 replay runner (thay cho a45-run.ps1 / a45-ex.ps1 / a45-params.ps1).
 *
 *   npx tsx scripts/a45-replay.ts <live|exceptions|params|all>
 *
 * Chay tren Windows, macOS, Linux. Can tat `npm run dev` truoc khi chay (dung chung thu muc .next).
 *
 * Moi ca (run1, EX01, P3, ...):
 *   1. Tao CSDL SQLite MOI trong thu muc tam cua lan chay nay: `prisma migrate deploy` + `prisma db seed`.
 *      Khong bao gio reset; tu choi moi DATABASE_URL khong tro vao file moi do (assertReplayDb).
 *   2. Khoi dong `next dev` gan vao 127.0.0.1 tren mot cong trong; tham do dung 127.0.0.1.
 *   3. Dang nhap qua /api/auth/login va kiem tra dong LOGIN xuat hien trong CSDL replay:
 *      chung minh server dang tra loi la server cua lan replay nay (khong phai server khac tren may).
 *   4. Replay qua POST /api/simulator, kiem tra response va CSDL bang SQL, export.
 * Evidence chi duoc ghi khi MOI ca deu dat, va duoc thay ca bo cung luc (publishEvidence).
 */
import { spawn, spawnSync, type ChildProcess } from 'node:child_process'
import { createHash } from 'node:crypto'
import * as fs from 'node:fs'
import * as net from 'node:net'
import * as os from 'node:os'
import * as path from 'node:path'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'
import { exportDatabase } from './a45-export-lib'

const ROOT = process.cwd()
const EVIDENCE = path.join(ROOT, 'docs', 'evidence', 'A-45')
const NEXT_BIN = path.join(ROOT, 'node_modules', 'next', 'dist', 'bin', 'next')
const PRISMA_BIN = path.join(ROOT, 'node_modules', 'prisma', 'build', 'index.js')
const MANAGER = { email: 'manager1@demo.local', password: 'password123' }
const READY_TIMEOUT_MS = 180_000
const REQUEST_TIMEOUT_MS = 300_000

class ReplayError extends Error {}
function check(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new ReplayError(msg)
}

/** Thu muc tam rieng cho lan chay nay; moi ca co thu muc con chua replay.db va log. */
let WORK = '' // tao trong main() sau khi kiem tra tham so
let currentServer: ChildProcess | null = null

// ---------------------------------------------------------------- CSDL replay

function sqliteUrl(dbFile: string) {
  return 'file:' + dbFile.replace(/\\/g, '/')
}

/** Chi chap nhan <WORK>/<ca>/replay.db cua lan chay nay. */
function assertReplayDb(url: string, mustBeNew: boolean) {
  check(url.startsWith('file:'), `Tu choi: DATABASE_URL khong phai SQLite (${url})`)
  const file = path.resolve(url.slice('file:'.length))
  const rel = path.relative(WORK, file)
  check(!rel.startsWith('..') && !path.isAbsolute(rel) && rel.split(/[\\/]/).length === 2 && path.basename(file) === 'replay.db',
    `Tu choi: ${url} khong phai CSDL replay trong ${WORK}`)
  if (mustBeNew) check(!fs.existsSync(file), `Tu choi: ${file} da ton tai, CSDL replay phai la file moi`)
}

function childEnv(databaseUrl: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env, DATABASE_URL: databaseUrl, NEXT_TELEMETRY_DISABLED: '1' }
  // `prisma db seed` chay "tsx prisma/seed.ts" qua shell -> can node_modules/.bin trong PATH (Windows: "Path")
  const pathKey = Object.keys(env).find(k => k.toLowerCase() === 'path') ?? 'PATH'
  env[pathKey] = path.join(ROOT, 'node_modules', '.bin') + path.delimiter + (env[pathKey] ?? '')
  return env
}

function runPrisma(args: string[], env: NodeJS.ProcessEnv, log: string) {
  const r = spawnSync(process.execPath, [PRISMA_BIN, ...args], { cwd: ROOT, env, encoding: 'utf8' })
  fs.appendFileSync(log, `$ prisma ${args.join(' ')}\n${r.stdout ?? ''}${r.stderr ?? ''}\n`)
  check(r.status === 0, `prisma ${args.join(' ')} that bai (exit ${r.status}), xem ${log}`)
}

function initReplayDb(caseDir: string) {
  const dbFile = path.join(caseDir, 'replay.db')
  const url = sqliteUrl(dbFile)
  assertReplayDb(url, true)
  const env = childEnv(url)
  const log = path.join(caseDir, 'prisma.log')
  runPrisma(['migrate', 'deploy'], env, log)
  runPrisma(['db', 'seed'], env, log)
  assertReplayDb(url, false)
  return { url, env }
}

async function count(prisma: PrismaClient, sql: string): Promise<number> {
  const rows = await prisma.$queryRawUnsafe<{ n: bigint | number }[]>(sql)
  return Number(rows[0]?.n ?? 0)
}

// ---------------------------------------------------------------- server test

function freeLoopbackPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const s = net.createServer()
    s.once('error', reject)
    s.listen(0, '127.0.0.1', () => {
      const port = (s.address() as net.AddressInfo).port
      s.close(() => resolve(port))
    })
  })
}

async function startServer(env: NodeJS.ProcessEnv, caseDir: string) {
  const port = await freeLoopbackPort()
  const base = `http://127.0.0.1:${port}`
  const logFile = path.join(caseDir, 'server.log')
  const log = fs.createWriteStream(logFile)
  const child = spawn(process.execPath, [NEXT_BIN, 'dev', '-H', '127.0.0.1', '-p', String(port)], {
    cwd: ROOT, env, stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32',
  })
  currentServer = child
  let output = ''
  let exited = false
  child.on('exit', () => { exited = true })
  for (const s of [child.stdout, child.stderr]) {
    s?.on('data', (d: Buffer) => { output += d.toString(); log.write(d) })
  }

  const deadline = Date.now() + READY_TIMEOUT_MS
  while (Date.now() < deadline) {
    check(!exited, `Server test tat khi khoi dong, xem ${logFile}`)
    // Next dev tu doi sang cong khac neu cong ban -> khong chap nhan
    check(!/in use/i.test(output), `Cong ${port} bi chiem, xem ${logFile}`)
    if (/Ready in/i.test(output)) {
      try {
        // Tham do dung dia chi da gan (127.0.0.1), khong dung "localhost" (co the ra ::1)
        await fetch(`${base}/api/auth/login`, { method: 'GET', signal: AbortSignal.timeout(60_000) })
        return { base, logFile }
      } catch { /* route dang bien dich hoac chua nghe */ }
    }
    await new Promise(r => setTimeout(r, 1000))
  }
  throw new ReplayError(`Server test khong san sang sau ${READY_TIMEOUT_MS / 1000} s, xem ${logFile}`)
}

async function stopServer() {
  const child = currentServer
  currentServer = null
  if (!child || child.pid === undefined || child.exitCode !== null) return
  const done = new Promise(r => child.once('exit', r))
  if (process.platform === 'win32') {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  } else {
    try { process.kill(-child.pid, 'SIGKILL') } catch { /* da tat */ }
  }
  await Promise.race([done, new Promise(r => setTimeout(r, 10_000))])
}

// ---------------------------------------------------------------- HTTP

type ApiResult = { status: number; text: string; json: ApiResponse }

const apiResponseSchema = z.object({
  entries: z.number().optional(),
  exits: z.number().optional(),
  rejected: z.number().optional(),
  sessions: z.number().optional(),
  seed: z.number().optional(),
  exception: z.string().optional(),
  outcome: z.string().optional(),
  error: z.string().optional(),
  reservations: z.number().optional(),
  payments: z.number().optional(),
}).passthrough()
type ApiResponse = z.infer<typeof apiResponseSchema>

class Client {
  private cookie = ''
  constructor(private base: string, private prisma: PrismaClient) {}

  async post(p: string, body: unknown, expectStatus = 200): Promise<ApiResult> {
    const res = await fetch(this.base + p, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(this.cookie ? { cookie: this.cookie } : {}) },
      body: JSON.stringify(body),
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    const text = await res.text()
    check(res.status === expectStatus, `POST ${p}: HTTP ${res.status} (mong doi ${expectStatus}) - ${text}`)
    let json: ApiResponse
    try { json = apiResponseSchema.parse(JSON.parse(text)) } catch (e) {
      throw new ReplayError(`POST ${p}: response JSON khong hop le - ${text} (${String(e)})`)
    }
    return { status: res.status, text, json }
  }

  /** Dang nhap Manager va chung minh server dang dung CSDL replay (dong LOGIN moi xuat hien trong do). */
  async loginManager() {
    const LOGINS = "SELECT COUNT(*) AS n FROM access_logs WHERE action = 'LOGIN'"
    const before = await count(this.prisma, LOGINS)
    const res = await fetch(this.base + '/api/auth/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(MANAGER),
      redirect: 'manual',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    check(res.status === 200, `login: HTTP ${res.status} - ${await res.text()}`)
    this.cookie = res.headers.getSetCookie().map(c => c.split(';')[0]).join('; ')
    check(this.cookie !== '', 'login: khong nhan duoc cookie')
    const after = await count(this.prisma, LOGINS)
    check(after === before + 1,
      `login: CSDL replay khong ghi nhan lan dang nhap (truoc ${before}, sau ${after}) - server dang tra loi khong phai server cua lan replay nay`)
  }
}

// ---------------------------------------------------------------- chay mot ca

type Ctx = { prisma: PrismaClient; api: Client }

async function withCase<T>(name: string, fn: (ctx: Ctx) => Promise<T>): Promise<T> {
  console.log(`=== ${name} ===`)
  const caseDir = path.join(WORK, name)
  fs.mkdirSync(caseDir)
  const { url, env } = initReplayDb(caseDir)
  const prisma = new PrismaClient({ datasources: { db: { url } } })
  try {
    const { base } = await startServer(env, caseDir)
    const api = new Client(base, prisma)
    await api.loginManager()
    return await fn({ prisma, api })
  } finally {
    await stopServer()
    await prisma.$disconnect()
  }
}

/** Evidence se ghi, duong dan tuong doi so voi docs/evidence/A-45. */
const outputs = new Map<string, string>()
const put = (rel: string, content: string) => outputs.set(rel.replace(/\\/g, '/'), content)
const jsonLine = (r: ApiResult) => r.text.trim() + '\n'
const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex').toUpperCase()

const CLOSED = "SELECT COUNT(*) AS n FROM parking_sessions WHERE status = 'CLOSED'"
const OPEN = "SELECT COUNT(*) AS n FROM parking_sessions WHERE status = 'OPEN'"
const SESSIONS = 'SELECT COUNT(*) AS n FROM parking_sessions'
const PAYMENTS = 'SELECT COUNT(*) AS n FROM payments'

function numberField(response: ApiResponse, key: 'entries' | 'exits' | 'rejected' | 'sessions' | 'seed') {
  const value = response[key]
  check(typeof value === 'number', `API response thiếu số ${key}`)
  return value
}

/** exits = luot CLOSED = payments; luot OPEN = entries - exits (KB-A45-02). */
async function checkLiveCounts(name: string, prisma: PrismaClient, r: ApiResponse) {
  const entries = numberField(r, 'entries')
  const exits = numberField(r, 'exits')
  const closed = await count(prisma, CLOSED)
  const payments = await count(prisma, PAYMENTS)
  const open = await count(prisma, OPEN)
  console.log(`  entries=${entries} exits=${exits} closed=${closed} payments=${payments} open=${open}`)
  check(exits === closed && closed === payments, `${name}: exits/closed/payments lech (${exits}/${closed}/${payments})`)
  check(open === entries - exits, `${name}: open ${open} != entries - exits`)
  return { closed, payments, open }
}

// ---------------------------------------------------------------- lenh: live

async function live() {
  const runs = [{ name: 'run1', seed: 42 }, { name: 'run2', seed: 42 }, { name: 'run3', seed: 43 }]
  const exported: Record<string, string> = {}
  for (const { name, seed } of runs) {
    await withCase(name, async ({ prisma, api }) => {
      const r = await api.post('/api/simulator', { action: 'live', seed, minSessions: 100 })
      const j = r.json
      check(j.seed === seed, `${name}: seed tra ve ${j.seed}`)
      check(j.entries === 100 && j.sessions === 100, `${name}: entries/sessions = ${j.entries}/${j.sessions}, mong doi 100`)
      check(j.rejected === 0, `${name}: rejected = ${j.rejected}`)
      await checkLiveCounts(name, prisma, j)
      exported[name] = await exportDatabase(prisma)
      put(`${name}-response.json`, jsonLine(r))
      put(`${name}.txt`, exported[name])

      if (name === 'run1') {
        const rows = await prisma.$queryRawUnsafe<{ t: string; m: string; n: bigint | number }[]>(
          'SELECT vehicle_type_code AS t, id_method AS m, COUNT(*) AS n FROM parking_sessions GROUP BY t, m ORDER BY t, m')
        check(rows.reduce((s, x) => s + Number(x.n), 0) === 100, 'coverage: tong khac 100')
        put('coverage.csv', ['"Count","Name"', ...rows.map(x => `"${Number(x.n)}","${x.t}, ${x.m}"`)].join('\n') + '\n')
      }
    })
  }
  check(exported.run1 === exported.run2, 'seed 42 chay 2 lan cho export khac nhau')
  check(exported.run1 !== exported.run3, 'seed 43 cho export trung seed 42')
  put('hash.txt', runs.map(r => `${sha256(exported[r.name])}  ${r.name}.txt`).join('\n') + '\n')
  console.log('  seed 42 x2 giong nhau; seed 43 khac seed 42')
}

// ---------------------------------------------------------------- lenh: exceptions

async function exceptions() {
  const expected: Record<string, string> = {
    EX01: 'ZONE_FULL', EX02: 'SESSION_OPEN', EX03: 'SESSION_OPEN', EX04: 'ALREADY_OPEN', EX05: 'LOT_SUSPENDED',
  }
  for (const [ex, outcome] of Object.entries(expected)) {
    await withCase(ex, async ({ prisma, api }) => {
      const r = await api.post('/api/simulator', { action: 'exception', ex, seed: 42 })
      check(r.json.exception === ex, `${ex}: response cua ${r.json.exception}`)
      check(r.json.outcome === outcome, `${ex}: outcome ${r.json.outcome}, mong doi ${outcome}`)
      const dupOpen = await count(prisma,
        "SELECT COUNT(*) AS n FROM (SELECT plate_snapshot FROM parking_sessions WHERE status = 'OPEN' GROUP BY plate_snapshot HAVING COUNT(*) > 1)")
      check(dupOpen === 0, `${ex}: co ${dupOpen} bien so co hon 1 luot dang mo`)
      console.log(`  outcome=${r.json.outcome}`)
      put(`ex/${ex}-response.json`, jsonLine(r))
      put(`ex/${ex}.txt`, await exportDatabase(prisma))
    })
  }
}

// ---------------------------------------------------------------- lenh: params

async function params() {
  type Live = { entries: number; exits: number; rejected: number; sessions: number; closed: number }
  const res: Record<string, Live> = {}

  const runLive = (name: string, body: object) => withCase(name, async ({ prisma, api }) => {
    const r = await api.post('/api/simulator', { action: 'live', seed: 42, ...body })
    const c = await checkLiveCounts(name, prisma, r.json)
    put(`params/${name}.json`, jsonLine(r))
    res[name] = {
      entries: numberField(r.json, 'entries'),
      exits: numberField(r.json, 'exits'),
      rejected: numberField(r.json, 'rejected'),
      sessions: numberField(r.json, 'sessions'),
      closed: c.closed,
    }
  })

  const history: Record<string, { sessions: number; days: number }> = {}
  const runHistory = (name: string, days: number) => withCase(name, async ({ prisma, api }) => {
    const r = await api.post('/api/simulator', { action: 'history', seed: 42, days })
    const rows = await prisma.parkingSession.findMany({ select: { entryTime: true } })
    const distinctDays = new Set(rows.map(s => s.entryTime.toISOString().slice(0, 10))).size
    check(r.json.sessions === rows.length, `${name}: response ${r.json.sessions} luot, CSDL ${rows.length}`)
    console.log(`  sessions=${r.json.sessions} distinctDays=${distinctDays}`)
    put(`params/${name}.json`, jsonLine(r))
    history[name] = { sessions: r.json.sessions, days: distinctDays }
  })

  await runLive('P0-default', { minSessions: 100 })
  await runLive('P1-n50', { n: 50 })
  await runLive('P2-min150', { minSessions: 150 })
  await runLive('P3-exit0.2', { minSessions: 100, exitRatio: 0.2 })
  await runLive('P4-exit0.8', { minSessions: 100, exitRatio: 0.8 })
  await runHistory('P5-history1', 1)
  await runHistory('P5-history3', 3)
  await withCase('P6-bad-exit', async ({ prisma, api }) => {
    const r = await api.post('/api/simulator', { action: 'live', seed: 42, n: 10, exitRatio: 'abc' }, 400)
    check(r.json.error === 'VALIDATION', `P6: error ${r.json.error}`)
    check(await count(prisma, SESSIONS) === 0, 'P6: request bi tu choi nhung van tao luot gui')
    put('params/P6-bad-exit.json', jsonLine(r))
  })

  // So sanh cac lan chay khac tham so: tham so phai co tac dung
  const { 'P0-default': p0, 'P1-n50': p1, 'P2-min150': p2, 'P3-exit0.2': p3, 'P4-exit0.8': p4 } = res
  const h1 = history['P5-history1'], h3 = history['P5-history3']
  const checks: [boolean, string][] = [
    [p1.entries + p1.exits + p1.rejected === 50, `n: P1 entries+exits+rejected = ${p1.entries + p1.exits + p1.rejected} = 50`],
    [p0.sessions === 100 && p2.sessions === 150, `minSessions: P0 = ${p0.sessions} (100), P2 = ${p2.sessions} (150)`],
    [p3.sessions === 100 && p4.sessions === 100, `exitRatio giu nguyen so luot gui: P3 = ${p3.sessions}, P4 = ${p4.sessions}`],
    [p3.exits < p0.exits && p0.exits < p4.exits, `exitRatio: exits P3(0.2) = ${p3.exits} < P0(0.4) = ${p0.exits} < P4(0.8) = ${p4.exits}`],
    [h3.sessions > h1.sessions, `days: sessions P5(3) = ${h3.sessions} > P5(1) = ${h1.sessions}`],
    [h3.days > h1.days, `days: so ngay co luot gui P5(3) = ${h3.days} > P5(1) = ${h1.days}`],
  ]
  for (const [ok, msg] of checks) check(ok, `Tham so khong co tac dung: ${msg}`)
  put('params/summary.txt', checks.map(([, msg]) => `PASS  ${msg}`).join('\n') + '\n')
  console.log(checks.map(([, msg]) => `  PASS ${msg}`).join('\n'))
}

// ---------------------------------------------------------------- ghi evidence cung luc

/**
 * Dung ban sao day du cua docs/evidence/A-45 (gom file chup tay), ghi file moi vao ban sao,
 * kiem tra lai, roi doi ten ca thu muc. Loi o bat ky buoc nao -> thu muc cu duoc giu nguyen / khoi phuc.
 */
function publishEvidence() {
  const parent = path.dirname(EVIDENCE)
  const staging = fs.mkdtempSync(path.join(parent, '.A-45-staging-'))
  const backup = path.join(parent, `.A-45-backup-${Date.now()}`)
  try {
    if (fs.existsSync(EVIDENCE)) fs.cpSync(EVIDENCE, staging, { recursive: true })
    for (const [rel, content] of outputs) {
      const file = path.join(staging, rel)
      fs.mkdirSync(path.dirname(file), { recursive: true })
      fs.writeFileSync(file, content, 'utf8')
    }
    for (const [rel, content] of outputs) {
      check(fs.readFileSync(path.join(staging, rel), 'utf8') === content, `publish: ${rel} ghi sai`)
    }
  } catch (e) {
    fs.rmSync(staging, { recursive: true, force: true })
    throw e
  }

  const hadOld = fs.existsSync(EVIDENCE)
  if (hadOld) fs.renameSync(EVIDENCE, backup) // loi o day: chua co gi thay doi
  try {
    fs.renameSync(staging, EVIDENCE)
  } catch (e) {
    if (hadOld) fs.renameSync(backup, EVIDENCE)
    fs.rmSync(staging, { recursive: true, force: true })
    throw e
  }
  if (hadOld) {
    try {
      fs.rmSync(backup, { recursive: true, force: true })
    } catch (e) {
      console.warn(`Da cap nhat evidence, nhung khong xoa duoc ban sao cu ${backup}: ${String(e)}`)
    }
  }
  console.log(`Da ghi ${outputs.size} file vao ${path.relative(ROOT, EVIDENCE)}`)
}

// ---------------------------------------------------------------- main

const COMMANDS: Record<string, () => Promise<void>> = {
  live, exceptions, params,
  all: async () => { await live(); await exceptions(); await params() },
}

async function main() {
  const cmd = process.argv[2]
  check(cmd && cmd in COMMANDS, `Cach dung: npx tsx scripts/a45-replay.ts <${Object.keys(COMMANDS).join('|')}>`)
  check(fs.existsSync(path.join(ROOT, 'prisma', 'schema.prisma')), 'Hay chay tu thu muc goc cua repo')
  WORK = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'a45-replay-')))
  console.log(`Thu muc replay: ${WORK}`)
  await COMMANDS[cmd]()
  publishEvidence()
  try {
    fs.rmSync(WORK, { recursive: true, force: true })
  } catch (e) {
    console.warn(`Replay da thanh cong, nhung khong xoa duoc du lieu tam ${WORK}: ${String(e)}`)
  }
}

for (const sig of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sig, () => { void stopServer().finally(() => process.exit(130)) })
}

main().catch(async e => {
  await stopServer()
  console.error(`\nLOI: ${e instanceof Error ? e.message : e}`)
  console.error(WORK ? `Evidence KHONG duoc ghi. CSDL va log giu lai tai: ${WORK}` : 'Evidence KHONG duoc ghi.')
  process.exitCode = 1
})
