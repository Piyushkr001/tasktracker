
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';

export async function POST(req: Request) {
  await connectDB();
  const { name, email, password, country } = await req.json();

  try {
    const userExists = await Users.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await Users.create({ name, email, password: hashed, country });

    return NextResponse.json({ message: 'User created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
