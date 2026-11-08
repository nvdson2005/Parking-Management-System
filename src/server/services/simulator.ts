import { randomBytes, randomUUID } from 'crypto'
import type { PrismaClient } from '@prisma/client'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { recordEntry } from '@/server/services/entry'
import { previewExit, confirmExit } from '@/server/services/exit'
import { getFree } from '@/server/services/availability'
import { computeFee } from '@/server/services/fees'
import { publishAvailabilityChanged } from '@/server/bus'
import type { FeeGroup, IdMethod, VehicleTypeCode } from '@/lib/types'

export type ExceptionCode = 'EX01' | 'EX02' | 'EX03' | 'EX04' | 'EX05'

export type ExceptionResult = {
  exception: string
  outcome: string
  instructions?: { identifier: string; method: IdMethod; observedPlate?: string; lostCard?: boolean }
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const RESERVATION_STATUSES = ['NO_SHOW', 'FULFILLED', 'CANCELLED'] as const

function randomInt(min: number, maxInclusive: number): number {
  const span = maxInclusive - min + 1
  return min + (randomBytes(1)[0] % span)
}

function pick<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)]
}

/**
 * A plausible Vietnamese-style plate `NNL-NNN.NN` (two digits, a letter
 * `A–Z`, a hyphen, three digits, a dot, two digits) using `crypto` entropy.
 * Used wherever the simulator needs a fresh walk-in plate.
 */
export function randomPlate(): string {
  const d2 = () => String(randomInt(0, 9)) + String(randomInt(0, 9))
  const d3 = () => d2() + String(randomInt(0, 9))
  const letter = LETTERS[randomInt(0, LETTERS.length - 1)]
  return `${d2()}${letter}-${d3()}.${d2()}`
}

type Candidate = { zoneId: string; vehicleType: VehicleTypeCode }

async function freeCandidates(db: Db, now: Date): Promise<Candidate[]> {
  const capacities = await db.zoneCapacity.findMany()
  const result: Candidate[] = []
  for (const cap of capacities) {
    const type = cap.vehicleTypeCode as VehicleTypeCode
    const free = await getFree(db, cap.zoneId, type, now)
    if (free > 0) result.push({ zoneId: cap.zoneId, vehicleType: type })
  }
  return result
}

async function anyCandidate(db: Db): Promise<Candidate | null> {
  const cap = await db.zoneCapacity.findFirst()
  if (!cap) return null
  return { zoneId: cap.zoneId, vehicleType: cap.vehicleTypeCode as VehicleTypeCode }
}

function isDomainError(err: unknown): err is DomainError {
  return err instanceof DomainError
}

/**
 * Drives `n` live-like events (1–500) through the very same `recordEntry` /
 * `previewExit`+`confirmExit` services the staff UI calls (FR-15), so the
 * dashboard moves under realistic load without any back door.
 *
 * Each iteration: if sessions are OPEN and a coin-flip (`< 0.4`) lands, a
 * random open session is driven out with its *correct* plate; otherwise a
 * random walk-in plate enters a zone/type that still has free capacity.
 * Only a `DomainError` (e.g. a capacity race) counts as `rejected`, so the
 * three counters always sum to `n`.
 */
export async function simulateLive(
  db: Db,
  actorId: string,
  n: number,
): Promise<{ entries: number; exits: number; rejected: number }> {
  if (!Number.isInteger(n) || n < 1 || n > 500) {
    throw new DomainError('VALIDATION', 'n must be an integer between 1 and 500')
  }

  let entries = 0
  let exits = 0
  let rejected = 0

  for (let i = 0; i < n; i++) {
    const openSessions = await db.parkingSession.findMany({ where: { status: 'OPEN' } })

    if (openSessions.length > 0 && Math.random() < 0.4) {
      const session = pick(openSessions)
      try {
        await previewExit(db, {
          method: 'PLATE',
          identifier: session.plateSnapshot,
          observedPlate: session.plateSnapshot,
        })
        await confirmExit(db, {
          sessionId: session.id,
          observedPlate: session.plateSnapshot,
          confirmMismatch: false,
          lostCard: false,
          staffId: actorId,
        })
        exits++
      } catch (err) {
        if (isDomainError(err)) rejected++
        else throw err
      }
      continue
    }

    const now = new Date()
    const candidates = await freeCandidates(db, now)
    const candidate = candidates.length > 0 ? pick(candidates) : await anyCandidate(db)
    if (!candidate) {
      throw new DomainError('NOT_FOUND', 'No zone capacity configured to simulate against')
    }

    try {
      await recordEntry(db, {
        method: 'PLATE',
        identifier: randomPlate(),
        zoneId: candidate.zoneId,
        vehicleType: candidate.vehicleType,
        staffId: actorId,
      })
      entries++
    } catch (err) {
      if (isDomainError(err)) rejected++
      else throw err
    }
  }

  return { entries, exits, rejected }
}

