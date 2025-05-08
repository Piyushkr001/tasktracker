import { connectDB } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import Project from '@/lib/models/Project'
import { NextRequest, NextResponse } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'

export async function POST(req: NextRequest, { params }: { params: { projectId: string } }) {
  await connectDB()
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = token && verifyToken(token)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, description } = await req.json()
  const project = await Project.findOneAndUpdate(
    { _id: params.projectId, userId: (decoded as JwtPayload).id },
    {
      $push: {
        tasks: {
          title,
          description,
          status: 'todo',
          createdAt: new Date(),
        },
      },
    },
    { new: true }
  )

  return NextResponse.json(project)
}
