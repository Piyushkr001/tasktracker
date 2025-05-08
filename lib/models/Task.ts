import mongoose, { Schema, Document } from 'mongoose'

export interface ITask extends Document {
  title: string
  description: string
  status: string
  createdAt: Date
  completedAt?: Date
  projectId: mongoose.Types.ObjectId
}

const taskSchema = new Schema<ITask>({
  title: String,
  description: String,
  status: { type: String, default: 'todo' },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
})

export default mongoose.models.Task || mongoose.model<ITask>('Task', taskSchema)