async function openWalkIn(db: Db, actorId: string, candidate: Candidate, plate: string) {
  return recordEntry(db, {
    method: 'PLATE',
    identifier: plate,
    zoneId: candidate.zoneId,
    vehicleType: candidate.vehicleType,
    staffId: actorId,
  })
}

/**
 * Deterministically reproduces one of the five demo exceptions (D-28) on the
 * live data:
 * - EX01/EX04/EX05 are *resolved* automatically and return the rejection
 *   code the services raised (`ZONE_FULL` / `ALREADY_OPEN` / `LOT_SUSPENDED`);
 *   EX05 restores the lot to `ACTIVE` afterwards.
 * - EX02/EX03 only *set up* an open session and return the exact instructions
 *   a staff member follows on `/staff/exit` (plate-mismatch confirm for EX02,
 *   lost-card for EX03).
 */
export async function triggerException(
  db: Db,
  actorId: string,
  ex: ExceptionCode,
): Promise<ExceptionResult> {
  const now = new Date()

  if (ex === 'EX01') {
    const candidates = await freeCandidates(db, now)
    const candidate = candidates.length > 0 ? pick(candidates) : await anyCandidate(db)
    if (!candidate) throw new DomainError('NOT_FOUND', 'No zone capacity configured')

    let free = await getFree(db, candidate.zoneId, candidate.vehicleType, new Date())
    while (free > 0) {
      await openWalkIn(db, actorId, candidate, randomPlate())
      free = await getFree(db, candidate.zoneId, candidate.vehicleType, new Date())
    }

    try {
      await openWalkIn(db, actorId, candidate, randomPlate())
      return { exception: ex, outcome: 'UNEXPECTED' }
    } catch (err) {
      if (isDomainError(err)) return { exception: ex, outcome: err.code }
      throw err
    }
  }

  if (ex === 'EX04') {
    const candidates = await freeCandidates(db, now)
    const candidate = candidates.length > 0 ? pick(candidates) : await anyCandidate(db)
    if (!candidate) throw new DomainError('NOT_FOUND', 'No zone capacity configured')

    const plate = randomPlate()
    await openWalkIn(db, actorId, candidate, plate)
    try {
      await openWalkIn(db, actorId, candidate, plate)
      return { exception: ex, outcome: 'UNEXPECTED' }
    } catch (err) {
      if (isDomainError(err)) return { exception: ex, outcome: err.code }
      throw err
    }
  }

  if (ex === 'EX05') {
    const lot = await db.parkingLot.findFirst({ orderBy: { name: 'asc' } })
    if (!lot) throw new DomainError('NOT_FOUND', 'No lot to suspend')
    const zone = await db.zone.findFirst({
      where: { lotId: lot.id, capacities: { some: {} } },
      include: { capacities: true },
    })
    if (!zone) throw new DomainError('NOT_FOUND', 'No zone to enter')
    const type = zone.capacities[0].vehicleTypeCode as VehicleTypeCode

    // Restore whatever status the manager had set, not a hard-coded ACTIVE:
    // a lot that was already suspended must stay suspended.
    const originalStatus = lot.status
    await db.parkingLot.update({ where: { id: lot.id }, data: { status: 'SUSPENDED' } })
    try {
      await openWalkIn(db, actorId, { zoneId: zone.id, vehicleType: type }, randomPlate())
      return { exception: ex, outcome: 'UNEXPECTED' }
    } catch (err) {
      if (!isDomainError(err)) throw err
      return { exception: ex, outcome: err.code }
    } finally {
      await db.parkingLot.update({ where: { id: lot.id }, data: { status: originalStatus } })
    }
  }

  if (ex === 'EX02') {
    const candidates = await freeCandidates(db, now)
    const candidate = candidates.length > 0 ? pick(candidates) : await anyCandidate(db)
    if (!candidate) throw new DomainError('NOT_FOUND', 'No zone capacity configured')

    const plate = randomPlate()
    await openWalkIn(db, actorId, candidate, plate)
    // Flip the last digit so the "observed" plate reads differently, letting
    // staff practise the PLATE_MISMATCH confirm flow on `/staff/exit`.
    const lastDigit = Number(plate[plate.length - 1])
    const observedPlate = plate.slice(0, -1) + String((lastDigit + 1) % 10)
    return {
      exception: ex,
      outcome: 'SESSION_OPEN',
      instructions: { method: 'PLATE', identifier: plate, observedPlate },
    }
  }

  // EX03: open a session via QR for a seeded customer vehicle, then hand the
  // staff a lost-card exit (identified by the plate).
  const vehicle = await db.vehicle.findFirst({
    where: { ownerId: { not: null }, sessions: { none: { status: 'OPEN' } } },
  })
  if (!vehicle) throw new DomainError('NOT_FOUND', 'No seeded customer vehicle available')
  const type = vehicle.vehicleTypeCode as VehicleTypeCode

  // Choose a zone that still has free capacity for this vehicle type so the
  // seeded vehicle actually enters (a naive "first capacity row" pick can hit
  // a full zone and raise ZONE_FULL instead of setting up the demo session).
  const freeForType = (await freeCandidates(db, now)).filter((c) => c.vehicleType === type)
  let zoneId = freeForType.length > 0 ? pick(freeForType).zoneId : null
  if (!zoneId) {
    const anyForType = await db.zoneCapacity.findFirst({ where: { vehicleTypeCode: type } })
    if (!anyForType) throw new DomainError('NOT_FOUND', 'No zone accepts this vehicle type')
    zoneId = anyForType.zoneId
  }

  await recordEntry(db, {
    method: 'QR',
    identifier: vehicle.qrCode,
    zoneId,
    staffId: actorId,
  })
  return {
    exception: ex,
    outcome: 'SESSION_OPEN',
    instructions: { method: 'PLATE', identifier: vehicle.plate, lostCard: true },
  }
}

