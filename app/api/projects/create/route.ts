import { connectDB } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import Project from '@/lib/models/Project'
import { NextRequest, NextResponse } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'

export async function POST(req: NextRequest) {
  await connectDB()
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = token && verifyToken(token)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json()
  const count = await Project.countDocuments({ userId: (decoded as JwtPayload).id })
  if (count >= 4) {
    return NextResponse.json({ error: 'Max 4 projects allowed' }, { status: 400 })
  }

  const project = await Project.create({ userId: (decoded as JwtPayload).id, name, tasks: [] })
  return NextResponse.json(project, { status: 201 })
}
