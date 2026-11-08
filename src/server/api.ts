import { ZodError } from 'zod'
import { DomainError } from '@/server/errors'

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
