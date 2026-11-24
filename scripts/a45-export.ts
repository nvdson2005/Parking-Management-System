// CLI tien dung: xuat CSDL theo DATABASE_URL hien tai ra file.
//   npx tsx scripts/a45-export.ts <file-output>
// Runner A-45 (a45-replay.ts) goi truc tiep exportDatabase, khong qua file nay.
import { PrismaClient } from '@prisma/client'
import { writeFileSync } from 'fs'
import { exportDatabase } from './a45-export-lib'

const prisma = new PrismaClient()

async function main() {
  const out = process.argv[2]
  if (!out) throw new Error('Thieu duong dan file output')
  writeFileSync(out, await exportDatabase(prisma), 'utf8')
  console.log(`Exported -> ${out}`)
}

main()
  .catch(e => { console.error(e); process.exitCode = 1 })
  .finally(() => prisma.$disconnect())
