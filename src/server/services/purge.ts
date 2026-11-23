import type { PrismaClient } from '@prisma/client'
import type { Db } from '@/server/db'
import { logAccess } from '@/server/services/accessLog'
import { subMonths } from '@/lib/time'

const PURGED = '[purged]'
const RETENTION_MONTHS = 12

/**
 * Applies the 12-month data-retention policy (FR-32, D-29). With
 * `cutoff = subMonths(now, 12)`:
 *   - Every CLOSED session with `exitTime < cutoff` whose plate is not yet
 *     masked gets `plateSnapshot = '[purged]'`. The 12 months run from the
 *     exit, when the session closes (Q44); an OPEN session is still in use.
 *   - Every ownerless vehicle with no session that exited at/after the cutoff, no
 *     OPEN session and no reservation is deleted; its old sessions are detached (`vehicleId =
 *     null`) first so the historical/masked rows survive the delete.
 * Logs `PURGE` with target `"<n> sessions, <m> vehicles"` and returns counts.
 *
 * `actorId` is the Manager who pressed the purge button, or `null` for the
 * automatic daily run (Q35, G-05): the log row then has no user, which marks it
 * as a system action (P03 §10 #3).
 */
export async function purgeOldData(
  db: Db,
  actorId: string | null,
  now: Date = new Date(),
): Promise<{ sessionsMasked: number; vehiclesDeleted: number }> {
  const cutoff = subMonths(now, RETENTION_MONTHS)
  const prisma = db as PrismaClient

  const { sessionsMasked, vehiclesDeleted } = await prisma.$transaction(async (tx) => {
    const masked = await tx.parkingSession.updateMany({
      where: { status: 'CLOSED', exitTime: { lt: cutoff }, plateSnapshot: { not: PURGED } },
      data: { plateSnapshot: PURGED },
    })

    const candidates = await tx.vehicle.findMany({
      where: {
        ownerId: null,
        reservations: { none: {} },
        // A vehicle still parked (OPEN session) must survive until checkout,
        // or staff could no longer find its session at exit.
        AND: [
          { sessions: { none: { exitTime: { gte: cutoff } } } },
          { sessions: { none: { status: 'OPEN' } } },
        ],
      },
      select: { id: true },
    })

    const vehicleIds = candidates.map((v) => v.id)
    if (vehicleIds.length > 0) {
      await tx.parkingSession.updateMany({
        where: { vehicleId: { in: vehicleIds } },
        data: { vehicleId: null },
      })
      await tx.vehicle.deleteMany({ where: { id: { in: vehicleIds } } })
    }

    return { sessionsMasked: masked.count, vehiclesDeleted: vehicleIds.length }
  })

  await logAccess(db, {
    userId: actorId,
    action: 'PURGE',
    target: `${sessionsMasked} sessions, ${vehiclesDeleted} vehicles`,
  })

  return { sessionsMasked, vehiclesDeleted }
}
