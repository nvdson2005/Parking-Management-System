import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { sectionOf } from '@/lib/sections'

export const config = {
  matcher: ['/customer/:path*', '/staff/:path*', '/manager/:path*'],
}

// Middleware runs on the Edge runtime, so it verifies the JWT itself with
// jose directly rather than importing src/server/auth/session.ts, which
// pulls in the Prisma client (not Edge-compatible) through src/server/db.ts.
function getSecretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return new TextEncoder().encode(secret)
}

/**
 * Sends requests without a valid session to /login. The role check is not
 * done here: the Edge runtime cannot write the ACCESS_DENIED row (G-06,
 * FR-43), so each section layout makes that decision on Node and logs it
 * (requireSection in src/server/auth/rbac.ts).
 */
export async function middleware(req: NextRequest) {
  if (!sectionOf(req.nextUrl.pathname)) return NextResponse.next()

  const token = req.cookies.get('session')?.value
  if (!token) return NextResponse.redirect(new URL('/login', req.url))

  try {
    await jwtVerify(token, getSecretKey())
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}
