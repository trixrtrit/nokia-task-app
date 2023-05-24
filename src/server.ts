import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from "./graphql-files/schema";
import { resolvers } from "./graphql-files/resolvers";
import express from "express";
import cors from "cors";
import { config } from "./config/config";
import taskRoutes from "./routes/Task";
import taskUsers from "./routes/User";

interface MyContext {
  token?: String;
}

async function startApolloServer() {
  const app = express();
  const apolloServer = new ApolloServer<MyContext>({
    typeDefs,
    resolvers
  });

  await apolloServer.start();

  app.use(
    "/graphql",
    express.json(),
    express.urlencoded({ extended: true }),
    cors(),
    taskRoutes,
    taskUsers,
    expressMiddleware(apolloServer, {
      context: async ({ req }) => ({ token: req.headers.token }),
    })
  );

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.listen(config.server.port, () => {
    console.log(`Server listening on port ${config.server.port}!`);
  });

  return { app, apolloServer };
}

startApolloServer().catch((error) => {
  console.error(error);
});
export default startApolloServer;