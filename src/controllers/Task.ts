import { Request, Response } from "express";
import mongoose from "mongoose";
import Task from "../models/Task";
import { ITaskModel } from "../types/task";


const createTask = async (req: Request, res: Response) => {
    try {

        const { name, description, status, user } = req.body;
        const newTask: ITaskModel = new Task({
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
            status,
            user
        });
        await newTask.save();
        const allTasks: ITaskModel[] = await Task.find();
        res.status(201).json({ message: "Task added", task: newTask, allTasks: allTasks });
        return newTask;

    } catch (error) {
        res.status(500).json({ message: "F", error: error });
    }
};

const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks: ITaskModel[] = await Task.find();
        res.status(200).json({ tasks });
        return tasks;

    } catch (error) {
        res.status(500).json({ error });
    }
};

const getUserTasks = async (req: Request, res: Response) => {
    try {
        const foreignUser = req.params.userId
        const tasks: ITaskModel[] = await Task.find({ "user": foreignUser });
        res.status(200).json({ tasks });
        return tasks;

    } catch (error) {
        res.status(500).json({ error });
    }
};

const getTask = async (req: Request, res: Response) => {
    try {
        const taskId = req.params.taskId;
        const task: ITaskModel = await Task.findById(taskId);
        if (task) {
            res.status(200).json({ task });
            return task;
        }
        else {
            res.status(404).json({ message: `Task with id: ${taskId} not found` });
        }
        
    } catch (error) {
        res.status(500).json({ error });
    }
}

const updateTask = async (req: Request, res: Response) => {
    try {
        const { taskId } = req.params;
        const req_body = req.body;

        const task: ITaskModel = await Task.findById(taskId);
        if (task) {
            const updatedTask: ITaskModel = await task.updateOne(req_body);
            const alltasks: ITaskModel[] = await Task.find();
            res.status(200).json({ updatedTask, alltasks });
            return task;
        }
        else {
            res.status(404).json({ message: `Task with id: ${taskId} not found` });
        }

    } catch (error) {
        res.status(500).json({ error });
    }
};

const deleteTask = async (req: Request, res: Response) => {
    try {
        const deletedTask: ITaskModel | null = await Task.findByIdAndRemove(
            req.params.taskId
        )
        const allTasks: ITaskModel[] = await Task.find()
        res.status(200).json({
            message: "Task deleted",
            task: deletedTask,
            tasks: allTasks,
        })
    } catch (error) {

    }
};

export default { getTask, getTasks, createTask, updateTask, deleteTask, getUserTasks };