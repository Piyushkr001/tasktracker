import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import Users from '@/lib/models/Users';

export async function GET(req: NextRequest) {
  await connectDB();

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  const decoded = token && verifyToken(token);
  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await Users.findById((decoded as any).id).select('-password');
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user });
}
