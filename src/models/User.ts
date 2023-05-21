import { IUserModel } from "../types/User";
import { model, Schema } from "mongoose";

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
);

export default model<IUserModel>('User', UserSchema);