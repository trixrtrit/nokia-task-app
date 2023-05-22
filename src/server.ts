import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { error } from "console";
import { config } from "./config/config";
import taskRoutes from "./routes/Task";
import taskUsers from "./routes/User";

const app = express()
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(taskRoutes);
app.use(taskUsers);

app.get("/",  (req, res) => {
    res.send("Hello World!");
  });

app.listen(config.server.port, () => {
    console.log(`Server listening on port ${config.server.port}!`);
  });

//mongoose connection
mongoose
  .connect(config.mongo.url, {retryWrites: true, writeConcern: {w: "majority"}})
  .then(()=> {
    console.log("Connected to Mongo Cluster");
  })
  .catch((error)=>{
    console.log(`Unable to connect due to: ${error}`);
  });


