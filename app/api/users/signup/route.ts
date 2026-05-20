import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  await connectDB();
  const { name, email, password, country } = await req.json();

  try {
    const userExists = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (userExists.length > 0) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await db.insert(users).values({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashed,
      country,
    });

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
