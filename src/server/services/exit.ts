import type { ParkingSession, Payment, PrismaClient } from '@prisma/client'
import { z } from 'zod'
import type { Db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { withLock } from '@/server/lock'
import { findVehicleByIdentifier } from '@/server/services/vehicles'
import { computeFee } from '@/server/services/fees'
import { logAccess } from '@/server/services/accessLog'
import { publishAvailabilityChanged } from '@/server/bus'
import { PLATE_MISMATCH_EVENT, normalizePlate, observedPlateNote, plateCompareKey } from '@/lib/plate'
import { DEFAULT_GATE, DEFAULT_SOURCE, GATES, SOURCES } from '@/lib/types'
import type { FeeGroup, GateCode, IdMethod, SessionSource, VehicleTypeCode } from '@/lib/types'

export type ExitPreview = {
  sessionId: string
  plateSnapshot: string
  zoneName: string
  vehicleType: VehicleTypeCode
  feeGroup: FeeGroup
  entryTime: Date
  fee: number
  plateMismatch: boolean
}

const previewExitSchema = z.object({
  method: z.enum(['PLATE', 'QR', 'RFID']),
  identifier: z.string().min(1),
  observedPlate: z.string().min(1),
})

/**
 * Reads the OPEN session for a vehicle (found by plate/QR/RFID) and the fee
 * due on exit, flagging whether the staff-observed plate differs from the
 * session's snapshot (D-26). A vehicle with no OPEN session — including an
 * unknown identifier — is `NO_OPEN_SESSION`. Read-only: no lock, no writes.
 */
export async function previewExit(
  db: Db,
  input: { method: IdMethod; identifier: string; observedPlate: string },
): Promise<ExitPreview> {
  const parsed = previewExitSchema.safeParse(input)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid exit preview input')
  const { method, identifier, observedPlate } = parsed.data

  const vehicle = await findVehicleByIdentifier(db, method, identifier)
  if (!vehicle) throw new DomainError('NO_OPEN_SESSION', 'Vehicle has no open session')

  const session = await db.parkingSession.findFirst({
    where: { vehicleId: vehicle.id, status: 'OPEN' },
    include: { zone: true },
  })
  if (!session) throw new DomainError('NO_OPEN_SESSION', 'Vehicle has no open session')

  const vehicleType = session.vehicleTypeCode as VehicleTypeCode
  const feeGroup = session.feeGroup as FeeGroup
  const fee = await computeFee(db, vehicleType, feeGroup)

  return {
    sessionId: session.id,
    plateSnapshot: session.plateSnapshot,
    zoneName: session.zone.name,
    vehicleType,
    feeGroup,
    entryTime: session.entryTime,
    fee,
    plateMismatch: plateCompareKey(observedPlate) !== plateCompareKey(session.plateSnapshot),
  }
}

const confirmExitSchema = z.object({
  sessionId: z.string().min(1),
  observedPlate: z.string().min(1),
  confirmMismatch: z.boolean(),
  lostCard: z.boolean(),
  method: z.enum(['PLATE', 'QR', 'RFID']).optional(),
  note: z.string().optional(),
  staffId: z.string().min(1),
  gate: z.enum(GATES).optional(),
  source: z.enum(SOURCES).optional(),
  now: z.date().optional(),
})

/**
 * Closes an OPEN session, taking a simulated CONFIRMED payment for the fee
 * snapshotted at entry (FR-27, D-06), and recording the manual-override
 * events the exit required:
 * - a confirmed plate mismatch writes `PLATE_MISMATCH_CONFIRMED`, with the
 *   observed plate in the note (EX-02); an unconfirmed mismatch is rejected
 *   with `PLATE_MISMATCH`;
 * - a lost card writes `LOST_CARD` (EX-03, D-09).
 *
 * The read-check-write sequence runs inside `withLock` + a transaction so a
 * session can't be closed/paid twice concurrently. `logAccess` (always
 * `EXIT`, plus `MANUAL_CONFIRM` when any event was written) and the
 * availability broadcast run after the transaction commits. Exits succeed
 * regardless of lot status (D-27).
 */
export async function confirmExit(
  db: Db,
  input: {
    sessionId: string
    observedPlate: string
    confirmMismatch: boolean
    lostCard: boolean
    method?: IdMethod
    note?: string
    staffId: string
    gate?: GateCode
    source?: SessionSource
    now?: Date
  },
): Promise<{ session: ParkingSession; payment: Payment }> {
  const parsed = confirmExitSchema.safeParse(input)
  if (!parsed.success) throw new DomainError('VALIDATION', 'Invalid exit input')
  const data = parsed.data
  const now = data.now ?? new Date()

  // EX-03 / D-09: a lost card is looked up by plate. Enforced here so the
  // simulator and any direct API client cannot skip the staff screen's rule.
  if (data.lostCard && data.method !== 'PLATE') {
    throw new DomainError('VALIDATION', 'Lost card requires plate lookup')
  }

  // `confirmExit` is the top-level caller holding a real client, so it owns
  // the transaction boundary the `Db` union type can't express.
  const prisma = db as PrismaClient

  const result = await withLock(() =>
    prisma.$transaction(async (tx) => {
      const session = await tx.parkingSession.findUnique({ where: { id: data.sessionId } })
      if (!session || session.status !== 'OPEN') {
        throw new DomainError('NO_OPEN_SESSION', 'Session is not open')
      }

      const observedPlate = normalizePlate(data.observedPlate)
      const mismatch = plateCompareKey(observedPlate) !== plateCompareKey(session.plateSnapshot)
      if (mismatch && !data.confirmMismatch) throw new DomainError('PLATE_MISMATCH', 'Observed plate does not match')

      let wroteEvent = false
      if (mismatch) {
        await tx.sessionEvent.create({
          data: {
            sessionId: session.id,
            type: PLATE_MISMATCH_EVENT,
            staffId: data.staffId,
            note: observedPlateNote(observedPlate, data.note),
          },
        })
        wroteEvent = true
      }
      if (data.lostCard) {
        await tx.sessionEvent.create({
          data: {
            sessionId: session.id,
            type: 'LOST_CARD',
            staffId: data.staffId,
            note: data.note ?? null,
          },
        })
        wroteEvent = true
      }

      const amount = await computeFee(
        tx,
        session.vehicleTypeCode as VehicleTypeCode,
        session.feeGroup as FeeGroup,
      )
      const payment = await tx.payment.create({
        data: {
          sessionId: session.id,
          amount,
          status: 'CONFIRMED',
          paidAt: now,
          confirmedById: data.staffId,
        },
      })

      const closed = await tx.parkingSession.update({
        where: { id: session.id },
        data: { exitTime: now, exitStaffId: data.staffId, status: 'CLOSED', exitGate: data.gate ?? DEFAULT_GATE, exitSource: data.source ?? DEFAULT_SOURCE },
      })

      return { session: closed, payment, wroteEvent }
    }),
  )

  await logAccess(db, { userId: data.staffId, action: 'EXIT', target: result.session.id })
  if (result.wroteEvent) {
    await logAccess(db, { userId: data.staffId, action: 'MANUAL_CONFIRM', target: result.session.id })
  }
  publishAvailabilityChanged()

  return { session: result.session, payment: result.payment }
}
