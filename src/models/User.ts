import { IUserModel } from "../types/User";
import { model, Schema } from "mongoose";

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            unique: true,
            /*Regex:
            1. match any word, hyphen and underscore,
            2. match any word and hyphen
            3. last portion between 2 and 4 chars
            */
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Insert a valid email'],
            required: true
        },
    },
);

export default model<IUserModel>('User', UserSchema);