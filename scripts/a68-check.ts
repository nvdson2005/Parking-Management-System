// A-68 / CP-05 read-only check (O1, O2, T05, T11).
// Counts occupancy straight from the database, independent of the simulator's
// counters and of the availability service, and checks every session record.
// Usage (PowerShell):  $env:DATABASE_URL="file:./a67.db"; npx tsx scripts/a68-check.ts
// It only reads. It never writes to the database.
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const now = new Date()

  // ---- O1 / T05: independent occupancy count per zone and vehicle type ----
  const caps = await db.zoneCapacity.findMany({ include: { zone: true } })
  const sessions = await db.parkingSession.findMany({
    include: { payment: true, events: true },
  })
  const pending = await db.reservation.findMany({
    where: { status: 'PENDING', holdUntil: { gt: now } },
  })

  console.log('\n== O1 / T05: independent occupancy count ==')
  console.log('zone | type | capacity | open | pending res. | expected free')
  for (const c of caps.filter((x) => x.capacity > 0).sort((a, b) => a.zone.name.localeCompare(b.zone.name))) {
    const open = sessions.filter(
      (s) => s.zoneId === c.zoneId && s.vehicleTypeCode === c.vehicleTypeCode && s.status === 'OPEN',
    ).length
    const res = pending.filter((r) => r.zoneId === c.zoneId && r.vehicleTypeCode === c.vehicleTypeCode).length
    const free = Math.max(0, c.capacity - open - res)
    console.log(`${c.zone.name} | ${c.vehicleTypeCode} | ${c.capacity} | ${open} | ${res} | ${free}`)
  }

  // ---- O2 / T11: every session has a complete record ----
  const problems: string[] = []
  for (const s of sessions) {
    const miss: string[] = []
    if (!s.plateSnapshot) miss.push('plateSnapshot')
    if (!s.zoneId) miss.push('zone')
    if (!s.vehicleTypeCode) miss.push('vehicleType')
    if (!s.feeGroup) miss.push('feeGroup')
    if (!['PLATE', 'QR', 'RFID'].includes(s.idMethod)) miss.push(`idMethod=${s.idMethod}`)
    if (!s.entryTime) miss.push('entryTime')
    if (!s.entryStaffId) miss.push('entryStaff')
    if (s.status === 'CLOSED') {
      if (!s.exitTime) miss.push('exitTime')
      else if (s.exitTime < s.entryTime) miss.push('exitTime<entryTime')
      if (!s.exitStaffId) miss.push('exitStaff')
      if (!s.payment) miss.push('payment')
      else if (s.payment.amount < 0) miss.push('payment<0')
    } else if (s.status === 'OPEN') {
      if (s.exitTime || s.exitStaffId || s.payment) miss.push('OPEN session has exit data')
    } else {
      miss.push(`status=${s.status}`)
    }
    if (miss.length) problems.push(`${s.id} ${s.plateSnapshot}: ${miss.join(', ')}`)
  }
  const closed = sessions.filter((s) => s.status === 'CLOSED').length
  console.log('\n== O2 / T11: record completeness ==')
  console.log(`sessions: ${sessions.length} (open ${sessions.length - closed}, closed ${closed})`)
  console.log(`incomplete: ${problems.length}`)
  problems.slice(0, 20).forEach((p) => console.log('  ' + p))

  // ---- T07 / T08: exception events written by the staff exit ----
  const events = await db.sessionEvent.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { session: { include: { payment: true } } },
  })
  console.log('\n== T07 / T08: latest session events ==')
  for (const e of events) {
    console.log(
      `${e.createdAt.toISOString()} | ${e.type} | ${e.session.plateSnapshot} | status ${e.session.status} | fee ${e.session.payment?.amount ?? '-'} | note ${e.note ?? ''}`,
    )
  }
  const manual = await db.accessLog.findMany({
    where: { action: 'MANUAL_CONFIRM' },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
  console.log('\n== Access log MANUAL_CONFIRM (latest 5) ==')
  manual.forEach((m) => console.log(`${m.createdAt.toISOString()} | target ${m.target}`))
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => db.$disconnect())
