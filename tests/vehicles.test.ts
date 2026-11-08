import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'
import { resetDb, makeFixture } from './helpers/db'
import { addVehicle, listVehicles, removeVehicle, findVehicleByIdentifier, generateCode } from '@/server/services/vehicles'

describe('generateCode', () => {
  it('generates QR- and RF- prefixed base32 codes', () => {
    expect(generateCode('QR')).toMatch(/^QR-[A-Z2-7]{10}$/)
    expect(generateCode('RF')).toMatch(/^RF-[A-Z2-7]{10}$/)
  })

  it('generates distinct codes across calls', () => {
    const a = generateCode('QR')
    const b = generateCode('QR')
    expect(a).not.toBe(b)
  })
})

describe('vehicles service', () => {
  it('adds vehicle with QR- and RF- codes', async () => {
    await resetDb()
    const f = await makeFixture()

    const v = await addVehicle(db, { ownerId: f.student.id, plate: '51f-123.45', vehicleType: 'MOTORBIKE' })

    expect(v.plate).toBe('51F-123.45')
    expect(v.qrCode).toMatch(/^QR-[A-Z2-7]{10}$/)
    expect(v.rfidCode).toMatch(/^RF-[A-Z2-7]{10}$/)
    expect(v.ownerId).toBe(f.student.id)
    expect(v.vehicleTypeCode).toBe('MOTORBIKE')
  })

  it('claims existing guest vehicle (ownerId null -> set, codes/type kept)', async () => {
    await resetDb()
    const f = await makeFixture()

    const guestVehicle = await db.vehicle.create({
      data: {
        plate: '29A-11111',
        qrCode: 'QR-GUESTCODE1',
        rfidCode: 'RF-GUESTCODE1',
        vehicleTypeCode: 'MOTORBIKE',
        ownerId: null,
      },
    })

    const claimed = await addVehicle(db, { ownerId: f.student.id, plate: '29a-11111', vehicleType: 'MOTORBIKE' })

    expect(claimed.id).toBe(guestVehicle.id)
    expect(claimed.ownerId).toBe(f.student.id)
    expect(claimed.qrCode).toBe(guestVehicle.qrCode)
    expect(claimed.rfidCode).toBe(guestVehicle.rfidCode)
    expect(claimed.vehicleTypeCode).toBe(guestVehicle.vehicleTypeCode)
  })

  it('rejects plate owned by another customer with PLATE_TAKEN', async () => {
    await resetDb()
    const f = await makeFixture()

    await addVehicle(db, { ownerId: f.student.id, plate: '30A-99999', vehicleType: 'MOTORBIKE' })

    await expect(
      addVehicle(db, { ownerId: f.lecturer.id, plate: '30A-99999', vehicleType: 'MOTORBIKE' }),
    ).rejects.toMatchObject({ code: 'PLATE_TAKEN' })
  })

  it('rejects re-adding a plate already owned by the same customer (PLATE_TAKEN)', async () => {
    await resetDb()
    const f = await makeFixture()

    await addVehicle(db, { ownerId: f.student.id, plate: '30A-88888', vehicleType: 'MOTORBIKE' })

    await expect(
      addVehicle(db, { ownerId: f.student.id, plate: '30A-88888', vehicleType: 'MOTORBIKE' }),
    ).rejects.toMatchObject({ code: 'PLATE_TAKEN' })
  })

  it('allows multiple vehicles per customer', async () => {
    await resetDb()
    const f = await makeFixture()

    await addVehicle(db, { ownerId: f.student.id, plate: '30A-11111', vehicleType: 'MOTORBIKE' })
    await addVehicle(db, { ownerId: f.student.id, plate: '30A-22222', vehicleType: 'CAR' })

    const vehicles = await listVehicles(db, f.student.id)
    expect(vehicles).toHaveLength(2)
  })

  it('treats hyphen/spacing variants of the same plate as one vehicle (addVehicle)', async () => {
    await resetDb()
    const f = await makeFixture()

    await addVehicle(db, { ownerId: f.student.id, plate: '51F 123.45', vehicleType: 'MOTORBIKE' })

    // Same plate characters, different separator placement -> must collide,
    // not create a second row, even though the normalized strings differ.
    await expect(
      addVehicle(db, { ownerId: f.lecturer.id, plate: '51F-123.45', vehicleType: 'MOTORBIKE' }),
    ).rejects.toMatchObject({ code: 'PLATE_TAKEN' })

    const vehicles = await listVehicles(db, f.student.id)
    expect(vehicles).toHaveLength(1)
  })

  it('rejects concurrent registrations of separator variants of the same plate', async () => {
    await resetDb()
    const f = await makeFixture()

    const results = await Promise.allSettled([
      addVehicle(db, { ownerId: f.student.id, plate: '51F-123.45', vehicleType: 'MOTORBIKE' }),
      addVehicle(db, { ownerId: f.lecturer.id, plate: '51F 123.45', vehicleType: 'MOTORBIKE' }),
    ])

    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
    expect(results.filter((result) => result.status === 'rejected')).toHaveLength(1)
    const rejected = results.find((result) => result.status === 'rejected')
    expect(rejected).toMatchObject({ reason: { code: 'PLATE_TAKEN' } })
    expect(await db.vehicle.count()).toBe(1)
  })

  it('rejects concurrent registrations of the exact same plate string', async () => {
    await resetDb()
    const f = await makeFixture()

    const results = await Promise.allSettled([
      addVehicle(db, { ownerId: f.student.id, plate: '30A-70001', vehicleType: 'MOTORBIKE' }),
      addVehicle(db, { ownerId: f.lecturer.id, plate: '30A-70001', vehicleType: 'MOTORBIKE' }),
    ])

    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
    const rejected = results.find((result) => result.status === 'rejected')
    expect(rejected).toMatchObject({ reason: { code: 'PLATE_TAKEN' } })
    expect(await db.vehicle.count()).toBe(1)
  })

  it('serializes concurrent claims of the same Guest vehicle to a single winner', async () => {
    await resetDb()
    const f = await makeFixture()

    const guestVehicle = await db.vehicle.create({
      data: {
        plate: '30A-70002',
        qrCode: 'QR-GUESTRACE1',
        rfidCode: 'RF-GUESTRACE1',
        vehicleTypeCode: 'MOTORBIKE',
        ownerId: null,
      },
    })

    const results = await Promise.allSettled([
      addVehicle(db, { ownerId: f.student.id, plate: '30A-70002', vehicleType: 'MOTORBIKE' }),
      addVehicle(db, { ownerId: f.lecturer.id, plate: '30A 700 02', vehicleType: 'MOTORBIKE' }),
    ])

    expect(results.filter((result) => result.status === 'fulfilled')).toHaveLength(1)
    const rejected = results.find((result) => result.status === 'rejected')
    expect(rejected).toMatchObject({ reason: { code: 'PLATE_TAKEN' } })

    const final = await db.vehicle.findUnique({ where: { id: guestVehicle.id } })
    expect([f.student.id, f.lecturer.id]).toContain(final?.ownerId)
    expect(await db.vehicle.count()).toBe(1)
  })

  it('removeVehicle: NOT_OWNER when vehicle belongs to someone else', async () => {
    await resetDb()
    const f = await makeFixture()
    const v = await addVehicle(db, { ownerId: f.student.id, plate: '30A-33333', vehicleType: 'MOTORBIKE' })

    await expect(removeVehicle(db, f.lecturer.id, v.id)).rejects.toMatchObject({ code: 'NOT_OWNER' })
  })

  it('removeVehicle: deletes a vehicle without sessions/reservations', async () => {
    await resetDb()
    const f = await makeFixture()
    const v = await addVehicle(db, { ownerId: f.student.id, plate: '30A-44444', vehicleType: 'MOTORBIKE' })

    await removeVehicle(db, f.student.id, v.id)

    const vehicles = await listVehicles(db, f.student.id)
    expect(vehicles).toHaveLength(0)
    expect(await db.vehicle.findUnique({ where: { id: v.id } })).toBeNull()
  })

  it('removeVehicle: unlinks (ownerId = null) instead of deleting when it has a session', async () => {
    await resetDb()
    const f = await makeFixture()
    const v = await addVehicle(db, { ownerId: f.student.id, plate: '30A-55555', vehicleType: 'MOTORBIKE' })

    await db.parkingSession.create({
      data: {
        vehicleId: v.id,
        plateSnapshot: v.plate,
        zoneId: f.zoneA.id,
        vehicleTypeCode: 'MOTORBIKE',
        feeGroup: 'STUDENT',
        idMethod: 'PLATE',
        entryTime: new Date(),
        entryStaffId: f.staff.id,
        status: 'OPEN',
      },
    })

    await removeVehicle(db, f.student.id, v.id)

    const stillThere = await db.vehicle.findUnique({ where: { id: v.id } })
    expect(stillThere).not.toBeNull()
    expect(stillThere?.ownerId).toBeNull()
  })

  it('findVehicleByIdentifier finds by plate case-insensitively, by QR and by RFID', async () => {
    await resetDb()
    const f = await makeFixture()
    const v = await addVehicle(db, { ownerId: f.student.id, plate: '30A-66666', vehicleType: 'MOTORBIKE' })

    expect((await findVehicleByIdentifier(db, 'PLATE', '30a-66666'))?.id).toBe(v.id)
    expect((await findVehicleByIdentifier(db, 'QR', v.qrCode.toLowerCase()))?.id).toBe(v.id)
    expect((await findVehicleByIdentifier(db, 'RFID', ` ${v.rfidCode} `))?.id).toBe(v.id)
    expect(await findVehicleByIdentifier(db, 'PLATE', 'NOSUCH-1')).toBeNull()
  })

  it('findVehicleByIdentifier resolves hyphen/spacing plate variants to the same vehicle', async () => {
    await resetDb()
    const f = await makeFixture()
    const v = await addVehicle(db, { ownerId: f.student.id, plate: '30A-77777', vehicleType: 'MOTORBIKE' })

    expect((await findVehicleByIdentifier(db, 'PLATE', '30A77777'))?.id).toBe(v.id)
    expect((await findVehicleByIdentifier(db, 'PLATE', '30A 777 77'))?.id).toBe(v.id)
  })
})
