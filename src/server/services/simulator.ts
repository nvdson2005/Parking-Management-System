import { randomBytes, randomUUID } from 'crypto'
import type { PrismaClient } from '@prisma/client'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { recordEntry } from '@/server/services/entry'
import { previewExit, confirmExit } from '@/server/services/exit'
import { getFree } from '@/server/services/availability'
import { computeFee } from '@/server/services/fees'
import { updateLot } from '@/server/services/lots'
import { publishAvailabilityChanged } from '@/server/bus'
import type { FeeGroup, IdMethod, VehicleTypeCode } from '@/lib/types'

export type ExceptionCode = 'EX01' | 'EX02' | 'EX03' | 'EX04' | 'EX05'

export type ExceptionResult = {
  exception: string
  outcome: string
  /** EX01 leaves the zone full; run `npm run db:reset` before the next scenario. */
  needsReset?: boolean
  instructions?: { identifier: string; method: IdMethod; observedPlate?: string; lostCard?: boolean }
}

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const RESERVATION_STATUSES = ['NO_SHOW', 'FULFILLED', 'CANCELLED'] as const

/** Seeded PRNG (mulberry32) so a run can be replayed from its seed (PD-P04 #3). */
export type Rng = {
  readonly seed: number
  /** Uniform float in [0, 1). */
  next(): number
  /** Uniform integer in [min, maxInclusive]. */
  int(min: number, maxInclusive: number): number
  pick<T>(items: readonly T[]): T
}

export function freshSeed(): number {
  return randomBytes(4).readUInt32BE(0)
}

export function makeRng(seed: number = freshSeed()): Rng {
  let state = seed >>> 0
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const int = (min: number, maxInclusive: number) =>
    min + Math.floor(next() * (maxInclusive - min + 1))
  return {
    seed: seed >>> 0,
    next,
    int,
    pick: <T>(items: readonly T[]) => items[int(0, items.length - 1)],
  }
}

/**
 * Tunable knobs (KB-09): previously hard-coded inside the generators.
 * Override per call via the options argument.
 */
export const DEFAULT_SIM_CONFIG = {
  /** Probability that an iteration drives an open session out. */
  exitRatio: 0.4,
  /** Share of walk-ins that re-enter a known vehicle by QR / RFID instead of PLATE. */
  qrShare: 0.2,
  rfidShare: 0.2,
  /** `minSessions` mode stops after `minSessions * MAX_EVENTS_FACTOR` events at most. */
  maxEventsFactor: 20,
} as const

/**
 * A plausible Vietnamese-style plate `NNL-NNN.NN` (two digits, a letter
 * `A–Z`, a hyphen, three digits, a dot, two digits). Seeded when `rng` is
 * given, otherwise freshly random.
 */
export function randomPlate(rng: Rng = makeRng()): string {
  const d2 = () => String(rng.int(0, 9)) + String(rng.int(0, 9))
  const d3 = () => d2() + String(rng.int(0, 9))
  const letter = LETTERS[rng.int(0, LETTERS.length - 1)]
  return `${d2()}${letter}-${d3()}.${d2()}`
}

type Candidate = { zoneId: string; vehicleType: VehicleTypeCode }

async function freeCandidates(db: Db, now: Date): Promise<Candidate[]> {
  const capacities = await db.zoneCapacity.findMany({
    orderBy: [{ zone: { name: 'asc' } }, { vehicleTypeCode: 'asc' }],
  })
  const result: Candidate[] = []
  for (const cap of capacities) {
    const type = cap.vehicleTypeCode as VehicleTypeCode
    const free = await getFree(db, cap.zoneId, type, now)
    if (free > 0) result.push({ zoneId: cap.zoneId, vehicleType: type })
  }
  return result
}

async function anyCandidate(db: Db): Promise<Candidate | null> {
  const cap = await db.zoneCapacity.findFirst({
    orderBy: [{ zone: { name: 'asc' } }, { vehicleTypeCode: 'asc' }],
  })
  if (!cap) return null
  return { zoneId: cap.zoneId, vehicleType: cap.vehicleTypeCode as VehicleTypeCode }
}

function isDomainError(err: unknown): err is DomainError {
  return err instanceof DomainError
}

export type LiveOptions = {
  /** Replay a previous run. Defaults to a fresh random seed (returned in the result). */
  seed?: number
  /**
   * Run until at least this many sessions (*lượt gửi*, FR-34) have been
   * opened instead of a fixed number of events. `n` is then ignored.
   */
  minSessions?: number
  /** Override `DEFAULT_SIM_CONFIG.exitRatio`. */
  exitRatio?: number
}

