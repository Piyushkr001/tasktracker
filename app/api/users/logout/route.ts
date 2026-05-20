import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/users/logout
 * Clears the server-set HttpOnly token cookie.
 * The client should also clear localStorage and the non-HttpOnly cookie it set.
 */
export async function POST(_req: NextRequest) {
  const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  response.cookies.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
