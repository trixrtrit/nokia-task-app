import gql from "graphql-tag"

export const typeDefs = gql`
    type User {
      _id: ID
      name: String!
      email: String!
    }

    enum taskProgress {
      TODO
      IN_PROGRESS
      DONE
    }
    type Task {
        _id: ID
        name: String!
        description: String
        status: taskProgress
        createdAt: String!
        updatedAt: String!
        user: ID
    }
  
    type Query {
      getUsers: [User]
      getTasks: [Task]
      getUser(_id: ID!): User
      getTask(_id: ID!): Task
      getUserTasks(user: ID!): [Task]
    }

    type Mutation {
      createUser(name: String!, email: String!): User
      updateUser(_id: ID!, name: String, email: String): User
      deleteUser(_id: ID!): User
      createTask(name: String!, description: String, status: taskProgress): Task
      updateTask(_id: ID!, name: String, description: String, status: taskProgress, user: ID): Task
      deleteTask(_id: ID!): Task
    }
  `;