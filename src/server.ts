import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { error } from "console";
import { config } from "./config/config";

const app = express()
app.use(cors());

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
