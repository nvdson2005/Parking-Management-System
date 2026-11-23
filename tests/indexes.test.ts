import { describe, it, expect } from 'vitest'
import { db } from '@/server/db'

// A-65, G-07 (P03 v0.4 §7): indexes for time filters and the per-account
// reservation check. The test DB is built from schema.prisma; the migration
// is checked separately with `prisma migrate diff` (quickstart.md).
const INDEXES = [
  'reservations_customer_id_status_idx',
  'parking_sessions_entry_time_idx',
  'access_logs_created_at_idx',
  'access_logs_user_id_idx',
]

describe('G-07 indexes (A-65)', () => {
  for (const name of INDEXES) {
    it(`index ${name} exists`, async () => {
      const rows = await db.$queryRawUnsafe<Array<{ name: string }>>(
        "SELECT name FROM sqlite_master WHERE type = 'index' AND name = ?",
        name,
      )
      expect(rows).toHaveLength(1)
    })
  }
})
