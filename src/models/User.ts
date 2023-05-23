import { IUserModel } from "../types/user";
import { model, Schema } from "mongoose";

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            unique: true,
            /*Regex:
            1. match any word, hyphen and underscore between start and '@',
            2. match any word and hyphen between a '@' and a '.'
            3. last portion between 2 and 4 chars after the '.'
            */
            match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Insert a valid email'],
            required: true
        },
    },
);

export default model<IUserModel>('User', UserSchema);