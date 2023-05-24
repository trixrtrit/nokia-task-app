import { UserDataSource } from "../datasources/User";
import { TaskDataSource } from "../datasources/Task";
import dbConnection from "../db/connection/connection";
import { GraphQLError } from "graphql";
import User from "../models/User";
import Task from "../models/Task";
import { ITaskModel } from "../types/task";
import { IUserModel } from "types/user";
import mongoose from "mongoose";

let userDataSource = new UserDataSource(dbConnection, User);
let taskDataSource = new TaskDataSource(dbConnection, Task);

export const resolvers = {
  Query: {
    getUsers: async (): Promise< mongoose.Model<IUserModel>[]> => {
      const allUsers: mongoose.Model<IUserModel>[] = await userDataSource.getModels();
      return allUsers;
    },
    getTasks: async (): Promise< mongoose.Model<ITaskModel>[]> => {
      const allTasks: mongoose.Model<ITaskModel>[] = await taskDataSource.getModels();
      return allTasks;
    },
    getTask: async (_: any, { _id }: { _id: string }): Promise< mongoose.Model<ITaskModel>> => {
      try {
        const task: mongoose.Model<ITaskModel> = await taskDataSource.getModel(_id);
        return task;
      } catch (error) {
        throw new Error(error.message);
      }
    },
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
    getUserTasks: async (_: any, { user }: { user: string }): Promise<ITaskModel[]> => {
      const userTasks: ITaskModel[] = await taskDataSource.getTasksByUser(user);
      return userTasks;
    },
  },
  Mutation: {
    createUser: async (_: any, { name, email }: { name: string, email: string }): Promise<IUserModel> => {
      try {
        const newUser = await userDataSource.createUser(name, email);
        return newUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateUser: async (_: any, { _id, name, email }: { _id: string, name: string, email: string }): Promise<IUserModel> => {
      try {
        const updatedUser = await userDataSource.updateUser(_id, name, email);
        return updatedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteUser: async (_: any, { _id }: { _id: string }): Promise<mongoose.Model<IUserModel>> => {
      try {
        const deletedUser: mongoose.Model<IUserModel> = await userDataSource.deleteModel(_id);
        return deletedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    createTask: async (_: any, { name, description, status, user }:
      { name: string, email: string, description: string, status: string, user: string }): Promise<ITaskModel> => {
      try {
        const newTask = await taskDataSource.createTask(name, description, status, user);
        return newTask;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateTask: async (_: any, { _id, name, description, status, user }:
      { _id: string, name: string, email: string, description: string, status: string, user: string }): Promise<ITaskModel> => {
      try {
        const updatedTask = await taskDataSource.updateTask(_id, name, description, status, user);
        return updatedTask;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteTask: async (_: any, { _id }: { _id: string }): Promise<mongoose.Model<ITaskModel>> => {
      try {
        const deletedTask: mongoose.Model<ITaskModel> = await taskDataSource.deleteModel(_id);
        return deletedTask;
      } catch (error) {
        throw new Error(error.message);
      }
    },
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
