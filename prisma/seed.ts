import bcrypt from 'bcryptjs'
import { db } from '../src/server/db'
import { addVehicle } from '../src/server/services/vehicles'
import type { FeeGroup, UserGroup, VehicleTypeCode } from '../src/lib/types'

const PASSWORD = 'password123'

async function main() {
  // Clear all tables in the same child-first order as resetDb.
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

  for (const code of ['CUSTOMER', 'STAFF', 'MANAGER'] as const) {
    await db.role.upsert({ where: { code }, update: {}, create: { code } })
  }

  const vehicleTypes: { code: VehicleTypeCode; nameVi: string; nameEn: string }[] = [
    { code: 'MOTORBIKE', nameVi: 'Xe máy', nameEn: 'Motorbike' },
    { code: 'CAR', nameVi: 'Ô tô', nameEn: 'Car' },
  ]
  for (const vehicleType of vehicleTypes) {
    await db.vehicleType.upsert({
      where: { code: vehicleType.code },
      update: {},
      create: vehicleType,
    })
  }

  const lot = await db.parkingLot.create({
    data: { name: 'Bãi xe thí điểm', address: 'Cơ sở chính', status: 'ACTIVE' },
  })

  const zoneA = await db.zone.create({ data: { lotId: lot.id, name: 'A' } })
  const zoneB = await db.zone.create({ data: { lotId: lot.id, name: 'B' } })
  const zoneC = await db.zone.create({ data: { lotId: lot.id, name: 'C' } })

  await db.zoneCapacity.create({
    data: { zoneId: zoneA.id, vehicleTypeCode: 'MOTORBIKE', capacity: 150 },
  })
  await db.zoneCapacity.create({
    data: { zoneId: zoneB.id, vehicleTypeCode: 'MOTORBIKE', capacity: 150 },
  })
  await db.zoneCapacity.create({
    data: { zoneId: zoneC.id, vehicleTypeCode: 'CAR', capacity: 30 },
  })

  const prices: Record<VehicleTypeCode, number> = { MOTORBIKE: 2000, CAR: 10000 }
  const feeGroups: FeeGroup[] = ['STUDENT', 'LECTURER_STAFF', 'GUEST']
  for (const vehicleTypeCode of ['MOTORBIKE', 'CAR'] as VehicleTypeCode[]) {
    for (const feeGroup of feeGroups) {
      await db.tariff.create({
        data: { vehicleTypeCode, feeGroup, price: prices[vehicleTypeCode] },
      })
    }
  }

  const passwordHash = await bcrypt.hash(PASSWORD, 10)

  for (const n of [1, 2]) {
    await db.user.create({
      data: {
        email: `manager${n}@demo.local`,
        passwordHash,
        name: `Manager ${n}`,
        roleCode: 'MANAGER',
      },
    })
  }

  for (const n of [1, 2]) {
    await db.user.create({
      data: {
        email: `staff${n}@demo.local`,
        passwordHash,
        name: `Staff ${n}`,
        roleCode: 'STAFF',
      },
    })
  }

  for (let n = 1; n <= 15; n++) {
    const num = String(n).padStart(2, '0')
    const userGroup: UserGroup = n % 2 === 1 ? 'STUDENT' : 'LECTURER_STAFF'
    const customer = await db.user.create({
      data: {
        email: `customer${num}@demo.local`,
        passwordHash,
        name: `Customer ${num}`,
        roleCode: 'CUSTOMER',
        userGroup,
      },
    })

    await addVehicle(db, {
      ownerId: customer.id,
      plate: `29A-${num}001`,
      vehicleType: 'MOTORBIKE' as VehicleTypeCode,
    })
  }
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })
