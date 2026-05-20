import { connectDB, db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { projects, tasks } from '@/lib/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'
import { and, eq } from 'drizzle-orm'

// === PATCH: Update Task Status ===
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const { projectId, taskId } = await params
  await connectDB()
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = token && verifyToken(token)
  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (decoded as JwtPayload).id
  const { status } = await req.json()
  if (!['todo', 'in-progress', 'done'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  // Verify the project belongs to the user
  const projResult = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
    .limit(1)

  const project = projResult[0]
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  // Update the task
  await db
    .update(tasks)
    .set({
      status,
      completedAt: status === 'done' ? new Date() : null,
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))

  // Get all tasks for this project
  const projTasks = await db.select().from(tasks).where(eq(tasks.projectId, projectId))

  // Return the project including its tasks mapped correctly
  return NextResponse.json({
    _id: projectId,
    name: project.name,
    tasks: projTasks.map((t) => ({
      _id: t.id,
      title: t.title,
      description: t.description,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
      completedAt: t.completedAt ? t.completedAt.toISOString() : undefined,
    })),
  })
}

// === DELETE: Remove Task from Project ===
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string; taskId: string }> }
) {
  const { projectId, taskId } = await params
  await connectDB()
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = token && verifyToken(token)
  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (decoded as JwtPayload).id

  try {
    // Verify the project belongs to the user
    const projResult = await db
      .select()
      .from(projects)
      .where(and(eq(projects.id, projectId), eq(projects.userId, userId)))
      .limit(1)

    const project = projResult[0]
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Delete the task
    const deleteResult = await db
      .delete(tasks)
      .where(and(eq(tasks.id, taskId), eq(tasks.projectId, projectId)))
      .returning()

    if (deleteResult.length === 0) {
      return NextResponse.json({ error: 'Task or Project not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}
