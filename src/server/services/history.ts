import { z } from 'zod'
import type { Db } from '@/server/db'

/**
 * Sessions the customer parked as owner (FR-28), newest first by entry time.
 * Scoped by the owner snapshot taken at entry (`session.ownerId`), never by
 * the vehicle's current owner: after `removeVehicle` and a re-claim, the
 * former owner keeps their transactions and the new owner cannot see them.
 */
export async function customerHistory(
  db: Db,
  customerId: string,
): Promise<
  Array<{
    sessionId: string
    plate: string
    zoneName: string
    entryTime: Date
    exitTime: Date | null
    amount: number | null
    paidAt: Date | null
  }>
> {
  const sessions = await db.parkingSession.findMany({
    where: { ownerId: customerId },
    include: { zone: true, payment: true },
    orderBy: { entryTime: 'desc' },
  })

  return sessions.map((session) => ({
    sessionId: session.id,
    plate: session.plateSnapshot,
    zoneName: session.zone.name,
    entryTime: session.entryTime,
    exitTime: session.exitTime,
    amount: session.payment?.amount ?? null,
    paidAt: session.payment?.paidAt ?? null,
  }))
}

/**
 * All confirmed payments (manager view), newest first, optionally filtered
 * to an inclusive `paidAt` range.
 */
export async function allPayments(
  db: Db,
  opts: { from?: Date; to?: Date },
): Promise<
  Array<{
    paymentId: string
    plateSnapshot: string
    amount: number
    paidAt: Date
    confirmedByName: string
    zoneName: string
  }>
> {
  const paidAt: { gte?: Date; lte?: Date } = {}
  if (opts.from) paidAt.gte = opts.from
  if (opts.to) paidAt.lte = opts.to

  const payments = await db.payment.findMany({
    where: Object.keys(paidAt).length > 0 ? { paidAt } : undefined,
    include: { session: { include: { zone: true } }, confirmedBy: true },
    orderBy: { paidAt: 'desc' },
  })

  return payments.map((payment) => ({
    paymentId: payment.id,
    plateSnapshot: payment.session.plateSnapshot,
    amount: payment.amount,
    paidAt: payment.paidAt,
    confirmedByName: payment.confirmedBy.name,
    zoneName: payment.session.zone.name,
  }))
}

const optionalDate = z
  .string()
  .optional()
  .refine((v) => v === undefined || !Number.isNaN(new Date(v).getTime()), { message: 'Invalid date' })
  .transform((v) => (v === undefined ? undefined : new Date(v)))

/**
 * Query for the manager's GET /api/payments (A-65, KB-15): optional `from`
 * and `to`, each a parsable date; an unparsable value is a VALIDATION error.
 */
export const paymentsQuerySchema = z.object({ from: optionalDate, to: optionalDate })
