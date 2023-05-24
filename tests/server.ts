import { ApolloServer } from "@apollo/server";
import { UserDataSource } from "datasources/User";
import { TaskDataSource } from "datasources/Task";
import { typeDefs } from "../src/graphql-files/schema";
import { resolvers } from "../src/graphql-files/resolvers";

interface ContextValue {
  dataSources: {
    userAPI: UserDataSource;
    taskAPI: TaskDataSource;
  };
}

// create a test server to test 
const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});

export default server


