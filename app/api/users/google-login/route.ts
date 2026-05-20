import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '@/lib/auth';

const client = new OAuth2Client();

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) {
      return NextResponse.json({ error: 'ID Token is required' }, { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json({ error: 'Google Client ID is not configured' }, { status: 500 });
    }

    // Verify Google Token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json({ error: 'Invalid ID Token' }, { status: 400 });
    }

    const { email, name, sub: googleId } = payload;

    // Check if user exists by email
    const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
    let user = userResult[0];

    if (user) {
      // If user exists but googleId is not linked, link it
      if (!user.googleId) {
        await db.update(users).set({ googleId }).where(eq(users.id, user.id));
        user.googleId = googleId;
      }
    } else {
      // Create new user
      const newUserId = crypto.randomUUID();
      await db.insert(users).values({
        id: newUserId,
        name: name || 'Google User',
        email,
        googleId,
        password: null,
        country: null,
      });

      const newUserResult = await db.select().from(users).where(eq(users.id, newUserId)).limit(1);
      user = newUserResult[0];
    }

    // Generate JWT token
    const token = generateToken({ id: user.id });

    return NextResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    console.error('Google Login Error:', error);
    return NextResponse.json({ error: 'Authentication failed', details: error.message }, { status: 500 });
  }
}
