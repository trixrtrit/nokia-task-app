import dotenv from 'dotenv';
dotenv.config()

const SERVER_PORT: string | number = process.env.PORT || 3000;
const MONGO_USERNAME: string = process.env.MONGO_USER || '';
const MONGO_PASSWORD: string = process.env.MONGO_PASS || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@nokiataskmanagement.xqiymvj.mongodb.net/`;

export const config = {
    mongo: {
        url: MONGO_URL,
    },
    server: {
        port: SERVER_PORT,
    },
};