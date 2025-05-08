import { connectDB } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import Project from '@/lib/models/Project'
import { NextRequest, NextResponse } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  await connectDB()
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = token && verifyToken(token)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const projects = await Project.find({ userId: (decoded as JwtPayload).id})
  return NextResponse.json(projects)
}
