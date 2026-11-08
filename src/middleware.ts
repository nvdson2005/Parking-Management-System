import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

export const config = {
  matcher: ['/customer/:path*', '/staff/:path*', '/manager/:path*'],
}

// Middleware runs on the Edge runtime, so it verifies the JWT itself with
// jose directly rather than importing src/server/auth/session.ts, which
// pulls in the Prisma client (not Edge-compatible) through src/server/db.ts.
const ALLOWED_ROLES: Record<string, string[]> = {
  '/customer': ['CUSTOMER'],
  '/staff': ['STAFF', 'MANAGER'],
  '/manager': ['MANAGER'],
}

function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return new TextEncoder().encode(secret)
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const prefix = Object.keys(ALLOWED_ROLES).find((p) => pathname.startsWith(p))
  if (!prefix) return NextResponse.next()

  const token = req.cookies.get('session')?.value
  if (!token) return NextResponse.redirect(new URL('/login', req.url))

  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    const role = payload.role
    if (typeof role !== 'string' || !ALLOWED_ROLES[prefix].includes(role)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}
