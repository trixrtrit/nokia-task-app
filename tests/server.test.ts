import gql from "graphql-tag"
import startApolloServer from '../src/server';
import { ApolloServer, GraphQLResponse } from "@apollo/server";
import { Express } from "express";
import { UserDataSource } from "datasources/User";
import { TaskDataSource } from "datasources/Task";
import { typeDefs } from "../src/graphql-files/schema";
import { resolvers } from "../src//graphql-files/resolvers";
import { GraphQLError } from "graphql";

interface ContextValue {
  dataSources: {
    userAPI: UserDataSource;
    taskAPI: TaskDataSource;
  };
}

// create a test server to test against, using our production typeDefs,
// resolvers, and dataSources.
const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});


describe('GraphQL Server Tests', () => {
  

  test('Get users', async () => {
    const query = gql`
      query {
        getUsers {
          _id
          name
          email
        }
      }
    `;
    const response: GraphQLResponse = await server.executeOperation({ query: query });
    expect(response).toBeTruthy();
  });

  test('Get user', async () => {
    const query = gql`
      query {
        getUser(_id: "646cc25355b4ac995d5175b5") {
          _id
        }
      }
    `;
    const response:GraphQLResponse = await server.executeOperation({ query: query });
    expect(response).toBeTruthy();

  });

  test('Create user', async () => {
    const mutation = gql`
      mutation {
        createUser(name: "John", email: "john@example.com") {
          _id
          name
          email
        }
      }
    `;

    const response = await server.executeOperation({ query:mutation});
    expect(response).toBeDefined();

  });

  test('Update user to existing email', async () => {
    const mutation = gql`
      mutation {
        updateUser(_id: "646c05c280f991f77b33ff7c" name: "John", email: "john@example.com") {
          _id
          name
          email
        }
      }
    `;

    const response: GraphQLResponse = await server.executeOperation({ query:mutation});
    expect(response.body).toHaveProperty("singleResult.errors");
  });

  test('Update non-existing user', async () => {
    const mutation = gql`
      mutation {
        updateUser(_id: "746c05c280f991f77b33ff7c") {
          _id
          name
          email
        }
      }
    `;

    const response = await server.executeOperation({ query:mutation});
    expect(response.body).toHaveProperty("singleResult.errors");
  });

  test('Update user', async () => {
    const mutation = gql`
      mutation {
        updateUser(_id: "646cc25355b4ac995d5175b5" name: "Fred", email: "ola2@example.com") {
          _id
          name
          email
        }
      }
    `;

    const response: GraphQLResponse = await server.executeOperation({ query:mutation});
    expect(response).toBeDefined()

  });

  test('Create user with same email', async () => {
    const mutation = gql`
      mutation {
        createUser(name: "Hugo", email: "john@example.com") {
          _id
          name
          email
        }
      }
    `;

    const response: GraphQLResponse = await server.executeOperation({ query:mutation});
    expect(response.body).toHaveProperty("singleResult.errors");
  });

  test('Delete non-existing user', async () => {
    const mutation = gql`
      mutation {
        deleteUser(_id: "746c05c280f991f77b33ff7c") {
          _id
        }
      }
    `;

    const response = await server.executeOperation({ query:mutation});
    expect(response.body).toHaveProperty("singleResult.errors");
  });

  test('Delete user', async () => {
    const mutation = gql`
      mutation {
        deleteUser(_id: "646ac3b5f66c4f18a314ce3c") {
          _id
        }
      }
    `;

    const response: GraphQLResponse = await server.executeOperation({ query:mutation});
    expect(response).toBeDefined()

  });
});