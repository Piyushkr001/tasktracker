import { NextRequest, NextResponse } from 'next/server';
import { connectDB, db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  await connectDB();

  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];

  const decoded = token && verifyToken(token);
  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (decoded as any).id;
  const userResult = await db.select({
    id: users.id,
    name: users.name,
    email: users.email,
    country: users.country,
  }).from(users).where(eq(users.id, userId)).limit(1);

  const user = userResult[0];
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Return mapped user for full compatibility
  return NextResponse.json({
    user: {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      country: user.country,
    }
  });
}
