import { ITaskModel } from "types/task";
import User from "../models/User";
import Task from "../models/Task";
import { IUserModel } from "types/user";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";

export class TaskDataSource {
    private tasks: ITaskModel[];
    private task: ITaskModel;
    private db_connection: mongoose.Connection;

    constructor(dbConnection: mongoose.Connection) {
        this.db_connection = dbConnection;
    }

    async getTasks() {
        this.tasks = await Task.find()
        return this.tasks;
    }
    async getTask(id: string) {
        try {
            const task: IUserModel | null = await Task.findById(id);
 
            if (!task) {
                throw new GraphQLError(`Task with id: ${id} does not exist`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            return task;
        } catch (error) {
            throw new GraphQLError(`Task with id: ${id} does not exist`, {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }
    }

    async getTasksByUser(id: string) {
        this.tasks = await Task.find({ "user": id });
        return this.tasks;
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

    async updateTask(id: string, name: string, description: string, status: string, user: string) {
        try {
            let updatedTask: ITaskModel = await Task.findById(id);
            if (updatedTask) {
                await updatedTask.updateOne({
                    $set:
                    {
                        name: name || updatedTask.name,
                        description: description || updatedTask.description,
                        status: status || updatedTask.status,
                        user: user || updatedTask.user
                    }
                });
                this.task = updatedTask;
                return updatedTask;
            }
            throw new GraphQLError(`Task with id: ${id} does not exist`, {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        } catch (error) {
            throw new GraphQLError('Failed to update task.', {
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
            });
        }
    }
    async deleteTask(id: string) {
        try {
            const deletedTask: IUserModel | null = await Task.findByIdAndDelete(id);

            if (!deletedTask) {
                throw new GraphQLError(`Task with id: ${id} does not exist`, {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            return deletedTask;
        } catch (error) {
            throw new GraphQLError('Failed to delete Task.', {
                extensions: { code: 'INTERNAL_SERVER_ERROR' },
            });
        }
    }
}
