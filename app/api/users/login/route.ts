import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, db } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    await connectDB();

    // ── Parse & validate body ──────────────────────────────────────────────
    let body: { email?: string; password?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const email = body.email?.trim().toLowerCase()
    const password = body.password?.trim()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // ── Lookup user ────────────────────────────────────────────────────────
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    const user = userResult[0]

    // No account found
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email. Please sign up first.' },
        { status: 404 }
      )
    }

    // Account exists but registered via Google (no password)
    if (!user.password) {
      return NextResponse.json(
        { error: 'This account was registered with Google. Please sign in with Google.' },
        { status: 400 }
      )
    }

    // Wrong password
    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Incorrect password. Please try again.' },
        { status: 401 }
      )
    }

    // ── Issue token ────────────────────────────────────────────────────────
    const token = generateToken({ id: user.id, email: user.email })

    const response = NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          country: user.country,
        },
      },
      { status: 200 }
    )

    // Also set an HttpOnly cookie for middleware-level auth
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('[LOGIN ERROR]', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
