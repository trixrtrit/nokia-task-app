import { GraphQLResponse } from "@apollo/server";
import server from "./server";
import gql from "graphql-tag"

describe('Get Task Resolver Tests', () => {
  test('Get tasks', async () => {
    const query = gql`
      query {
        getTasks {
          _id
          name
          description
          status
          createdAt
          updatedAt
          user
        }
      }
    `;
    const response: any = await server.executeOperation({ query: query });
    expect(response.body).toHaveProperty('singleResult.data.getTasks');
    console.log(response.body)
    for (const task of response.body.singleResult.data.getTasks) {
      if (task.user) {
        expect(task).toMatchObject({
          _id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String) || null,
          status: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          user: expect.any(String),
        })
      }
      else {
        expect(task).toMatchObject({
          _id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String) || null,
          status: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          user: null,
        })
      }
    };
  });

  test('Get Task', async () => {
    const query = gql`
      query {
        getTask(_id: "646aad31dd4777061b5ae6b1") {
          _id
        }
      }
    `;
    const response: any = await server.executeOperation({ query: query });
    if (response.body.singleResult.data.getTask) {
      expect(response.body.singleResult.data.getTask._id).toEqual("646aad31dd4777061b5ae6b1")
    } else {
      expect(response.body.singleResult.data.getTask).toBeNull()
    }

  });

  test('Get user tasks', async () => {
    const query = gql`
      query {
        getUserTasks(user: "646ab1edea56ff2368903b4d") {
          _id
          name
          description
          status
          createdAt
          updatedAt
          user
        }
      }
    `;
    const response: any = await server.executeOperation({ query: query });
    if (response.body.singleResult.data.getUserTasks) {

      expect(response.body).toHaveProperty('singleResult.data.getUserTasks');
      for (const task of response.body.singleResult.data.getUserTasks) {
        expect(task).toMatchObject({
          _id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String) || expect.any(null),
          status: expect.any(String),
          user: expect(response.body.singleResult.data.getUserTasks.user).toEqual("646ab1edea56ff2368903b4d"),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        })
      }
    }
    else {
      expect(response.body.singleResult.data.getUserTasks).toBeNull()
    }
  });
});

describe('Task Creation Graphql Resolver Tests', () => {
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

    const response = await server.executeOperation({ query: mutation });
    expect(response).toBeDefined();

  });
});

describe('Task Update Graphql Resolver Tests', () => {

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

    const response = await server.executeOperation({ query: mutation });
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

    const response: GraphQLResponse = await server.executeOperation({ query: mutation });
    expect(response).toBeDefined()

  });
});

describe('Task Delete Graphql Resolver Tests', () => {

  test('Delete non-existing task', async () => {
    const mutation = gql`
        mutation {
          deleteTask(_id: "746c05c280f991f77b33ff7c") {
            _id
          }
        }
      `;

    const response = await server.executeOperation({ query: mutation });
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

    const response: GraphQLResponse = await server.executeOperation({ query: mutation });
    expect(response).toBeDefined()

  });
});