import { UserDataSource } from "../datasources/User";
import { TaskDataSource } from "../datasources/Task";
import dbConnection from "../db/connection/connection";
import { GraphQLError } from "graphql";
import User from "../models/User";
import Task from "../models/Task";

let userDataSource = new UserDataSource(dbConnection, User);
let taskDataSource = new TaskDataSource(dbConnection, Task);

export const resolvers = {
  Query: {
    getUsers: async () => {
      const allUsers = await userDataSource.getModels();
      return allUsers;
    },
    getTasks: async () => {
      const allTasks = await taskDataSource.getModels();
      return allTasks;
    },
    getTask: async (_: any, { _id }: { _id: string }) => {
      try {
        const task = await taskDataSource.getModel(_id);
        return task;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    getUser: async (_: any, { _id }: { _id: string }) => {
      try {
        const user = await userDataSource.getModel(_id);
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
    getUserTasks: async (_: any, { user }: { user: string }) => {
      const userTasks = await taskDataSource.getTasksByUser(user);
      return userTasks;
    },
  },
  Mutation: {
    createUser: async (_: any, { name, email }: { name: string, email: string }) => {
      try {
        const newUser = await userDataSource.createUser(name, email);
        return newUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateUser: async (_: any, { _id, name, email }: { _id: string, name: string, email: string }) => {
      try {
        const updatedUser = await userDataSource.updateUser(_id, name, email);
        return updatedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteUser: async (_: any, { _id }: { _id: string }) => {
      try {
        const deletedUser = await userDataSource.deleteModel(_id);
        return deletedUser;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    createTask: async (_: any, { name, description, status, user }:
      { name: string, email: string, description: string, status: string, user: string }) => {
      try {
        const newTask = await taskDataSource.createTask(name, description, status, user);
        return newTask;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    updateTask: async (_: any, { _id, name, description, status, user }:
      { _id: string, name: string, email: string, description: string, status: string, user: string }) => {
      try {
        const updatedTask = await taskDataSource.updateTask(_id, name, description, status, user);
        return updatedTask;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    deleteTask: async (_: any, { _id }: { _id: string }) => {
      try {
        const deletedTask = await taskDataSource.deleteModel(_id);
        return deletedTask;
      } catch (error) {
        throw new Error(error.message);
      }
    },
    assignTask: async (_: any, { _id, user }: { _id: string, user: string }) => {
      try {
        const updatedTask = await taskDataSource.updateTask(_id, _, _, _, user);
        return updatedTask;
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
}
