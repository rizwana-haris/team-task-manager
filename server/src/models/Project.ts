import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  name: string;
  description: string;
  status: "planning" | "active" | "completed";
  startDate: Date;
  endDate: Date;
  createdBy: mongoose.Types.ObjectId;
}

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["planning", "active", "completed"],
      default: "planning",
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;