import { db } from '@/server/db'
import { handle, readJsonObject } from '@/server/api'
import { requireRole } from '@/server/auth/rbac'
import { createReservation, listReservations } from '@/server/services/reservations'

export const GET = handle(async () => {
  const user = await requireRole('CUSTOMER')
  return listReservations(db, user.id)
})

export const POST = handle(async (req) => {
  const user = await requireRole('CUSTOMER')
  const body = await readJsonObject(req)
  // createReservation re-validates these untrusted fields with its own schema;
  // a missing/invalid arrivalTime becomes an invalid Date it rejects as VALIDATION.
  return createReservation(db, {
    customerId: user.id,
    vehicleId: body.vehicleId as string,
    zoneId: body.zoneId as string,
    arrivalTime: new Date(body.arrivalTime as string),
  })
})
