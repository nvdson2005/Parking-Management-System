/**
 * A-79 – Bộ kiểm thử hợp đồng API vào/ra (P05 ↔ P04, theo P18 v1.0)
 * Giảm rủi ro: R-G2-02, R-G3-01, R-G3-02, R-G4-04.
 * Gọi trực tiếp route handler (đúng lớp HTTP: status + body JSON),
 * không gọi service, để phát hiện lệch hợp đồng ở ranh giới API.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { CurrentUser } from '@/server/auth/session'

// ---- Giả lập phiên đăng nhập (requireRole đọc cookie qua next/headers) ----
let currentUser: CurrentUser | null = null
vi.mock('@/server/auth/session', async (orig) => ({
  ...(await orig<typeof import('@/server/auth/session')>()),
  getCurrentUser: async () => currentUser,
}))

import { db } from '@/server/db'
import { resetDb, makeFixture, type Fixture } from './helpers/db'
import { POST as entryPOST } from '@/app/api/events/entry/route'
import { POST as previewPOST } from '@/app/api/events/exit/preview/route'
import { POST as confirmPOST } from '@/app/api/events/exit/confirm/route'
import { POST as simPOST } from '@/app/api/simulator/route'
import { GET as availGET } from '@/app/api/availability/route'

// ---- Tiện ích ----
const call = async (handler: (r: Request, c: unknown) => Promise<Response>, body?: unknown, method = 'POST') => {
  const req = new Request('http://test.local/api', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  })
  const res = await handler(req, {})
  return { status: res.status, body: await res.json() }
}
const as = (f: Fixture, role: 'STAFF' | 'MANAGER' | 'CUSTOMER') => {
  const u = role === 'STAFF' ? f.staff : role === 'MANAGER' ? f.manager : f.student
  currentUser = { id: u.id, role, name: u.name, userGroup: u.userGroup ?? null } as CurrentUser
}
const ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/

// Payload mẫu dùng chung cho P05 và P04 (một nguồn sự thật cho hợp đồng)
const entryBody = (f: Fixture, plate = '59X1-12345') => ({
  method: 'PLATE', identifier: plate, zoneId: f.zoneA.id, vehicleType: 'MOTORBIKE',
})

let f: Fixture
beforeEach(async () => {
  await resetDb()
  f = await makeFixture()
  as(f, 'STAFF')
})

// =========================================================
describe('CT-01..CT-03 POST /api/events/entry', () => {
  it('CT-01 hợp lệ → 200, body đủ trường của ParkingSession', async () => {
    const r = await call(entryPOST, entryBody(f))
    expect(r.status).toBe(200)
    expect(r.body).toMatchObject({
      id: expect.any(String),
      plateSnapshot: expect.any(String),
      zoneId: f.zoneA.id,
      vehicleTypeCode: 'MOTORBIKE',
      feeGroup: 'GUEST',
      idMethod: 'PLATE',
      status: 'OPEN',
      entryTime: expect.stringMatching(ISO), // R-G3-01: lượt có timestamp
    })
  })

  it.each([
    ['thiếu identifier', { method: 'PLATE', zoneId: 'x', vehicleType: 'MOTORBIKE' }],
    ['method sai', { method: 'FACE', identifier: 'A', zoneId: 'x' }],
    ['vehicleType sai', { method: 'PLATE', identifier: 'A', zoneId: 'x', vehicleType: 'BUS' }],
    ['JSON hỏng', 'not json'],
  ])('CT-02 %s → 400 VALIDATION', async (_n, body) => {
    const r = await call(entryPOST, body)
    expect(r).toMatchObject({ status: 400, body: { error: 'VALIDATION' } })
  })

  it('CT-03 phân quyền: chưa đăng nhập 401, Customer 403', async () => {
    currentUser = null
    expect((await call(entryPOST, entryBody(f))).status).toBe(401)
    as(f, 'CUSTOMER')
    expect(await call(entryPOST, entryBody(f))).toMatchObject({ status: 403, body: { error: 'FORBIDDEN' } })
  })
})

// =========================================================
describe('CT-04..CT-08 ngoại lệ EX-01..EX-05 (AT-EX01..05)', () => {
  it('CT-04 EX-01 khu hết chỗ → 409 ZONE_FULL, chỗ trống không âm', async () => {
    await call(entryPOST, entryBody(f, '59X1-00001'))
    await call(entryPOST, entryBody(f, '59X1-00002')) // sức chứa A = 2
    const r = await call(entryPOST, entryBody(f, '59X1-00003'))
    expect(r).toMatchObject({ status: 409, body: { error: 'ZONE_FULL' } })
  })

  it('CT-05 EX-02 biển lệch, không xác nhận → 409 PLATE_MISMATCH; có xác nhận → đóng lượt', async () => {
    const s = (await call(entryPOST, entryBody(f))).body
    const pv = await call(previewPOST, { method: 'PLATE', identifier: '59X1-12345', observedPlate: '59X1-99999' })
    expect(pv.status).toBe(200)
    expect(pv.body).toMatchObject({ sessionId: s.id, plateMismatch: true, fee: expect.any(Number) })

    const no = await call(confirmPOST, { method: 'PLATE', sessionId: s.id, observedPlate: '59X1-99999', confirmMismatch: false, lostCard: false })
    expect(no).toMatchObject({ status: 409, body: { error: 'PLATE_MISMATCH' } })

    const yes = await call(confirmPOST, { method: 'PLATE', sessionId: s.id, observedPlate: '59X1-99999', confirmMismatch: true, lostCard: false })
    expect(yes.status).toBe(200)
    expect(yes.body.session).toMatchObject({ id: s.id, status: 'CLOSED', exitTime: expect.stringMatching(ISO) })
    // Q46, review of PR #11: the session is closed, so Staff get the plate masked.
    expect(yes.body.session.plateSnapshot).toBe('59X1-***45')
    expect(JSON.stringify(yes.body)).not.toContain('59X1-12345')
  })

  it('CT-05b a Manager confirming an exit gets the full plate (Q46)', async () => {
    const s = (await call(entryPOST, entryBody(f))).body
    as(f, 'MANAGER')
    const r = await call(confirmPOST, { method: 'PLATE', sessionId: s.id, observedPlate: '59X1-12345', confirmMismatch: false, lostCard: false })
    expect(r.status).toBe(200)
    expect(r.body.session.plateSnapshot).toBe('59X1-12345')
  })

  it('CT-06 EX-03 mất thẻ → đóng lượt, phí thường, không phạt', async () => {
    const s = (await call(entryPOST, entryBody(f))).body
    const pv = (await call(previewPOST, { method: 'PLATE', identifier: '59X1-12345', observedPlate: '59X1-12345' })).body
    const r = await call(confirmPOST, { method: 'PLATE', sessionId: s.id, observedPlate: '59X1-12345', confirmMismatch: false, lostCard: true })
    expect(r.status).toBe(200)
    expect(r.body.session.status).toBe('CLOSED')
    expect(r.body.payment.amount).toBe(pv.fee) // phí như preview, không cộng phạt
    const ev = await db.sessionEvent.findMany({ where: { sessionId: s.id } })
    expect(ev.map((e) => e.type)).toContain('LOST_CARD')
  })

  it('CT-07 EX-04 vào trùng → 409 ALREADY_OPEN, chỉ 1 lượt mở', async () => {
    await call(entryPOST, entryBody(f))
    const r = await call(entryPOST, entryBody(f))
    expect(r).toMatchObject({ status: 409, body: { error: 'ALREADY_OPEN' } })
    expect(await db.parkingSession.count({ where: { status: 'OPEN' } })).toBe(1)
  })

  it('CT-08 EX-05 bãi tạm ngưng → 409 LOT_SUSPENDED', async () => {
    await db.parkingLot.update({ where: { id: f.lot.id }, data: { status: 'SUSPENDED' } })
    const r = await call(entryPOST, entryBody(f))
    expect(r).toMatchObject({ status: 409, body: { error: 'LOT_SUSPENDED' } })
  })

  it('CT-09 ra xe không có lượt mở → 404 NO_OPEN_SESSION', async () => {
    const r = await call(previewPOST, { method: 'PLATE', identifier: '51A-00000', observedPlate: '51A-00000' })
    expect(r).toMatchObject({ status: 404, body: { error: 'NO_OPEN_SESSION' } })
  })
})

// =========================================================
describe('CT-10..CT-12 P04 bộ mô phỏng ↔ P05 (cùng hợp đồng)', () => {
  beforeEach(() => as(f, 'MANAGER'))

  it('CT-10 live: entries + exits + rejected = n; chỗ trống khớp lượt mở', async () => {
    const r = await call(simPOST, { action: 'live', n: 20, seed: 42 })
    expect(r.status).toBe(200)
    expect(r.body).toMatchObject({ entries: expect.any(Number), exits: expect.any(Number),
      rejected: expect.any(Number), sessions: expect.any(Number), seed: 42 })
    expect(r.body.entries + r.body.exits + r.body.rejected).toBe(20)

    const avail = (await call(availGET, undefined, 'GET')).body as {
      zones: { byType: { capacity: number; open: number; reserved: number; free: number }[] }[]
    }[]
    expect(Array.isArray(avail)).toBe(true)
    const types = avail.flatMap((l) => l.zones.flatMap((z) => z.byType))
    const sum = (k: 'capacity' | 'open' | 'reserved' | 'free') => types.reduce((a, t) => a + t[k], 0)
    // Sức chứa lấy từ fixture, không viết cứng
    const caps = await db.zoneCapacity.findMany()
    expect(sum('capacity')).toBe(caps.reduce((a, c) => a + c.capacity, 0))
    expect(sum('open')).toBe(await db.parkingSession.count({ where: { status: 'OPEN' } }))
    for (const t of types) expect(t.free + t.open + t.reserved).toBe(t.capacity)
  })

  it('CT-11 mọi lượt bộ mô phỏng tạo đều qua đúng hợp đồng (đủ trường, có timestamp)', async () => {
    await call(simPOST, { action: 'live', n: 20, seed: 7 })
    const sessions = await db.parkingSession.findMany()
    expect(sessions.length).toBeGreaterThan(0)
    for (const s of sessions) {
      expect(s.plateSnapshot).toBeTruthy()
      expect(['STUDENT', 'LECTURER_STAFF', 'GUEST']).toContain(s.feeGroup)
      expect(['PLATE', 'QR', 'RFID']).toContain(s.idMethod)
      expect(['MOTORBIKE', 'CAR']).toContain(s.vehicleTypeCode)
      expect(s.zoneId).toBeTruthy()
      expect(s.entryTime).toBeInstanceOf(Date)
      if (s.status === 'CLOSED') expect(s.exitTime!.getTime()).toBeGreaterThanOrEqual(s.entryTime.getTime())
    }
  })

  it.each([
    ['EX01', 'ZONE_FULL'],
    ['EX02', 'SESSION_OPEN'],
    ['EX03', 'SESSION_OPEN'],
    ['EX04', 'ALREADY_OPEN'],
    ['EX05', 'LOT_SUSPENDED'],
  ])('CT-12 simulator %s → outcome %s (simulator dựng đúng tình huống)', async (ex, outcome) => {
    // EX03 cần một xe đã có chủ (như dữ liệu db:seed) để vào bằng QR rồi ra theo biển số
    if (ex === 'EX03') {
      await db.vehicle.create({
        data: { plate: '59X1-55555', qrCode: 'QR-A79-TEST', rfidCode: 'RF-A79-TEST',
          vehicleTypeCode: 'MOTORBIKE', ownerId: f.student.id },
      })
    }
    const r = await call(simPOST, { action: 'exception', ex, seed: 1 })
    expect(r.status).toBe(200)
    expect(r.body).toMatchObject({ exception: ex, outcome })
  })

  it('CT-12b EX02: instructions của simulator qua preview/confirm → PLATE_MISMATCH, xác nhận thì đóng lượt', async () => {
    const sim = (await call(simPOST, { action: 'exception', ex: 'EX02', seed: 1 })).body
    const { method, identifier, observedPlate } = sim.instructions
    as(f, 'STAFF')
    const pv = await call(previewPOST, { method, identifier, observedPlate })
    expect(pv.status).toBe(200)
    expect(pv.body.plateMismatch).toBe(true)
    const base = { method, sessionId: pv.body.sessionId, observedPlate, lostCard: false }
    expect(await call(confirmPOST, { ...base, confirmMismatch: false }))
      .toMatchObject({ status: 409, body: { error: 'PLATE_MISMATCH' } })
    const ok = await call(confirmPOST, { ...base, confirmMismatch: true })
    expect(ok.status).toBe(200)
    expect(ok.body.session.status).toBe('CLOSED')
  })

  it('CT-12c EX03: instructions của simulator qua preview/confirm → mất thẻ, phí thường, có LOST_CARD', async () => {
    await db.vehicle.create({
      data: { plate: '59X1-55555', qrCode: 'QR-A79-TEST', rfidCode: 'RF-A79-TEST',
        vehicleTypeCode: 'MOTORBIKE', ownerId: f.student.id },
    })
    const sim = (await call(simPOST, { action: 'exception', ex: 'EX03', seed: 1 })).body
    const { method, identifier, lostCard } = sim.instructions
    expect(lostCard).toBe(true)
    as(f, 'STAFF')
    const pv = await call(previewPOST, { method, identifier, observedPlate: identifier })
    expect(pv.status).toBe(200)
    const r = await call(confirmPOST, { method, sessionId: pv.body.sessionId, observedPlate: identifier,
      confirmMismatch: false, lostCard: true })
    expect(r.status).toBe(200)
    expect(r.body.session.status).toBe('CLOSED')
    expect(r.body.payment.amount).toBe(pv.body.fee)
    const ev = await db.sessionEvent.findMany({ where: { sessionId: pv.body.sessionId } })
    expect(ev.map((e) => e.type)).toContain('LOST_CARD')
  })

  it('CT-13 simulator input sai → 400 VALIDATION; Staff gọi → 403', async () => {
    expect(await call(simPOST, { action: 'live', n: 'abc' })).toMatchObject({ status: 400, body: { error: 'VALIDATION' } })
    expect(await call(simPOST, { action: 'exception', ex: 'EX99' })).toMatchObject({ status: 400, body: { error: 'VALIDATION' } })
    as(f, 'STAFF')
    expect((await call(simPOST, { action: 'live', n: 1 })).status).toBe(403)
  })
})