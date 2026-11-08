import { execSync } from 'child_process'
import { existsSync } from 'fs'

export default async function setup() {
  if (existsSync('prisma/schema.prisma')) {
    execSync('npx prisma db push --force-reset --skip-generate', {
      env: {
        ...process.env,
        DATABASE_URL: 'file:./test.db',
      },
      stdio: 'inherit',
    })
  }
}
