import mongoose, { Document, Schema } from "mongoose";

interface IDeadlineHistory {
  oldDeadline: Date;
  newDeadline: Date;
  changedBy: mongoose.Types.ObjectId;
  changedAt: Date;
}

interface IProgressUpdate {
  message: string;
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

export interface ITask extends Document {
  title: string;
  description: string;
  project: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  status: "todo" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  deadline: Date;
  deadlineHistory: IDeadlineHistory[];
  progressUpdates: IProgressUpdate[];
  createdAt: Date;
  updatedAt: Date;
}

const deadlineHistorySchema = new Schema<IDeadlineHistory>(
  {
    oldDeadline: {
      type: Date,
      required: true,
    },

    newDeadline: {
      type: Date,
      required: true,
    },

    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const progressUpdateSchema = new Schema<IProgressUpdate>(
  {
    message: {
      type: String,
      required: true,
      trim: true,
    },

    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    _id: false,
  }
);

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    status: {
      type: String,
      enum: ["todo", "in_progress", "completed"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    deadline: {
      type: Date,
      required: true,
    },

    deadlineHistory: {
      type: [deadlineHistorySchema],
      default: [],
    },

    progressUpdates: {
      type: [progressUpdateSchema],
      default: [],
    },
    
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;