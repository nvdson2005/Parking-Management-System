import { presentPlate } from '@/lib/plate'
import type { Role } from '@/lib/types'

/**
 * Renders a vehicle's plate the way `viewer` is allowed to see it (full for
 * STAFF/MANAGER or the vehicle's own owner, masked otherwise), via
 * `presentPlate`.
 */
export function PlateText({
  plate,
  ownerId,
  viewer,
}: {
  plate: string
  ownerId: string | null
  viewer: { id: string; role: Role } | null
}) {
  return <span className="font-mono">{presentPlate(plate, viewer, ownerId)}</span>
}