/**
 * Fabricates a realistic back-catalogue directly through Prisma — no lock,
 * past timestamps only — so reports and history screens have data to show.
 *
 * For each of the past `days` days (1–60): 30–80 closed sessions (entry
 * 06:00–20:00, 15–240 min stay) each with a CONFIRMED payment at exit time
 * priced by `computeFee`, plus 5–10 reservations across all three terminal
 * statuses. A further 20 sessions land ~13 months back (D-29, retention
 * boundary). Finishes by broadcasting an availability change.
 */
export async function generateHistory(
  db: Db,
  actorId: string,
  days: number,
): Promise<{ sessions: number; reservations: number; payments: number }> {
  if (!Number.isInteger(days) || days < 1 || days > 60) {
    throw new DomainError('VALIDATION', 'days must be an integer between 1 and 60')
  }

  const prisma = db as PrismaClient

  const capacities = await prisma.zoneCapacity.findMany()
  if (capacities.length === 0) throw new DomainError('NOT_FOUND', 'No zone capacity configured')

  const customers = await prisma.user.findMany({ where: { roleCode: 'CUSTOMER' } })
  const customerVehicles = await prisma.vehicle.findMany({ where: { ownerId: { not: null } } })

  const feeGroupPool: FeeGroup[] = ['GUEST']
  for (const customer of customers) {
    if (customer.userGroup) feeGroupPool.push(customer.userGroup as FeeGroup)
  }

  const feeCache = new Map<string, number>()
  async function feeFor(type: VehicleTypeCode, group: FeeGroup): Promise<number> {
    const key = `${type}:${group}`
    const cached = feeCache.get(key)
    if (cached !== undefined) return cached
    const amount = await computeFee(prisma, type, group)
    feeCache.set(key, amount)
    return amount
  }

  type SessionRow = {
    id: string
    plateSnapshot: string
    zoneId: string
    vehicleTypeCode: string
    feeGroup: string
    idMethod: string
    entryTime: Date
    exitTime: Date
    entryStaffId: string
    exitStaffId: string
    status: string
  }
  type PaymentRow = {
    sessionId: string
    amount: number
    status: string
    paidAt: Date
    confirmedById: string
  }
  type ReservationRow = {
    customerId: string
    vehicleId: string
    zoneId: string
    vehicleTypeCode: string
    arrivalTime: Date
    holdUntil: Date
    status: string
    cancelReason?: string
    createdAt: Date
  }

  const sessionRows: SessionRow[] = []
  const paymentRows: PaymentRow[] = []
  const reservationRows: ReservationRow[] = []

  async function addClosedSession(entryTime: Date): Promise<void> {
    const cap = pick(capacities)
    const type = cap.vehicleTypeCode as VehicleTypeCode
    const group = pick(feeGroupPool)
    const durationMin = randomInt(15, 240)
    const exitTime = new Date(entryTime.getTime() + durationMin * 60_000)
    const id = randomUUID()
    sessionRows.push({
      id,
      plateSnapshot: randomPlate(),
      zoneId: cap.zoneId,
      vehicleTypeCode: type,
      feeGroup: group,
      idMethod: 'PLATE',
      entryTime,
      exitTime,
      entryStaffId: actorId,
      exitStaffId: actorId,
      status: 'CLOSED',
    })
    paymentRows.push({
      sessionId: id,
      amount: await feeFor(type, group),
      status: 'CONFIRMED',
      paidAt: exitTime,
      confirmedById: actorId,
    })
  }

  const now = new Date()
  for (let d = 1; d <= days; d++) {
    const base = new Date(now)
    base.setDate(base.getDate() - d)

    const sessionCount = randomInt(30, 80)
    for (let s = 0; s < sessionCount; s++) {
      const entry = new Date(base)
      entry.setHours(randomInt(6, 20), randomInt(0, 59), 0, 0)
      await addClosedSession(entry)
    }

    if (customerVehicles.length > 0) {
      const reservationCount = randomInt(5, 10)
      for (let r = 0; r < reservationCount; r++) {
        const vehicle = pick(customerVehicles)
        const type = vehicle.vehicleTypeCode as VehicleTypeCode
        const matching = capacities.filter((c) => c.vehicleTypeCode === type)
        const cap = matching.length > 0 ? pick(matching) : pick(capacities)
        const arrival = new Date(base)
        arrival.setHours(randomInt(6, 20), randomInt(0, 59), 0, 0)
        const status = RESERVATION_STATUSES[r % RESERVATION_STATUSES.length]
        reservationRows.push({
          customerId: vehicle.ownerId!,
          vehicleId: vehicle.id,
          zoneId: cap.zoneId,
          vehicleTypeCode: cap.vehicleTypeCode,
          arrivalTime: arrival,
          holdUntil: new Date(arrival.getTime() + 30 * 60_000),
          // Cycle the terminal statuses so every demo run shows all three.
          status,
          // Generated cancellations model a customer cancelling (D-41).
          ...(status === 'CANCELLED' ? { cancelReason: 'CUSTOMER' } : {}),
          createdAt: arrival,
        })
      }
    }
  }

  // D-29: 20 sessions straddling the 12-month retention boundary.
  const old = new Date(now)
  old.setMonth(old.getMonth() - 13)
  for (let s = 0; s < 20; s++) {
    const entry = new Date(old)
    entry.setHours(randomInt(6, 20), randomInt(0, 59), 0, 0)
    await addClosedSession(entry)
  }

  await prisma.$transaction([
    prisma.parkingSession.createMany({ data: sessionRows }),
    prisma.payment.createMany({ data: paymentRows }),
    ...(reservationRows.length > 0
      ? [prisma.reservation.createMany({ data: reservationRows })]
      : []),
  ])

  publishAvailabilityChanged()

  return {
    sessions: sessionRows.length,
    reservations: reservationRows.length,
    payments: paymentRows.length,
  }
}
