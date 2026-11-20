import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'

const SKIP = /(^id$|_id$|Id$|_at$|At$|^target$|time|Time|date|Date|hash|Hash|token|Token)/
const prisma = new PrismaClient()

async function main() {
  const out = process.argv[2]
  const tables = await prisma.$queryRawUnsafe<{ name: string }[]>(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE '\\_%' ESCAPE '\\' AND name NOT LIKE 'sqlite_%' ORDER BY name")
  const lines: string[] = []
  for (const { name } of tables) {
    const rows = await prisma.$queryRawUnsafe<Record<string, unknown>[]>(`SELECT * FROM "${name}" ORDER BY rowid`)
    lines.push(`## ${name} (${rows.length})`)
    for (const r of rows) {
      const kept = Object.entries(r).filter(([k]) => !SKIP.test(k))
        .map(([k, v]) => `${k}=${typeof v === 'bigint' ? v.toString() : JSON.stringify(v)}`)
      lines.push(kept.join(' | '))
    }
  }
  writeFileSync(out, lines.join('\n'))
  console.log(`Exported ${tables.length} tables -> ${out}`)
}
main().finally(() => prisma.$disconnect())