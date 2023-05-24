import { GraphQLResponse } from "@apollo/server";
import server from "./server";
import gql from "graphql-tag"

describe('Task Graphql Resolver Tests', () => {
  

    test('Get tasks', async () => {
      const query = gql`
        query {
          getTasks {
            _id
            name
            description
            status
            user
            createdAt
            updatedAt
          }
        }
      `;
      const response: GraphQLResponse = await server.executeOperation({ query: query });
      expect(response).toBeTruthy();
    });
  
    test('Get Task', async () => {
      const query = gql`
        query {
          getTask(_id: "646aad31dd4777061b5ae6b1") {
            _id
          }
        }
      `;
      const response:GraphQLResponse = await server.executeOperation({ query: query });
      expect(response).toBeTruthy();
  
    });
  
    test('Get user tasks', async () => {
      const query = gql`
        query {
          getUserTasks(user: "646ab1edea56ff2368903b4d") {
            _id
            name
            description
            status
            user
            createdAt
            updatedAt
          }
        }
      `;
      const response: GraphQLResponse = await server.executeOperation({ query: query });
      expect(response).toBeTruthy();
    });
  
    test('Create task', async () => {
      const mutation = gql`
        mutation {
          createTask(name: "Clean roomba", description: "do things") {
            _id
            name
            description
          }
        }
      `;
  
      const response = await server.executeOperation({ query:mutation});
      expect(response).toBeDefined();
  
    });
  
    test('Update non-existing task', async () => {
      const mutation = gql`
        mutation {
          updateTask(_id: "746aad31dd4777061b5ae6b1", status: "DONE") {
            _id
            name
            description
            status
            user
          }
        }
      `;
  
      const response = await server.executeOperation({ query:mutation});
      expect(response.body).toHaveProperty("singleResult.errors");
    });
  
    test('Update task', async () => {
      const mutation = gql`
        mutation {
          updateTask(_id: "646aad31dd4777061b5ae6b1" , status: "DONE") {
            _id
            name
            description
            status
            user
          }
        }
      `;
  
      const response: GraphQLResponse = await server.executeOperation({ query:mutation});
      expect(response).toBeDefined()
  
    });
  
  
    test('Delete non-existing task', async () => {
      const mutation = gql`
        mutation {
          deleteTask(_id: "746c05c280f991f77b33ff7c") {
            _id
          }
        }
      `;
  
      const response = await server.executeOperation({ query:mutation});
      expect(response.body).toHaveProperty("singleResult.errors");
    });
  
    test('Delete task', async () => {
      const mutation = gql`
        mutation {
          deleteTask(_id: "646aad31dd4777061b5ae6b1") {
            _id
          }
        }
      `;
  
      const response: GraphQLResponse = await server.executeOperation({ query:mutation});
      expect(response).toBeDefined()
  
    });
  });