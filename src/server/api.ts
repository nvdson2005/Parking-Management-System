import { ZodError } from 'zod'
import { DomainError } from '@/server/errors'

/**
 * Reads a request's JSON body as a plain object, mapping a malformed body
 * (invalid JSON) or a non-object JSON value (null, array, primitive) to a
 * `VALIDATION` `DomainError` *before* any property access — so untrusted
 * route input can't escape the VALIDATION/400 contract as a raw 500.
 */
export async function readJsonObject(req: Request): Promise<Record<string, unknown>> {
  let parsed: unknown
  try {
    parsed = await req.json()
  } catch {
    throw new DomainError('VALIDATION', 'Request body must be valid JSON')
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new DomainError('VALIDATION', 'Request body must be a JSON object')
  }
  return parsed as Record<string, unknown>
}

/**
 * Wraps a Next.js route handler: runs `fn`, serializes a successful result
 * with `Response.json`, and maps known error types to the right HTTP status.
 * `Ctx` is generic so dynamic routes can pass their own `{ params }` shape
 * without widening the handler signature to `any`.
 */
export function handle<Ctx = unknown>(fn: (req: Request, ctx: Ctx) => Promise<unknown>) {
  return async (req: Request, ctx: Ctx): Promise<Response> => {
    try {
      const result = await fn(req, ctx)
      return Response.json(result ?? null)
    } catch (err) {
      if (err instanceof DomainError) {
        return Response.json({ error: err.code }, { status: err.status })
      }
      if (err instanceof ZodError) {
        return Response.json({ error: 'VALIDATION' }, { status: 400 })
      }
      throw err
    }
  }
}
