import { GraphQLResponse } from "@apollo/server";
import server from "./server";
import gql from "graphql-tag"

describe('Get User Resolver Tests', () => {
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
        const response: any = await server.executeOperation({ query: query });
        expect(response.body).toHaveProperty('singleResult.data.getUsers');
        for (const user of response.body.singleResult.data.getUsers) {
            expect(user).toMatchObject({
                _id: expect.any(String),
                name: expect.any(String),
                email: expect.any(String),
            })
        };
    });

    test('Get user', async () => {
        const query = gql`
          query {
            getUser(_id: "646cc25355b4ac995d5175b5") {
              _id
            }
          }
        `;
        const response: any = await server.executeOperation({ query: query });
        if(response.body.singleResult.data.getUser){
            expect(response.body.singleResult.data.getUser._id).toEqual("646cc25355b4ac995d5175b5")
        }else{
            expect(response.body.singleResult.data.getUser).toBeNull()
        }

    });
});
describe('Create User Graphql Resolver Tests', () => {
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

        const response: GraphQLResponse = await server.executeOperation({ query: mutation });
        expect(response).toBeDefined();

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

        const response: GraphQLResponse = await server.executeOperation({ query: mutation });
        expect(response.body).toHaveProperty("singleResult.errors");
    });
});

describe('Delete User Graphql Resolver Tests', () => {
    test('Delete non-existing user', async () => {
        const mutation = gql`
          mutation {
            deleteUser(_id: "746c05c280f991f77b33ff7c") {
              _id
            }
          }
        `;

        const response = await server.executeOperation({ query: mutation });
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

        const response: GraphQLResponse = await server.executeOperation({ query: mutation });
        expect(response).toBeDefined()

    });
});

describe('Update User Graphql Resolver Tests', () => {

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

        const response: GraphQLResponse = await server.executeOperation({ query: mutation });
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

        const response = await server.executeOperation({ query: mutation });
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

        const response: GraphQLResponse = await server.executeOperation({ query: mutation });
        expect(response).toBeDefined()
    });
});