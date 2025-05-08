// app/api/users/login/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import { generateToken } from '@/lib/auth';
import Users from '@/lib/models/Users';

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await Users.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  const token = generateToken({ id: user._id });

  return NextResponse.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
}
