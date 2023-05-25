import { ITaskModel } from "types/task";
import Task from "../models/Task";
import mongoose from "mongoose";
import { GraphQLError } from "graphql";
import { DataBaseSource } from "./DataBaseSource";
import { ApolloServerErrorCode } from '@apollo/server/errors';

/**
 * TaskDataSource is a class that provides data access methods for tasks.
 * It extends the DataBaseSource class.
 * Task is the task model used for querying the task collection
 * db represents The MongoDB database connection.
 */

export class TaskDataSource extends DataBaseSource {
    private task: mongoose.Model<ITaskModel>;
    private db : mongoose.Connection;

    constructor(db_connection: mongoose.Connection, model: mongoose.Model<ITaskModel>) {
        super(db_connection, model);
        this.task = model;
        this.db = db_connection
    }

    /**
   * Retrieves tasks associated with a specific user.
   * @param id The ID of the user.
   * @returns A promise that resolves to an array of tasks.
   */

    async getTasksByUser(id: string): Promise<ITaskModel[]> {
        const tasks: ITaskModel[] | null = await Task.find({ "user": id });
        return tasks;
    }

    /**
   * Creates a new task.
   * @param name The name of the task.
   * @param description The description of the task.
   * @param status The status of the task.
   * @param user The ID of the user that will be assigned with the created task (optional).
   * The user must exist so that a task is assigned to him
   * @returns A promise that resolves to the created task.
   * @throws GraphQLError if there is an error while creating the task.
   */
    async createTask(name: string, description: string, status: string, user?: string): Promise<ITaskModel> {
        try {
            if(user){
                const userDocs: number = await this.db.model('User').countDocuments({_id: user});
                if(userDocs == 0){
                    throw new GraphQLError(`User with id: ${user} does not exist`, {
                        extensions: { code: 'BAD_USER_INPUT' },
                    });
                }
            }
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
            if (error.extensions?.code == ApolloServerErrorCode.BAD_USER_INPUT) {
                console.error(`${error.message}`);

                throw new GraphQLError(error.message, {
                    extensions: { code: error.extensions.code },
                });
            } else {
                throw new GraphQLError('Failed to create task.', {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        }
    }

    /**
   * Updates an existing task with new values.
   * @param id The ID of the task to update.
   * @param name The new name of the task (optional).
   * @param description The new description of the task (optional).
   * @param status The new status of the task (optional).
   * @param user The ID of the user that will be assigned with the task (optional). 
   * The user must exist so that a task is assigned to him
   * @returns A promise that resolves to the updated task model.
   * @throws GraphQLError if the user or task does not exist, or there is an error while updating the task.
   */
    async updateTask(id: string, name?: string, description?: string, status?: string, user?: string): Promise<ITaskModel> {
        try {
            if(user){
                const userDocs: number = await this.db.model('User').countDocuments({_id: user});
                if(userDocs == 0){
                    throw new GraphQLError(`User with id: ${user} does not exist`, {
                        extensions: { code: 'BAD_USER_INPUT' },
                    });
                }
            }
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
