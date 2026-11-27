/**
 * Drops responses to outdated requests (spec 008 FR-006). `begin()` starts a
 * request and returns its token; `invalidate()` marks every earlier request as
 * outdated (call it when an input the request depends on changes); only the
 * token of the latest request, with no change since, is current.
 */
export function createRequestGuard() {
  let latest = 0
  return {
    begin(): number {
      latest += 1
      return latest
    },
    invalidate(): void {
      latest += 1
    },
    isCurrent(token: number): boolean {
      return token === latest
    },
  }
}
