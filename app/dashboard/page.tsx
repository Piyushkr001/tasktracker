'use client'

import * as React from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, CheckCircle2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'

// Types
type Task = {
  _id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  createdAt: string
  completedAt?: string
}

type Project = {
  _id: string
  name: string
  tasks: Task[]
}

export default function DashboardPage() {
  const [projects, setProjects] = React.useState<Project[]>([])
  const [loading, setLoading] = React.useState(true)
  const [newProjectName, setNewProjectName] = React.useState('')
  const [taskTitle, setTaskTitle] = React.useState('')
  const [taskDescription, setTaskDescription] = React.useState('')
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setProjects(data)
    } catch {
      toast.error('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newProjectName }),
      })
      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error || 'Failed to create project')
        return
      }
      toast.success('Project created')
      setNewProjectName('')
      fetchProjects()
    } catch {
      toast.error('Error creating project')
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeProjectId) return
    try {
      const res = await fetch(`/api/projects/${activeProjectId}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: taskTitle, description: taskDescription }),
      })
      if (!res.ok) {
        toast.error('Failed to add task')
        return
      }
      toast.success('Task added')
      setTaskTitle('')
      setTaskDescription('')
      fetchProjects()
    } catch {
      toast.error('Error adding task')
    }
  }

  const updateTaskStatus = async (
    projectId: string,
    taskId: string,
    status: 'todo' | 'in-progress' | 'done'
  ) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) {
        toast.error('Failed to update status')
        return
      }
      toast.success('Status updated')
      fetchProjects()
    } catch {
      toast.error('Update failed')
    }
  }

  const deleteTask = async (projectId: string, taskId: string) => {
    try {
      const res = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) {
        toast.error('Failed to delete task')
        return
      }
      toast.success('Task deleted')
      fetchProjects()
    } catch {
      toast.error('Error deleting task')
    }
  }

  return (
    <div className="min-h-screen px-4 py-8 md:px-12 bg-white dark:bg-black text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Create New Project</DialogTitle>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <Input
                  placeholder="Project Name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  required
                />
                <DialogFooter>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <p>Loading projects...</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Card key={project._id} className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                  {project.tasks.length > 0 ? (
                    project.tasks.map((task) => (
                      <div
                        key={task._id}
                        className="border rounded-lg p-4 space-y-1 bg-gray-50 dark:bg-zinc-900"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{task.title}</h3>
                          <div className="flex items-center gap-2">
                            <Select
                              value={task.status}
                              onValueChange={(value) =>
                                updateTaskStatus(
                                  project._id,
                                  task._id,
                                  value as Task['status']
                                )
                              }
                            >
                              <SelectTrigger className="w-[130px] text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="todo">📝 Todo</SelectItem>
                                <SelectItem value="in-progress">🚧 In Progress</SelectItem>
                                <SelectItem value="done">✅ Done</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteTask(project._id, task._id)}
                              title="Delete Task"
                            >
                              ❌
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Created: {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                        {task.completedAt && (
                          <p className="text-xs text-muted-foreground">
                            Completed: {new Date(task.completedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tasks yet.</p>
                  )}

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveProjectId(project._id)}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Task
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Add Task to {project.name}</DialogTitle>
                      <form onSubmit={handleAddTask} className="space-y-4">
                        <Input
                          placeholder="Task Title"
                          value={taskTitle}
                          onChange={(e) => setTaskTitle(e.target.value)}
                          required
                        />
                        <Textarea
                          placeholder="Task Description"
                          value={taskDescription}
                          onChange={(e) => setTaskDescription(e.target.value)}
                          required
                        />
                        <DialogFooter>
                          <Button type="submit">
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Save Task
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}