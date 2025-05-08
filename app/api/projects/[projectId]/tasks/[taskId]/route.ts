import { connectDB } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import Project from '@/lib/models/Project'
import { NextRequest, NextResponse } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'

// === PATCH: Update Task Status ===
export async function PATCH(
  req: NextRequest,
  { params }: { params: { projectId: string; taskId: string } }
) {
  await connectDB()
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = token && verifyToken(token)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { status } = await req.json()
  if (!['todo', 'in-progress', 'done'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const updated = await Project.findOneAndUpdate(
    {
      _id: params.projectId,
      userId: (decoded as JwtPayload).id,
      'tasks._id': params.taskId,
    },
    {
      $set: {
        'tasks.$.status': status,
        ...(status === 'done' && { 'tasks.$.completedAt': new Date() }),
      },
    },
    { new: true }
  )

  return NextResponse.json(updated)
}

// === DELETE: Remove Task from Project ===
export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string; taskId: string } }
) {
  await connectDB()
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = token && verifyToken(token)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const updated = await Project.findOneAndUpdate(
      {
        _id: params.projectId,
        userId: (decoded as JwtPayload).id,
      },
      {
        $pull: {
          tasks: { _id: params.taskId },
        },
      },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json({ error: 'Task or Project not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
