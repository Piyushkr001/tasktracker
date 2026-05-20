import { NextRequest, NextResponse } from 'next/server';
import { connectDB, db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * GET /api/users/me
 * Session check — verifies the JWT from Authorization header or cookie,
 * then returns the current user's profile.
 */
export async function GET(req: NextRequest) {
  // ── Extract token: prefer Authorization header, fall back to cookie ───────
  const authHeader = req.headers.get('authorization')
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const cookieToken = req.cookies.get('token')?.value
  const token = headerToken || cookieToken

  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated. Please sign in.' },
      { status: 401 }
    )
  }

  // ── Verify JWT ─────────────────────────────────────────────────────────────
  const decoded = verifyToken(token)
  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json(
      { error: 'Session expired or invalid. Please sign in again.' },
      { status: 401 }
    )
  }

  const userId = (decoded as any).id
  if (!userId) {
    return NextResponse.json(
      { error: 'Malformed token. Please sign in again.' },
      { status: 401 }
    )
  }

  // ── Fetch user from DB ─────────────────────────────────────────────────────
  try {
    await connectDB();
    const result = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        country: users.country,
        googleId: users.googleId,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    const user = result[0]
    if (!user) {
      return NextResponse.json(
        { error: 'Account not found. It may have been deleted.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        country: user.country,
        hasGoogleAuth: !!user.googleId,
      },
    })
  } catch (error: any) {
    console.error('[ME ERROR]', error)
    return NextResponse.json(
      { error: 'Unable to retrieve session. Please try again.' },
      { status: 500 }
    )
  }
}
