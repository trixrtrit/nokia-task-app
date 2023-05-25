import { UserDataSource } from "../datasources/User";
import { TaskDataSource } from "../datasources/Task";
import dbConnection from "../db/connection/connection";
import { GraphQLError } from "graphql";
import User from "../models/User";
import Task from "../models/Task";
import { ITaskModel } from "../types/task";
import { IUserModel } from "types/user";
import mongoose from "mongoose";

// Create instances of the data sources which will be used,
// passing the connection and the model which they are based on
let userDataSource = new UserDataSource(dbConnection, User);
let taskDataSource = new TaskDataSource(dbConnection, Task);

export const resolvers = {
  Query: {
    /**
     * Resolver for the "getUsers" query.
     * Retrieves all users from the data source.
     * @returns A promise that resolves to an array of User models.
     */
    getUsers: async (): Promise< mongoose.Model<IUserModel>[]> => {
      const allUsers: mongoose.Model<IUserModel>[] = await userDataSource.getModels();
      return allUsers;
    },

    /**
     * Resolver for the "getTasks" query.
     * Retrieves all tasks from the data source.
     * @returns A promise that resolves to an array of Task models.
     */
    getTasks: async (): Promise< mongoose.Model<ITaskModel>[]> => {
      const allTasks: mongoose.Model<ITaskModel>[] = await taskDataSource.getModels();
      return allTasks;
    },

    /**
     * Resolver for the "getTask" query.
     * Retrieves a single task by its ID from the data source.
     * @param _ The parent object, not used in this resolver.
     * @param _id The ID of the task to retrieve.
     * @returns A promise that resolves to the retrieved Task model.
     * @throws Error if the task with the given ID does not exist, or there is an error while fetching the task.
     */
    getTask: async (_: any, { _id }: { _id: string }): Promise< mongoose.Model<ITaskModel>> => {
      try {
        const task: mongoose.Model<ITaskModel> = await taskDataSource.getModel(_id);
        return task;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    /**
     * Resolver for the "getUser" query.
     * Retrieves a single user by their ID from the data source.
     * @param _ The parent object, not used in this resolver.
     * @param _id The ID of the user to retrieve.
     * @returns A promise that resolves to the retrieved User model.
     * @throws GraphQLError if the user with the given ID does not exist, or there is an error while fetching the user.
     */
    getUser: async (_: any, { _id }: { _id: string }): Promise< mongoose.Model<IUserModel>> => {
      try {
        const user: mongoose.Model<IUserModel> = await userDataSource.getModel(_id);
        if (user) {
          return user;
        }
        else {
          throw new GraphQLError("User does not exist", { extensions: { code: 'BAD_USER_INPUT' } })
        }
      } catch (error) {
        console.log(`${error}`);
      }
    },

    /**
     * Resolver for the "getUserTasks" query.
     * Retrieves all tasks associated with a user from the data source.
     * @param _ The parent object, not used in this resolver.
     * @param user The ID of the user to retrieve tasks for.
     * @returns A promise that resolves to an array of Task models associated with the user.
     */
    getUserTasks: async (_: any, { user }: { user: string }): Promise<ITaskModel[]> => {
      const userTasks: ITaskModel[] = await taskDataSource.getTasksByUser(user);
      return userTasks;
    },
  },
  Mutation: {
    /**
     * Resolver for the "createUser" mutation.
     * Creates a new user in the data source.
     * @param _ The parent object, not used in this resolver.
     * @param name The name of the user.
     * @param email The email of the user.
     * @returns A promise that resolves to the newly created User model.
     * @throws Error if there is an error while creating the user.
     */
    createUser: async (_: any, { name, email }: { name: string, email: string }): Promise<IUserModel> => {
      try {
        const newUser = await userDataSource.createUser(name, email);
        return newUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    /**
     * Resolver for the "updateUser" mutation.
     * Updates an existing user in the data source.
     * @param _ The parent object, not used in this resolver.
     * @param _id The ID of the user to update.
     * @param name The updated name of the user.
     * @param email The updated email of the user.
     * @returns A promise that resolves to the updated User model.
     * @throws Error if there is an error while updating the user.
     */
    updateUser: async (_: any, { _id, name, email }: { _id: string, name: string, email: string }): Promise<IUserModel> => {
      try {
        const updatedUser = await userDataSource.updateUser(_id, name, email);
        return updatedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    /**
     * Resolver for the "deleteUser" mutation.
     * Deletes a user from the data source.
     * @param _ The parent object, not used in this resolver.
     * @param _id The ID of the user to delete.
     * @returns A promise that resolves to the deleted User model.
     * @throws Error if there is an error while deleting the user.
     */
    deleteUser: async (_: any, { _id }: { _id: string }): Promise<mongoose.Model<IUserModel>> => {
      try {
        const deletedUser: mongoose.Model<IUserModel> = await userDataSource.deleteModel(_id);
        return deletedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    /**
     * Resolver for the "createTask" mutation.
     * Creates a new task in the data source.
     * @param _ The parent object, not used in this resolver.
     * @param name The name of the task.
     * @param description The description of the task.
     * @param status The status of the task.
     * @param user The ID of the user associated with the task.
     * @returns A promise that resolves to the newly created Task model.
     * @throws Error if there is an error while creating the task.
     */
    createTask: async (_: any, { name, description, status, user }:
      { name: string, email: string, description: string, status: string, user: string }): Promise<ITaskModel> => {
      try {
        const newTask = await taskDataSource.createTask(name, description, status, user);
        return newTask;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    /**
     * Resolver for the "updateTask" mutation.
     * Updates an existing task in the data source.
     * @param _ The parent object, not used in this resolver.
     * @param _id The ID of the task to update.
     * @param name The updated name of the task.
     * @param description The updated description of the task.
     * @param status The updated status of the task.
     * @param user The updated user associated with the task.
     * @returns A promise that resolves to the updated Task model.
     * @throws Error if there is an error while updating the task.
     */
    updateTask: async (_: any, { _id, name, description, status, user }:
      { _id: string, name: string, email: string, description: string, status: string, user: string }): Promise<ITaskModel> => {
      try {
        const updatedTask = await taskDataSource.updateTask(_id, name, description, status, user);
        return updatedTask;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    /**
     * Resolver for the "deleteTask" mutation.
     * Deletes a task from the data source.
     * @param _ The parent object, not used in this resolver.
     * @param _id The ID of the task to delete.
     * @returns A promise that resolves to the deleted Task model.
     * @throws Error if there is an error while deleting the task.
     */
    deleteTask: async (_: any, { _id }: { _id: string }): Promise<mongoose.Model<ITaskModel>> => {
      try {
        const deletedTask: mongoose.Model<ITaskModel> = await taskDataSource.deleteModel(_id);
        return deletedTask;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    /**
     * Resolver for the "assignTask" mutation.
     * Assigns a task to a user in the data source.
     * @param _ The parent object, not used in this resolver.
     * @param _id The ID of the task to assign.
     * @param user The ID of the user to assign the task to.
     * @returns A promise that resolves to the updated Task model.
     * @throws Error if there is an error while assigning the task.
     */
    assignTask: async (_: any, { _id, user }: { _id: string, user: string }): Promise<ITaskModel> => {
      try {
        const updatedTask = await taskDataSource.updateTask(_id, _, _, _, user);
        return updatedTask;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
}
