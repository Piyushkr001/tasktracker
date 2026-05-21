'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  FolderKanban, 
  ClipboardList, 
  Loader2, 
  Clock,
  Layers,
  CalendarRange,
  CalendarCheck
} from 'lucide-react'
import { toast } from 'react-hot-toast'
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
  const router = useRouter()
  const [projects, setProjects] = React.useState<Project[]>([])
  const [loading, setLoading] = React.useState(true)
  const [newProjectName, setNewProjectName] = React.useState('')
  const [taskTitle, setTaskTitle] = React.useState('')
  const [taskDescription, setTaskDescription] = React.useState('')
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null)

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  // Client-side auth guard — secondary layer on top of middleware
  React.useEffect(() => {
    if (!token) {
      router.replace('/sign-in?redirect_url=/dashboard')
    }
  }, [token, router])

  const logout = () => {
    localStorage.removeItem('token')
    document.cookie = 'token=; path=/; max-age=0'
    router.replace('/sign-in')
  }

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProjects(res.data)
    } catch (err: any) {
      if (err.response?.status === 401) {
        logout()
      } else {
        toast.error('Failed to load projects')
      }
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (token) fetchProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/projects/create', 
        { name: newProjectName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('Project created successfully')
      setNewProjectName('')
      fetchProjects()
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to create project')
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeProjectId) return
    try {
      await axios.post(`/api/projects/${activeProjectId}/tasks`,
        { title: taskTitle, description: taskDescription },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('Task added successfully')
      setTaskTitle('')
      setTaskDescription('')
      fetchProjects()
    } catch {
      toast.error('Failed to add task')
    }
  }

  const updateTaskStatus = async (
    projectId: string,
    taskId: string,
    status: 'todo' | 'in-progress' | 'done'
  ) => {
    try {
      await axios.patch(`/api/projects/${projectId}/tasks/${taskId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      toast.success('Status updated')
      fetchProjects()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const deleteTask = async (projectId: string, taskId: string) => {
    try {
      await axios.delete(`/api/projects/${projectId}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success('Task deleted')
      fetchProjects()
    } catch {
      toast.error('Failed to delete task')
    }
  }

  // Dynamic calculations for KPI Stats
  const totalProjects = projects.length
  const totalTasks = projects.reduce((acc, p) => acc + (p.tasks?.length || 0), 0)
  const completedTasks = projects.reduce(
    (acc, p) => acc + (p.tasks?.filter((t) => t.status === 'done').length || 0),
    0
  )
  const inProgressTasks = projects.reduce(
    (acc, p) => acc + (p.tasks?.filter((t) => t.status === 'in-progress').length || 0),
    0
  )

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-indigo-50/30 via-zinc-50 to-purple-50/30 dark:from-zinc-950 dark:via-zinc-900/90 dark:to-indigo-950/20 text-zinc-900 dark:text-zinc-100 py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background mesh glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] bg-gradient-to-tr from-indigo-400/10 to-purple-400/10 dark:from-indigo-900/10 dark:to-purple-900/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 h-[350px] w-[350px] bg-gradient-to-br from-purple-400/10 to-pink-400/10 dark:from-purple-900/10 dark:to-pink-900/10 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Welcome / Actions Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              Your Workspace
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Manage your projects, track stages, and boost your daily throughput.
            </p>
          </div>

          <Dialog>
            <DialogTrigger
              render={
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-md shadow-indigo-500/10 dark:shadow-indigo-950/20 border-0 rounded-xl transition-all active:scale-[0.98] h-10 px-4">
                  <PlusCircle className="mr-2 h-4 w-4" /> New Project
                </Button>
              }
            />
            <DialogContent className="max-w-md bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6">
              <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Create New Project
              </DialogTitle>
              <form onSubmit={handleCreateProject} className="space-y-4 mt-3">
                <Input
                  placeholder="Enter project name..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                  required
                />
                <DialogFooter className="pt-2">
                  <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 font-medium rounded-lg">
                    Create Project
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Loading workspace...</p>
          </div>
        ) : projects.length === 0 ? (
          /* Premium Empty State */
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl max-w-lg mx-auto shadow-sm">
            <div className="h-16 w-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
              <FolderKanban className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              No projects yet
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">
              Create your first project to start organizing, tracking, and prioritizing your work stages.
            </p>
            <Dialog>
              <DialogTrigger
                render={
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-md shadow-indigo-500/10 rounded-xl transition-all">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create First Project
                  </Button>
                }
              />
              <DialogContent className="max-w-md bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6">
                <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Create New Project
                </DialogTitle>
                <form onSubmit={handleCreateProject} className="space-y-4 mt-3">
                  <Input
                    placeholder="Enter project name..."
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                    required
                  />
                  <DialogFooter className="pt-2">
                    <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0 font-medium rounded-lg">
                      Create Project
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <>
            {/* KPI Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total Projects</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">{totalProjects}</p>
                </div>
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Layers className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total Tasks</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">{totalTasks}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">In Progress</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">{inProgressTasks}</p>
                </div>
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                  <CalendarRange className="h-5 w-5" />
                </div>
              </div>

              <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
                <div>
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Completed Tasks</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-1">{completedTasks}</p>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                  <CalendarCheck className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <Card key={project._id} className="relative flex flex-col h-full bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 overflow-hidden">
                  {/* Glowing header accent line */}
                  <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                  
                  <CardHeader className="flex flex-row justify-between items-center px-6 pt-5 pb-3 border-b border-zinc-100 dark:border-zinc-800/50">
                    <CardTitle className="font-bold text-lg text-zinc-800 dark:text-zinc-100 leading-tight">
                      {project.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-indigo-50/80 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-100/50 dark:border-indigo-900/30 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                      {project.tasks?.length || 0} {project.tasks?.length === 1 ? 'task' : 'tasks'}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="flex-1 space-y-3">
                      {project.tasks && project.tasks.length > 0 ? (
                        project.tasks.map((task) => (
                          <div
                            key={task._id}
                            className="group border border-zinc-100 dark:border-zinc-800/80 rounded-xl p-4 bg-zinc-50/40 dark:bg-zinc-900/30 hover:bg-white dark:hover:bg-zinc-900/60 hover:border-zinc-200/80 dark:hover:border-zinc-800 hover:shadow-sm transition-all duration-200"
                          >
                            <div className="flex justify-between items-start gap-2">
                              <div className="space-y-0.5">
                                <h3 className="font-semibold text-sm text-zinc-850 dark:text-zinc-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {task.title}
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                                  {task.description}
                                </p>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
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
                                  <SelectTrigger className="w-[115px] h-7 text-[10px] font-medium bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                                    <SelectItem value="todo" className="text-[11px]">📝 Todo</SelectItem>
                                    <SelectItem value="in-progress" className="text-[11px]">🚧 In Progress</SelectItem>
                                    <SelectItem value="done" className="text-[11px]">✅ Done</SelectItem>
                                  </SelectContent>
                                </Select>

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteTask(project._id, task._id)}
                                  className="h-7 w-7 text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                                  title="Delete Task"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            {/* Dates details */}
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-400 dark:text-zinc-500 mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/40">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3 shrink-0" />
                                Created: {new Date(task.createdAt).toLocaleDateString()}
                              </span>
                              {task.completedAt && (
                                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                                  Completed: {new Date(task.completedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-900/10">
                          <p className="text-xs text-zinc-400 dark:text-zinc-500">No tasks created yet.</p>
                        </div>
                      )}
                    </div>

                    {/* Add Task Trigger */}
                    <Dialog>
                      <DialogTrigger
                        render={
                          <Button
                            variant="outline"
                            className="w-full mt-4 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all rounded-xl h-10 px-3 text-xs font-semibold shrink-0"
                            onClick={() => setActiveProjectId(project._id)}
                          >
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Task
                          </Button>
                        }
                      />
                      <DialogContent className="max-w-md bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-6">
                        <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                          Add Task to {project.name}
                        </DialogTitle>
                        <form onSubmit={handleAddTask} className="space-y-4 mt-3">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Task Title</label>
                            <Input
                              placeholder="Enter task title..."
                              value={taskTitle}
                              onChange={(e) => setTaskTitle(e.target.value)}
                              className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Description</label>
                            <Textarea
                              placeholder="Enter task description..."
                              value={taskDescription}
                              onChange={(e) => setTaskDescription(e.target.value)}
                              className="bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus-visible:ring-indigo-500 min-h-[90px]"
                              required
                            />
                          </div>
                          <DialogFooter className="pt-2">
                            <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-0 font-medium rounded-lg">
                              Save Task
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}