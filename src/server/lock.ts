function getLockPromise(): Promise<void> {
  const store = globalThis as typeof globalThis & { __lockPromise?: Promise<void> }
  if (!store.__lockPromise) {
    store.__lockPromise = Promise.resolve()
  }
  return store.__lockPromise
}

function setLockPromise(promise: Promise<void>): void {
  const store = globalThis as typeof globalThis & { __lockPromise?: Promise<void> }
  store.__lockPromise = promise
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
