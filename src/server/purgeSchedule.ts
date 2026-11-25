import { db } from '@/server/db'
import { purgeOldData } from '@/server/services/purge'

/** First automatic run, shortly after start so start-up stays free of a DB transaction. */
export const PURGE_FIRST_DELAY_MS = 60_000
/** Then once a day (FR-45, Q35: plates on finished sessions are hidden automatically after 12 months). */
export const PURGE_INTERVAL_MS = 24 * 60 * 60 * 1000

type PurgeScheduleState = {
  startTimer: NodeJS.Timeout
  intervalTimer?: NodeJS.Timeout
}

const store = globalThis as typeof globalThis & { __purgeSchedule?: PurgeScheduleState }

/**
 * Starts the automatic 12-month retention purge (A-28, G-05): one run after
 * {@link PURGE_FIRST_DELAY_MS}, then every {@link PURGE_INTERVAL_MS}. The run is
 * a system action (`purgeOldData(db, null)`), so its PURGE log row has no user.
 * A `globalThis` guard makes repeated calls (HMR, repeated instrumentation
 * hooks) a no-op. Node.js runtime only; never import this from Edge code.
 */
export function registerPurgeSchedule(opts: { run?: () => Promise<unknown> } = {}): void {
  if (store.__purgeSchedule) return
  const run = opts.run ?? (() => purgeOldData(db, null))

  const tick = () => {
    run().catch(() => {
      // A failed purge (for example a busy database) is retried on the next
      // tick; never crash the server from the timer.
    })
  }

  const state: PurgeScheduleState = {
    startTimer: setTimeout(() => {
      tick()
      state.intervalTimer = setInterval(tick, PURGE_INTERVAL_MS)
      // Don't let the timer keep the process alive on its own.
      state.intervalTimer.unref?.()
    }, PURGE_FIRST_DELAY_MS),
  }
  state.startTimer.unref?.()
  store.__purgeSchedule = state
}

/** Clears the schedule and its guard (tests, or a clean shutdown). */
export function stopPurgeSchedule(): void {
  const state = store.__purgeSchedule
  if (!state) return
  clearTimeout(state.startTimer)
  if (state.intervalTimer) clearInterval(state.intervalTimer)
  delete store.__purgeSchedule
}
