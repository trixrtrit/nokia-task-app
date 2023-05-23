import { ITaskModel } from "../types/task";
import mongoose, { model, Schema, Types } from "mongoose";

const TaskSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ['TODO', 'IN_PROGRESS', 'DONE'],
            default: 'TODO',
            required: true 
            },
        user: {type: Schema.Types.ObjectId, ref: 'User'},
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ITaskModel>('Task', TaskSchema);