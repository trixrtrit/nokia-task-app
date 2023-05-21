import {Document} from "mongoose";

export interface ITask {
    name: string;
    description: string;
    status: string;
};

export interface ITaskModel extends ITask, Document {};