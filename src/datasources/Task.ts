import { ITaskModel } from "types/task";
import Task from "../models/Task";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { DataBaseSource } from "./DataBaseSource";
import { ApolloServerErrorCode } from '@apollo/server/errors';

export class TaskDataSource extends DataBaseSource {
    private task: mongoose.Model<ITaskModel>;;

    constructor(db_connection: mongoose.Connection, model: mongoose.Model<ITaskModel>) {
        super(db_connection, model);
        this.task = model;
    }

    async getTasksByUser(id: string) {
        const tasks: ITaskModel[] | null = await Task.find({ "user": id });
        return tasks;
    }
    async createTask(name: string, description: string, status: string, user: string) {
        try {
            const newTask: ITaskModel = new Task({
                _id: new mongoose.Types.ObjectId(),
                name,
                description,
                status,
                user
            });
            await newTask.save();
            return newTask;
        } catch (error) {
            throw new GraphQLError('Failed to create task.', {
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
            });
        }
    }

    async updateTask(id: string, name?: string, description?: string, status?: string, user?: string) {
        try {
            let updatedTask: ITaskModel | null = await this.task.findById(id);
            if (updatedTask) {
                await updatedTask.updateOne({
                    $set:
                    {
                        name: name || updatedTask.name,
                        description: description || updatedTask.description,
                        status: status || updatedTask.status,
                        user: user || updatedTask.user
                    }
                },{new: true});
                return updatedTask;
            }
            throw new GraphQLError(`Task with id: ${id} does not exist`, {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        } catch (error) {
            if (error.extensions?.code == ApolloServerErrorCode.BAD_USER_INPUT) {
                console.error(`${error.message}`);

                throw new GraphQLError(error.message, {
                    extensions: { code: error.extensions.code },
                });
            } else {
                throw new GraphQLError('Failed to update task.', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        }
    }

    
}
