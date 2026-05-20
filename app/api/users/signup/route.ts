import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    await connectDB();

    // ── Parse & validate body ──────────────────────────────────────────────
    let body: { name?: string; email?: string; password?: string; country?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const name = body.name?.trim()
    const email = body.email?.trim().toLowerCase()
    const password = body.password?.trim()
    const country = body.country?.trim()

    // Required field check
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Name length
    if (name.length < 2) {
      return NextResponse.json(
        { error: 'Name must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // ── Check if email already taken ───────────────────────────────────────
    const existing = await db
      .select({ id: users.id, googleId: users.googleId })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existing.length > 0) {
      const existingUser = existing[0]
      if (existingUser.googleId) {
        return NextResponse.json(
          { error: 'This email is linked to a Google account. Please sign in with Google.' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      )
    }

    // ── Create user ────────────────────────────────────────────────────────
    const hashed = await bcrypt.hash(password, 12)
    const newId = crypto.randomUUID()

    await db.insert(users).values({
      id: newId,
      name,
      email,
      password: hashed,
      country: country || null,
    })

    return NextResponse.json(
      { message: 'Account created successfully. Please sign in.' },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('[SIGNUP ERROR]', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
