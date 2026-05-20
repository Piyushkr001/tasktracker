import { connectDB, db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { projects, tasks } from '@/lib/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'
import { and, eq } from 'drizzle-orm'

export async function POST(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  await connectDB()
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = token && verifyToken(token)
  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (decoded as JwtPayload).id
  const { title, description } = await req.json()

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

  // Insert the task
  const taskId = crypto.randomUUID()
  await db.insert(tasks).values({
    id: taskId,
    projectId,
    title,
    description,
    status: 'todo',
  })

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
