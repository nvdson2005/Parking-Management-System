import { db } from '@/server/db'
import { DomainError } from '@/server/errors'
import { requireRole } from '@/server/auth/rbac'
import { getAvailability } from '@/server/services/availability'
import { onAvailabilityChanged } from '@/server/bus'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const PING_INTERVAL_MS = 25_000

export async function GET(req: Request): Promise<Response> {
  try {
    await requireRole('CUSTOMER', 'STAFF', 'MANAGER')
  } catch (err) {
    if (err instanceof DomainError) {
      return Response.json({ error: err.code }, { status: err.status })
    }
    throw err
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      let closed = false

      function send(payload: string) {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(payload))
        } catch {
          closed = true
        }
      }

      async function sendAvailability() {
        const data = await getAvailability(db)
        send(`data: ${JSON.stringify(data)}\n\n`)
      }

      void sendAvailability()

      const unsubscribe = onAvailabilityChanged(() => {
        void sendAvailability()
      })

      const pingTimer = setInterval(() => {
        send(': ping\n\n')
      }, PING_INTERVAL_MS)

      function cleanup() {
        if (closed) return
        closed = true
        clearInterval(pingTimer)
        unsubscribe()
        try {
          controller.close()
        } catch {
          // already closed by the client disconnecting
        }
      }

      req.signal.addEventListener('abort', cleanup)
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}
