// mongoose connection
import mongoose from "mongoose";
import { config } from "../../config/config";


const dbConnection = (): {conn: mongoose.Connection} => {
    try {
        mongoose.connect(config.mongo.url, {
            retryWrites: true,
            writeConcern: { w: "majority" }
        });
        const db = mongoose.connection;
        console.log("Connected to Mongo Cluster");
        return {conn: db};
    } catch (error) {
        console.log(`Unable to connect due to: ${error}`);
    }
}

export default dbConnection().conn;