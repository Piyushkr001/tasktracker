import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '@/lib/auth';

const client = new OAuth2Client();

export async function POST(req: Request) {
  try {
    // ── Parse body ─────────────────────────────────────────────────────────
    let body: { idToken?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { idToken } = body
    if (!idToken || typeof idToken !== 'string') {
      return NextResponse.json({ error: 'ID token is required' }, { status: 400 })
    }

    // ── Validate Google client ID is configured ────────────────────────────
    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.error('[GOOGLE LOGIN] GOOGLE_CLIENT_ID is not set')
      return NextResponse.json(
        { error: 'Google authentication is not configured on this server.' },
        { status: 503 }
      )
    }

    // ── Verify ID token with Google ────────────────────────────────────────
    let payload: any
    try {
      const ticket = await client.verifyIdToken({ idToken, audience: clientId })
      payload = ticket.getPayload()
    } catch (err: any) {
      console.error('[GOOGLE LOGIN] Token verification failed:', err.message)
      return NextResponse.json(
        { error: 'Google token is invalid or has expired. Please try again.' },
        { status: 401 }
      )
    }

    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: 'Unable to retrieve account information from Google.' },
        { status: 400 }
      )
    }

    // Check that Google has verified this email
    if (!payload.email_verified) {
      return NextResponse.json(
        { error: 'Your Google email address is not verified.' },
        { status: 403 }
      )
    }

    const { email, name, sub: googleId, picture } = payload

    // ── Find or create user ────────────────────────────────────────────────
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email!))
      .limit(1)

    let user = userResult[0]

    if (user) {
      // Link Google ID if not already linked
      if (!user.googleId) {
        await db
          .update(users)
          .set({ googleId })
          .where(eq(users.id, user.id))
        user.googleId = googleId
      }
    } else {
      // Create new Google user
      const newId = crypto.randomUUID()
      await db.insert(users).values({
        id: newId,
        name: name || email!.split('@')[0],
        email: email!,
        googleId,
        password: null,
        country: null,
      })
      const created = await db.select().from(users).where(eq(users.id, newId)).limit(1)
      user = created[0]
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create or retrieve user account.' },
        { status: 500 }
      )
    }

    // ── Issue JWT ──────────────────────────────────────────────────────────
    const token = generateToken({ id: user.id, email: user.email })

    const response = NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: picture ?? null,
        },
      },
      { status: 200 }
    )

    // Set HttpOnly cookie for middleware auth
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('[GOOGLE LOGIN ERROR]', error)
    return NextResponse.json(
      { error: 'Authentication failed. Please try again.' },
      { status: 500 }
    )
  }
}
