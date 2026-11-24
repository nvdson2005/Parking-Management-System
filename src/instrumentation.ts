import { db } from '@/server/db'
import { expireReservations } from '@/server/services/reservations'
import { publishAvailabilityChanged } from '@/server/bus'
import { registerPurgeSchedule } from '@/server/purgeSchedule'

const EXPIRY_INTERVAL_MS = 30_000

/**
 * Next.js instrumentation hook. On the Node.js runtime it starts two timers:
 * - a 30 s timer that expires stale PENDING reservations (FR-23) and
 *   broadcasts an availability change only when it actually freed one or
 *   more holds;
 * - the automatic 12-month data purge, one run 60 s after start and then
 *   daily (A-28, G-05, Q35; see `src/server/purgeSchedule.ts`).
 * Each has its own `globalThis` guard against double registration across HMR
 * reloads and repeated `register()` calls.
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  // Registered before the expiry guard below, whose early return must not skip it.
  registerPurgeSchedule()

  const store = globalThis as typeof globalThis & { __reservationExpiryTimer?: NodeJS.Timeout }
  if (store.__reservationExpiryTimer) return

  store.__reservationExpiryTimer = setInterval(() => {
    expireReservations(db)
      .then((count) => {
        if (count > 0) publishAvailabilityChanged()
      })
      .catch(() => {
        // A transient expiry failure is retried on the next tick; never crash
        // the server from the timer.
      })
  }, EXPIRY_INTERVAL_MS)
  // Don't let the timer keep the process alive on its own.
  store.__reservationExpiryTimer.unref?.()
}
