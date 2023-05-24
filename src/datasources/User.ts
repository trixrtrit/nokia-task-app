import User from "../models/User";
import { IUserModel } from "../types/user";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { DataBaseSource } from "./DataBaseSource";
import { ApolloServerErrorCode } from '@apollo/server/errors';

export class UserDataSource extends DataBaseSource {
    private user: mongoose.Model<IUserModel>;

    constructor(db_connection: mongoose.Connection, model: mongoose.Model<IUserModel>) {
        super(db_connection, model)
        this.user = model
    }

    async createUser(name: string, email: string): Promise<IUserModel> {
        try {
            let newUser: IUserModel | null = await this.user.findOne({ email: email });
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
            if (error.extensions?.code == ApolloServerErrorCode.BAD_USER_INPUT) {
                console.error(`${error.message}`);

                throw new GraphQLError(error.message, {
                    extensions: { code: error.extensions.code },
                });
            } else {
                throw new GraphQLError('Failed to create user.', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        }
    }

    //first check if user exists to update
    //then check if email is already registered
    //if both conditions pass, update the user
    async updateUser(id: string, name: string, email: string): Promise<IUserModel> {
        try {
            let updatedUser: IUserModel = await this.user.findById(id);
            if (updatedUser) {
                const invalidUserLen: number = await this.user.countDocuments({ _id: { $ne: id }, email: email });
                if (invalidUserLen > 0) {
                    throw new GraphQLError(`User with email: ${email} already exists`, {
                        extensions: { code: 'BAD_USER_INPUT' },
                    });
                }
                await updatedUser.updateOne({
                    name: name || updatedUser.name,
                    email: email || updatedUser.email
                });
                return updatedUser;
            }
            throw new GraphQLError(`User with id: ${id} does not exist`, {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        } catch (error) {
            if (error.extensions?.code == ApolloServerErrorCode.BAD_USER_INPUT) {
                console.error(`${error.message}`);

                throw new GraphQLError(error.message, {
                    extensions: { code: error.extensions.code },
                });
            }
            throw new GraphQLError('Failed to update user.', {
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
            });
        }
    }

}