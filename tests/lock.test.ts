import { describe, it, expect } from 'vitest'
import { withLock } from '@/server/lock'

describe('lock', () => {
  it('should serialize concurrent operations', async () => {
    let counter = 0

    const promises = Array.from({ length: 10 }, async () => {
      await withLock(async () => {
        const current = counter
        await new Promise((resolve) => setTimeout(resolve, 1))
        counter = current + 1
      })
    })

    await Promise.all(promises)
    expect(counter).toBe(10)
  })
})
