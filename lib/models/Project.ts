import mongoose, { Schema } from 'mongoose'

const taskSchema = new Schema({
  title: String,
  description: String,
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
})

const projectSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  tasks: [taskSchema],
})

export default mongoose.models.Project || mongoose.model('Project', projectSchema)
