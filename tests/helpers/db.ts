import bcrypt from 'bcryptjs'
import { db } from '@/server/db'
import type { FeeGroup, VehicleTypeCode } from '@/lib/types'

const ROLES = ['CUSTOMER', 'STAFF', 'MANAGER'] as const

const VEHICLE_TYPES: { code: VehicleTypeCode; nameVi: string; nameEn: string }[] = [
  { code: 'MOTORBIKE', nameVi: 'Xe máy', nameEn: 'Motorbike' },
  { code: 'CAR', nameVi: 'Ô tô', nameEn: 'Car' },
]

/**
 * Deletes all rows child-first, then re-seeds the role and vehicle-type
 * reference rows every other table depends on.
 */
export async function resetDb(): Promise<void> {
  await db.payment.deleteMany()
  await db.sessionEvent.deleteMany()
  await db.parkingSession.deleteMany()
  await db.reservation.deleteMany()
  await db.accessLog.deleteMany()
  await db.vehicle.deleteMany()
  await db.tariff.deleteMany()
  await db.zoneCapacity.deleteMany()
  await db.zone.deleteMany()
  await db.parkingLot.deleteMany()
  await db.user.deleteMany()

  for (const code of ROLES) {
    await db.role.upsert({ where: { code }, update: {}, create: { code } })
  }

  for (const vehicleType of VEHICLE_TYPES) {
    await db.vehicleType.upsert({
      where: { code: vehicleType.code },
      update: {},
      create: vehicleType,
    })
  }
}

export type Fixture = Awaited<ReturnType<typeof makeFixture>>

const PASSWORD = 'password123'

export async function makeFixture(opts?: {
  motoCapA?: number
  carCapC?: number
  tariffs?: Partial<Record<`${VehicleTypeCode}_${FeeGroup}`, number>>
}) {
  const passwordHash = await bcrypt.hash(PASSWORD, 10)

  const lot = await db.parkingLot.create({
    data: { name: 'Test Lot', address: 'Test Address', status: 'ACTIVE' },
  })

  const zoneA = await db.zone.create({ data: { lotId: lot.id, name: 'A' } })
  const zoneB = await db.zone.create({ data: { lotId: lot.id, name: 'B' } })
  const zoneC = await db.zone.create({ data: { lotId: lot.id, name: 'C' } })

  await db.zoneCapacity.create({
    data: { zoneId: zoneA.id, vehicleTypeCode: 'MOTORBIKE', capacity: opts?.motoCapA ?? 2 },
  })
  await db.zoneCapacity.create({
    data: { zoneId: zoneB.id, vehicleTypeCode: 'MOTORBIKE', capacity: 2 },
  })
  await db.zoneCapacity.create({
    data: { zoneId: zoneC.id, vehicleTypeCode: 'CAR', capacity: opts?.carCapC ?? 1 },
  })

  const defaultPrices: Record<VehicleTypeCode, number> = { MOTORBIKE: 2000, CAR: 10000 }
  const feeGroups: FeeGroup[] = ['STUDENT', 'LECTURER_STAFF', 'GUEST']
  const vehicleTypes: VehicleTypeCode[] = ['MOTORBIKE', 'CAR']

  for (const vehicleTypeCode of vehicleTypes) {
    for (const feeGroup of feeGroups) {
      const key = `${vehicleTypeCode}_${feeGroup}` as const
      const price = opts?.tariffs?.[key] ?? defaultPrices[vehicleTypeCode]
      await db.tariff.create({ data: { vehicleTypeCode, feeGroup, price } })
    }
  }

  const staff = await db.user.create({
    data: {
      email: 'staff@test.local',
      passwordHash,
      name: 'Test Staff',
      roleCode: 'STAFF',
    },
  })

  const manager = await db.user.create({
    data: {
      email: 'manager@test.local',
      passwordHash,
      name: 'Test Manager',
      roleCode: 'MANAGER',
    },
  })

  const student = await db.user.create({
    data: {
      email: 'student@test.local',
      passwordHash,
      name: 'Test Student',
      roleCode: 'CUSTOMER',
      userGroup: 'STUDENT',
    },
  })

  const lecturer = await db.user.create({
    data: {
      email: 'lecturer@test.local',
      passwordHash,
      name: 'Test Lecturer',
      roleCode: 'CUSTOMER',
      userGroup: 'LECTURER_STAFF',
    },
  })

  return { lot, zoneA, zoneB, zoneC, staff, manager, student, lecturer }
}
