let lockPromise: Promise<void> = Promise.resolve()

export async function withLock<T>(fn: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    lockPromise = lockPromise.then(async () => {
      try {
        const result = await fn()
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  })
}
