import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

// Bo cot khong on dinh giua cac lan chay (id, thoi gian, hash, token).
// Cot khoa ngoai toi zones duoc doi thanh ten khu vuc truoc khi loc (xem ZONE_FK).
// qr_code / rfid_code: seed.ts va viec tao xe moi sinh ma ngau nhien KHONG theo seed,
// nen khac nhau sau moi lan reset (truoc day phai tao them run*-noqr.txt de so sanh).
const SKIP = /(^id$|_id$|Id$|_at$|At$|^target$|time|Time|date|Date|hash|Hash|token|Token|^qr_code$|^rfid_code$)/
const ZONE_FK = /^zone_?id$/i
const prisma = new PrismaClient()

type Row = Record<string, unknown>
const fmt = (v: unknown) => (typeof v === 'bigint' ? v.toString() : JSON.stringify(v))
const zoneKey = (r: Row) => Object.keys(r).find(k => ZONE_FK.test(k))

async function main() {
  const out = process.argv[2]
  if (!out) throw new Error('Thieu duong dan file output')

  const tables = await prisma.$queryRawUnsafe<{ name: string }[]>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '\\_%' ESCAPE '\\' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  const data: Record<string, Row[]> = {}
  for (const { name } of tables) {
    data[name] = await prisma.$queryRawUnsafe<Row[]>(`SELECT * FROM "${name}" ORDER BY rowid`)
  }

  const zones = data['zones']
  if (!zones?.length) throw new Error('Khong doc duoc bang zones')
  const zoneName = new Map(zones.map(z => [String(z.id), String(z.name)]))

  const lines: string[] = []
  for (const { name } of tables) {
    const rows = data[name]
    lines.push(`## ${name} (${rows.length})`)
    for (const r of rows) {
      const zk = zoneKey(r)
      const zone = zk && r[zk] != null ? [`zone=${JSON.stringify(zoneName.get(String(r[zk])) ?? 'UNKNOWN')}`] : []
      const kept = Object.entries(r).filter(([k]) => !SKIP.test(k)).map(([k, v]) => `${k}=${fmt(v)}`)
      lines.push([...zone, ...kept].join(' | '))
    }
  }

  // Cho trong theo khu: free = capacity - so luot dang mo cua khu va loai xe do
  const caps = data['zone_capacities'] ?? []
  const sessions = data['parking_sessions'] ?? []
  const capZk = caps[0] && zoneKey(caps[0])
  const sesZk = sessions[0] && zoneKey(sessions[0])
  if (!capZk || (sessions.length && !sesZk)) throw new Error('Khong tim thay cot zone_id trong zone_capacities/parking_sessions')

  const avail = caps
    .map(c => {
      const zone = zoneName.get(String(c[capZk])) ?? 'UNKNOWN'
      const type = String(c.vehicle_type_code)
      const capacity = Number(c.capacity)
      const open = sessions.filter(s =>
        String(s[sesZk!]) === String(c[capZk]) && s.vehicle_type_code === type && s.status === 'OPEN').length
      return { zone, type, capacity, open, free: capacity - open }
    })
    .sort((a, b) => a.zone.localeCompare(b.zone) || a.type.localeCompare(b.type))

  lines.push(`## zone_availability (${avail.length})`)
  for (const a of avail) {
    lines.push(`zone="${a.zone}" | vehicle_type_code="${a.type}" | capacity=${a.capacity} | open=${a.open} | free=${a.free}`)
  }
  const totals = new Map<string, number>()
  for (const a of avail) totals.set(a.type, (totals.get(a.type) ?? 0) + a.free)
  for (const [type, free] of [...totals].sort()) lines.push(`total | vehicle_type_code="${type}" | free=${free}`)

  writeFileSync(out, lines.join('\n') + '\n', 'utf8')
  console.log(`Exported ${tables.length} tables + zone_availability -> ${out}`)
}

main()
  .catch(e => { console.error(e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())