export type LiveResult = {
  entries: number
  exits: number
  rejected: number
  /** Sessions opened by this run (= entries); the FR-34 "lượt gửi" count. */
  sessions: number
  seed: number
}

/**
 * Drives live-like events through the very same `recordEntry` /
 * `previewExit`+`confirmExit` services the staff UI calls (FR-15), so the
 * dashboard moves under realistic load without any back door.
 *
 * Fixed mode (`n`, 1–500): exactly `n` events, so
 * `entries + exits + rejected = n`. `minSessions` mode (1–500): events run
 * until `entries >= minSessions` (bounded by `maxEventsFactor`), guaranteeing
 * the ≥ 100 sessions SC-07 needs regardless of the exit ratio.
 *
 * Each iteration: if sessions are OPEN and the exit roll lands, an open
 * session is driven out with its *correct* plate, using the same
 * identification method it entered with; otherwise a vehicle enters a
 * zone/type that still has free capacity, identified by a fresh plate, or by
 * the QR / RFID code of a known vehicle. Only a `DomainError` counts as
 * `rejected`. All randomness comes from one seeded PRNG (PD-P04 #3).
 */
export async function simulateLive(
  db: Db,
  actorId: string,
  n: number,
  opts: LiveOptions = {},
): Promise<LiveResult> {
  const { minSessions } = opts
  if (minSessions !== undefined) {
    if (!Number.isInteger(minSessions) || minSessions < 1 || minSessions > 500) {
      throw new DomainError('VALIDATION', 'minSessions must be an integer between 1 and 500')
    }
  } else if (!Number.isInteger(n) || n < 1 || n > 500) {
    throw new DomainError('VALIDATION', 'n must be an integer between 1 and 500')
  }
  const exitRatio = opts.exitRatio ?? DEFAULT_SIM_CONFIG.exitRatio
  if (!(exitRatio >= 0 && exitRatio <= 1)) {
    throw new DomainError('VALIDATION', 'exitRatio must be between 0 and 1')
  }
  if (opts.seed !== undefined && (!Number.isInteger(opts.seed) || opts.seed < 0 || opts.seed > 0xffffffff)) {
    throw new DomainError('VALIDATION', 'seed must be an integer between 0 and 4294967295')
  }

  const rng = makeRng(opts.seed)
  const maxEvents =
    minSessions !== undefined ? minSessions * DEFAULT_SIM_CONFIG.maxEventsFactor : n

  let entries = 0
  let exits = 0
  let rejected = 0

  for (let i = 0; minSessions !== undefined ? entries < minSessions && i < maxEvents : i < n; i++) {
    // Sorted so the same seed picks the same session regardless of row order.
    const openSessions = await db.parkingSession.findMany({
      where: { status: 'OPEN' },
      include: { vehicle: true },
      orderBy: [{ entryTime: 'asc' }, { plateSnapshot: 'asc' }],
    })

    if (openSessions.length > 0 && rng.next() < exitRatio) {
      const session = rng.pick(openSessions)
      const byCode = session.vehicle && session.idMethod !== 'PLATE'
      const method: IdMethod = byCode ? (session.idMethod as IdMethod) : 'PLATE'
      const identifier = !byCode
        ? session.plateSnapshot
        : method === 'QR'
          ? session.vehicle!.qrCode
          : session.vehicle!.rfidCode
      try {
        await previewExit(db, {
          method,
          identifier,
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
    const roll = rng.next()
    const method: IdMethod =
      roll < DEFAULT_SIM_CONFIG.qrShare
        ? 'QR'
        : roll < DEFAULT_SIM_CONFIG.qrShare + DEFAULT_SIM_CONFIG.rfidShare
          ? 'RFID'
          : 'PLATE'

    try {
      if (method !== 'PLATE' && candidates.length > 0) {
        // Re-enter a known vehicle (seeded customer or earlier guest) by code.
        const idle = await db.vehicle.findMany({
          where: { sessions: { none: { status: 'OPEN' } } },
          orderBy: { plate: 'asc' },
          take: 50,
        })
        const usable = idle.filter((v) =>
          candidates.some((c) => c.vehicleType === (v.vehicleTypeCode as VehicleTypeCode)),
        )
        if (usable.length > 0) {
          const vehicle = rng.pick(usable)
          const zone = rng.pick(
            candidates.filter((c) => c.vehicleType === (vehicle.vehicleTypeCode as VehicleTypeCode)),
          )
          await recordEntry(db, {
            method,
            identifier: method === 'QR' ? vehicle.qrCode : vehicle.rfidCode,
            zoneId: zone.zoneId,
            staffId: actorId,
          })
          entries++
          continue
        }
      }

      const candidate = candidates.length > 0 ? rng.pick(candidates) : await anyCandidate(db)
      if (!candidate) {
        throw new DomainError('NOT_FOUND', 'No zone capacity configured to simulate against')
      }
      await recordEntry(db, {
        method: 'PLATE',
        identifier: randomPlate(rng),
        zoneId: candidate.zoneId,
        vehicleType: candidate.vehicleType,
        staffId: actorId,
      })
      entries++
    } catch (err) {
      if (isDomainError(err) && err.code !== 'NOT_FOUND') rejected++
      else throw err
    }
  }

  return { entries, exits, rejected, sessions: entries, seed: rng.seed }
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
  seed?: number,
): Promise<ExceptionResult> {
  const now = new Date()
  const rng = makeRng(seed)

  if (ex === 'EX01') {
    const candidates = await freeCandidates(db, now)
    const candidate = candidates.length > 0 ? rng.pick(candidates) : await anyCandidate(db)
    if (!candidate) throw new DomainError('NOT_FOUND', 'No zone capacity configured')

    let free = await getFree(db, candidate.zoneId, candidate.vehicleType, new Date())
    while (free > 0) {
      await openWalkIn(db, actorId, candidate, randomPlate(rng))
      free = await getFree(db, candidate.zoneId, candidate.vehicleType, new Date())
    }

    try {
      await openWalkIn(db, actorId, candidate, randomPlate(rng))
      return { exception: ex, outcome: 'UNEXPECTED' }
    } catch (err) {
      // The zone stays full: flag it so the UI can tell the operator to reset.
      if (isDomainError(err)) return { exception: ex, outcome: err.code, needsReset: true }
      throw err
    }
  }

  if (ex === 'EX04') {
    const candidates = await freeCandidates(db, now)
    const candidate = candidates.length > 0 ? rng.pick(candidates) : await anyCandidate(db)
    if (!candidate) throw new DomainError('NOT_FOUND', 'No zone capacity configured')

    const plate = randomPlate(rng)
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
    // Both transitions go through `updateLot` so they log `LOT_CHANGE` and
    // broadcast availability like a real manager action (KB-08).
    const originalStatus = lot.status as 'ACTIVE' | 'SUSPENDED'
    await updateLot(db, actorId, lot.id, { status: 'SUSPENDED' })
    try {
      await openWalkIn(db, actorId, { zoneId: zone.id, vehicleType: type }, randomPlate(rng))
      return { exception: ex, outcome: 'UNEXPECTED' }
    } catch (err) {
      if (!isDomainError(err)) throw err
      return { exception: ex, outcome: err.code }
    } finally {
      await updateLot(db, actorId, lot.id, { status: originalStatus })
    }
  }

  if (ex === 'EX02') {
    const candidates = await freeCandidates(db, now)
    const candidate = candidates.length > 0 ? rng.pick(candidates) : await anyCandidate(db)
    if (!candidate) throw new DomainError('NOT_FOUND', 'No zone capacity configured')

    const plate = randomPlate(rng)
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
  let zoneId = freeForType.length > 0 ? rng.pick(freeForType).zoneId : null
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
  seed?: number,
): Promise<{ sessions: number; reservations: number; payments: number; seed: number }> {
  if (!Number.isInteger(days) || days < 1 || days > 60) {
    throw new DomainError('VALIDATION', 'days must be an integer between 1 and 60')
  }

  const rng = makeRng(seed)
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
    const cap = rng.pick(capacities)
    const type = cap.vehicleTypeCode as VehicleTypeCode
    const group = rng.pick(feeGroupPool)
    const durationMin = rng.int(15, 240)
    const exitTime = new Date(entryTime.getTime() + durationMin * 60_000)
    const id = randomUUID()
    sessionRows.push({
      id,
      plateSnapshot: randomPlate(rng),
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

    const sessionCount = rng.int(30, 80)
    for (let s = 0; s < sessionCount; s++) {
      const entry = new Date(base)
      entry.setHours(rng.int(6, 20), rng.int(0, 59), 0, 0)
      await addClosedSession(entry)
    }

    if (customerVehicles.length > 0) {
      const reservationCount = rng.int(5, 10)
      for (let r = 0; r < reservationCount; r++) {
        const vehicle = rng.pick(customerVehicles)
        const type = vehicle.vehicleTypeCode as VehicleTypeCode
        const matching = capacities.filter((c) => c.vehicleTypeCode === type)
        const cap = matching.length > 0 ? rng.pick(matching) : rng.pick(capacities)
        const arrival = new Date(base)
        arrival.setHours(rng.int(6, 20), rng.int(0, 59), 0, 0)
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
    entry.setHours(rng.int(6, 20), rng.int(0, 59), 0, 0)
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
    seed: rng.seed,
  }
}
