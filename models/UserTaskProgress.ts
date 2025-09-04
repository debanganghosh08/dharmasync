
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserTaskProgress extends Document {
  userId: string;
  date: Date;
  completedTasks: number;
  totalTasks: number;
}

const UserTaskProgressSchema: Schema = new Schema({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  completedTasks: { type: Number, required: true },
  totalTasks: { type: Number, required: true },
});

export default mongoose.models.UserTaskProgress || mongoose.model<IUserTaskProgress>('UserTaskProgress', UserTaskProgressSchema);
