import { z } from 'zod'
import type { Db } from '@/server/db'
import { presentPlate } from '@/lib/plate'
import type { Role, SessionStatus, VehicleTypeCode } from '@/lib/types'

const listSessionsSchema = z.object({
  status: z.enum(['OPEN', 'CLOSED']).default('OPEN'),
})

export type SessionListItem = {
  id: string
  plate: string
  zoneName: string
  vehicleTypeCode: VehicleTypeCode
  entryTime: Date
  exitTime: Date | null
  status: SessionStatus
}

/**
 * Parking sessions by status, newest entry first (A-65, KB-15; FR-13 view).
 * The plate goes through `presentPlate` for the viewer, so the same rule
 * applies as on every screen. Used by GET /api/sessions and the staff
 * sessions page.
 */
export async function listSessions(
  db: Db,
  input: { status?: string },
  viewer: { id: string; role: Role },
): Promise<SessionListItem[]> {
  const { status } = listSessionsSchema.parse(input)
  const rows = await db.parkingSession.findMany({
    where: { status },
    include: { zone: { select: { name: true } } },
    orderBy: { entryTime: 'desc' },
  })
  return rows.map((s) => ({
    id: s.id,
    plate: presentPlate(s.plateSnapshot, viewer, s.ownerId),
    zoneName: s.zone.name,
    vehicleTypeCode: s.vehicleTypeCode as VehicleTypeCode,
    entryTime: s.entryTime,
    exitTime: s.exitTime,
    status: s.status as SessionStatus,
  }))
}
