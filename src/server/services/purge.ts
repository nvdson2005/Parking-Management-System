import type { PrismaClient } from '@prisma/client'
import type { Db } from '@/server/db'
import { logAccess } from '@/server/services/accessLog'
import { subMonths } from '@/lib/time'
import { OBSERVED_PLATE_PREFIX, PLATE_MISMATCH_EVENT, PURGED_PLATE, observedPlateNote } from '@/lib/plate'

const PURGED = PURGED_PLATE
const RETENTION_MONTHS = 12

/**
 * Applies the 12-month data-retention policy (FR-32, D-29). With
 * `cutoff = subMonths(now, 12)`:
 *   - Every CLOSED session with `exitTime < cutoff` whose plate is not yet
 *     masked gets `plateSnapshot = '[purged]'`. The 12 months run from the
 *     exit, when the session closes (Q44); an OPEN session is still in use.
 *     The plate seen at the exit in their EX-02 notes is purged too; a staff
 *     note after it is kept.
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

    const notes = await tx.sessionEvent.findMany({
      where: {
        // Only the system-written EX-02 note; a LOST_CARD note is staff text.
        type: PLATE_MISMATCH_EVENT,
        note: { startsWith: OBSERVED_PLATE_PREFIX, not: { startsWith: `${OBSERVED_PLATE_PREFIX}${PURGED}` } },
        session: { status: 'CLOSED', exitTime: { lt: cutoff } },
      },
      select: { id: true, note: true },
    })
    for (const event of notes) {
      const tail = event.note!.slice(OBSERVED_PLATE_PREFIX.length).split(' — ').slice(1).join(' — ')
      await tx.sessionEvent.update({ where: { id: event.id }, data: { note: observedPlateNote(PURGED, tail || null) } })
    }

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

    // The PURGE row commits with the purge itself (FR-43, spec 002 FR-003).
    await logAccess(tx, {
      userId: actorId,
      action: 'PURGE',
      target: `${masked.count} sessions, ${vehicleIds.length} vehicles`,
    })
    return { sessionsMasked: masked.count, vehiclesDeleted: vehicleIds.length }
  })

  return { sessionsMasked, vehiclesDeleted }
}
