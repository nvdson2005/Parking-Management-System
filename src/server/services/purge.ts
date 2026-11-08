import type { PrismaClient } from '@prisma/client'
import type { Db } from '@/server/db'
import { logAccess } from '@/server/services/accessLog'
import { subMonths } from '@/lib/time'

const PURGED = '[purged]'
const RETENTION_MONTHS = 12

/**
 * Applies the 12-month data-retention policy (FR-32, D-29). With
 * `cutoff = subMonths(now, 12)`:
 *   - Every session with `entryTime < cutoff` whose plate is not yet masked
 *     gets `plateSnapshot = '[purged]'`.
 *   - Every ownerless vehicle that has no session at/after the cutoff and no
 *     reservation is deleted; its old sessions are detached (`vehicleId =
 *     null`) first so the historical/masked rows survive the delete.
 * Logs `PURGE` with target `"<n> sessions, <m> vehicles"` and returns counts.
 */
export async function purgeOldData(
  db: Db,
  actorId: string,
  now: Date = new Date(),
): Promise<{ sessionsMasked: number; vehiclesDeleted: number }> {
  const cutoff = subMonths(now, RETENTION_MONTHS)
  const prisma = db as PrismaClient

  const { sessionsMasked, vehiclesDeleted } = await prisma.$transaction(async (tx) => {
    const masked = await tx.parkingSession.updateMany({
      where: { entryTime: { lt: cutoff }, plateSnapshot: { not: PURGED } },
      data: { plateSnapshot: PURGED },
    })

    const candidates = await tx.vehicle.findMany({
      where: {
        ownerId: null,
        reservations: { none: {} },
        sessions: { none: { entryTime: { gte: cutoff } } },
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
