import {Document} from "mongoose";

export interface ITask {
    name: string;
    description: string;
    status: string;
    user: string
};

export interface ITaskModel extends ITask, Document {};