import { ITask } from "types/task";
import { model, Schema } from "mongoose";

const TaskSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        status: { type: String, required: true },
        creationTime: { type: Date, required: true },
        updateTime: { type: Date },
    },
);

export default model<ITask>('Task', TaskSchema);