import { Request, Response } from "express";
import mongoose from "mongoose";
import Task from "../models/Task";
import { ITaskModel } from "../types/Task";


const createTask = async (req: Request, res: Response): Promise<ITaskModel> => {
    try {

        const { name,description,status } = req.body;

        const addingTask = new Task({
            _id: new mongoose.Types.ObjectId(),
            name,
            description,
            status
        });
        await addingTask.save();
        const allTasks: ITaskModel[] = await Task.find();
        res.status(201).json({ message: "Task added", task: addingTask, allTasks: allTasks});
        return addingTask;

    } catch (error) {
        res.status(500).json({ message: "F", error: error });
    }
};

const getTasks = async (req: Request, res: Response): Promise<ITaskModel[]> => {
    try {
        const tasks: ITaskModel[] = await Task.find();
        res.status(200).json({ tasks });
        return tasks;

    } catch (error) {
        res.status(500).json({ error });
    }
};

const getTask = async (req: Request, res: Response): Promise<ITaskModel> => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);
        if (task != null) {
            res.status(200).json({ task });
        }
        else {
            res.status(404).json({ message: `Task with id: ${taskId} not found` });
        }
        return task;
    } catch (error) {
        res.status(500).json({ error });
    }
}

const updateTask = async (req: Request, res: Response): Promise<ITaskModel> => {
    try {
        const { taskId } = req.params;
        const req_body = req.body;

        const task = await Task.findById(taskId);
        if (task) {
            const updatedTask = await task.updateOne(req_body);
            const alltasks: ITaskModel[] = await Task.find();
            res.status(200).json({ task, alltasks });
            return task;
        }
        else {
            res.status(404).json({ message: `Task with id: ${taskId} not found` });
        }

    } catch (error) {
        res.status(500).json({ error });
    }
};

const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const deletedTask: ITaskModel | null = await Task.findByIdAndRemove(
            req.params.taskId
        )
        const allTasks: ITaskModel[] = await Task.find()
        res.status(200).json({
            message: "Todo deleted",
            task: deletedTask,
            tasks: allTasks,
        })
    } catch (error) {

    }
};

export default { getTask, getTasks, createTask, updateTask, deleteTask };