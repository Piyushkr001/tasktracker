// app/api/users/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, db } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const userResult = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = userResult[0];

  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateToken({ id: user.id });

  return NextResponse.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
