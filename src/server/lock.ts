function getLockPromise(): Promise<void> {
  const globalThis_ = globalThis as Record<string, any>
  if (!globalThis_.__lockPromise) {
    globalThis_.__lockPromise = Promise.resolve()
  }
  return globalThis_.__lockPromise
}

function setLockPromise(promise: Promise<void>): void {
  const globalThis_ = globalThis as Record<string, any>
  globalThis_.__lockPromise = promise
}

export async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const currentPromise = getLockPromise()
    const nextPromise = currentPromise
      .then(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (err) {
          reject(err)
        }
      })
      .catch(() => {})
    setLockPromise(nextPromise)
  })
}
