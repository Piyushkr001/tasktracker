import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication — unauthenticated users are redirected to /sign-in
const PROTECTED_ROUTES = ['/dashboard']

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = req.cookies.get('token')?.value

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

  // Only block access to protected routes when no token cookie is present.
  // We do NOT redirect authenticated users away from /sign-in or /sign-up here —
  // those pages handle it client-side to avoid cookie sync issues on logout.
  if (isProtected && !token) {
    const signInUrl = new URL('/sign-in', req.url)
    signInUrl.searchParams.set('redirect_url', pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  // Only run on dashboard routes — no longer runs on /sign-in or /sign-up
  matcher: ['/dashboard/:path*'],
}
