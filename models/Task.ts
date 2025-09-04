
import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  _id: string;
  userId: string;
  title: string;
  category: 'mindfulness' | 'work' | 'personal';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  isDefault: boolean;
}

const TaskSchema: Schema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['mindfulness', 'work', 'personal'], required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  isDefault: { type: Boolean, default: false },
});

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
