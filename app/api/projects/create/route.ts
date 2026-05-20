import { connectDB, db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { projects } from '@/lib/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'
import { eq, count } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  await connectDB()
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = token && verifyToken(token)
  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (decoded as JwtPayload).id
  const { name } = await req.json()

  const countResult = await db
    .select({ value: count() })
    .from(projects)
    .where(eq(projects.userId, userId))

  const projectCount = countResult[0]?.value || 0
  if (projectCount >= 4) {
    return NextResponse.json({ error: 'Max 4 projects allowed' }, { status: 400 })
  }

  const newId = crypto.randomUUID()
  await db.insert(projects).values({
    id: newId,
    userId,
    name,
  })

  return NextResponse.json({
    _id: newId,
    name,
    tasks: [],
  }, { status: 201 })
}
