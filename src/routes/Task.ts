import express, { Router } from "express";
import controller from "../controllers/Task";

const router: Router = express.Router();

router.get("/tasks/:taskId", controller.getTask);

router.get("/tasks", controller.getTasks);

router.post("/add-task", controller.createTask);

router.patch("/edit-task/:taskId", controller.updateTask);

router.delete("/delete-task/:taskId", controller.deleteTask);

export default router