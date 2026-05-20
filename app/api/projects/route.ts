import { connectDB, db } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { projects, tasks } from '@/lib/db/schema'
import { NextRequest, NextResponse } from 'next/server'
import { JwtPayload } from 'jsonwebtoken'
import { eq, inArray } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  await connectDB()
  const token = req.headers.get('authorization')?.split(' ')[1]
  const decoded = token && verifyToken(token)
  if (!decoded || typeof decoded === 'string') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (decoded as JwtPayload).id
  const userProjects = await db.select().from(projects).where(eq(projects.userId, userId))
  const projectIds = userProjects.map((p) => p.id)

  const allTasks = projectIds.length > 0
    ? await db.select().from(tasks).where(inArray(tasks.projectId, projectIds))
    : []

  const mappedProjects = userProjects.map((proj) => {
    const projTasks = allTasks
      .filter((t) => t.projectId === proj.id)
      .map((t) => ({
        _id: t.id,
        title: t.title,
        description: t.description,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
        completedAt: t.completedAt ? t.completedAt.toISOString() : undefined,
      }))

    return {
      _id: proj.id,
      name: proj.name,
      tasks: projTasks,
    }
  })

  return NextResponse.json(mappedProjects)
}
