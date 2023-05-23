import { ITaskModel } from "../types/task";
import User from "../models/User";
import { IUserModel } from "../types/user";
import mongoose from "mongoose";
import { error } from "console";
import { GraphQLError } from "graphql";

export class UserDataSource {
    private users: IUserModel[];
    private user: IUserModel;
    private db_connection: mongoose.Connection;

    constructor(dbConnection: mongoose.Connection) {
        this.db_connection = dbConnection;
    }

    async getUsers() {
        try {
            this.users = await User.find()
            return this.users;
        }
        catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    async getUser(id: string) {
        this.user = await User.findById(id);
        return this.user;
    }

    async createUser(name: string, email: string) {
        try {
            let newUser = await User.findOne({ email: email });
            if (newUser) {
                throw new GraphQLError(`User with email: ${email} already exists`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                name,
                email,
            });
            await newUser.save();
            return newUser;
        } catch (error) {
            throw new GraphQLError('Failed to create user.', {
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
            });
        }
    }

    async updateUser(id: string, name: string, email: string) {
        try {
            const invalidUserLen: number = await User.countDocuments({ _id: { $ne: id }, email: email });
            if (invalidUserLen > 0) {
                throw new GraphQLError(`User with email: ${email} already exists`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            let updatedUser: IUserModel = await User.findById(id);
            if (updatedUser) {
                await updatedUser.updateOne({
                    name: name || updatedUser.name,
                    email: email || updatedUser.email
                });
                this.user = updatedUser;
                return this.user;
            }
            throw new GraphQLError(`User with id: ${id} does not exist`, {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        } catch (error) {
            throw new GraphQLError('Failed to update user.', {
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
            });
        }
    }
    async deleteUser(id: string) {
        try {
            const deletedUser: IUserModel | null = await User.findByIdAndDelete(id);

            if (!deletedUser) {
                throw new GraphQLError(`User with id: ${id} does not exist`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            return deletedUser;
        } catch (error) {
            throw new GraphQLError('Failed to delete user.', {
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
            });
        }
    }

}