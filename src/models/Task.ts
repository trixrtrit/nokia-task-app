import { ITaskModel } from "../types/Task";
import mongoose, { model, Schema } from "mongoose";

const TaskSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        status: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITaskModel>('Task', TaskSchema);