import type { PrismaClient } from '@prisma/client'
import type { Db } from '@/server/db'

/**
 * Runs `fn` in one transaction so a change and the audit row that records it
 * commit together (FR-43). A `db` that is already a transaction client has no
 * `$transaction`; then `fn` joins that transaction instead of opening one.
 */
export async function inTransaction<T>(db: Db, fn: (tx: Db) => Promise<T>): Promise<T> {
  if ('$transaction' in db) return (db as PrismaClient).$transaction((tx) => fn(tx))
  return fn(db)
}
