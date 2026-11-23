import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import {
  registerPurgeSchedule,
  stopPurgeSchedule,
  PURGE_FIRST_DELAY_MS,
  PURGE_INTERVAL_MS,
} from '@/server/purgeSchedule'

// A-28, G-05 (Q35): the 12-month purge runs by itself, first shortly after
// start, then every 24 h, registered once per process.
describe('automatic purge schedule (A-28, G-05)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    stopPurgeSchedule()
    vi.useRealTimers()
  })

  it('runs once after the start-up delay, then every 24 h', async () => {
    const run = vi.fn().mockResolvedValue(undefined)
    registerPurgeSchedule({ run })

    expect(run).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(PURGE_FIRST_DELAY_MS - 1)
    expect(run).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(1)
    expect(run).toHaveBeenCalledTimes(1)

    await vi.advanceTimersByTimeAsync(PURGE_INTERVAL_MS)
    expect(run).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(PURGE_INTERVAL_MS)
    expect(run).toHaveBeenCalledTimes(3)
  })

  it('a second registration (HMR, repeated hook) adds no timers', async () => {
    const run = vi.fn().mockResolvedValue(undefined)
    const other = vi.fn().mockResolvedValue(undefined)
    registerPurgeSchedule({ run })
    registerPurgeSchedule({ run: other })

    await vi.advanceTimersByTimeAsync(PURGE_FIRST_DELAY_MS + PURGE_INTERVAL_MS)
    expect(run).toHaveBeenCalledTimes(2)
    expect(other).not.toHaveBeenCalled()
  })

  it('a failing run does not escape the timer and the next tick still runs', async () => {
    const run = vi.fn().mockRejectedValueOnce(new Error('database is locked')).mockResolvedValue(undefined)
    registerPurgeSchedule({ run })

    await vi.advanceTimersByTimeAsync(PURGE_FIRST_DELAY_MS)
    expect(run).toHaveBeenCalledTimes(1)
    await vi.advanceTimersByTimeAsync(PURGE_INTERVAL_MS)
    expect(run).toHaveBeenCalledTimes(2)
  })

  it('stopPurgeSchedule clears the timers and allows a fresh registration', async () => {
    const run = vi.fn().mockResolvedValue(undefined)
    registerPurgeSchedule({ run })
    stopPurgeSchedule()

    await vi.advanceTimersByTimeAsync(PURGE_FIRST_DELAY_MS + PURGE_INTERVAL_MS)
    expect(run).not.toHaveBeenCalled()

    const fresh = vi.fn().mockResolvedValue(undefined)
    registerPurgeSchedule({ run: fresh })
    await vi.advanceTimersByTimeAsync(PURGE_FIRST_DELAY_MS)
    expect(fresh).toHaveBeenCalledTimes(1)
  })
})
