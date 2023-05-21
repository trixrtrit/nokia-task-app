import express, { Router } from "express";
import controller from "../controllers/User";

const router: Router = express.Router();

router.get("/users/:userId", controller.getUser);

router.get("/users", controller.getUsers);

router.post("/add-user", controller.createUser);

router.patch("/edit-user/:userId", controller.updateUser);

router.delete("/delete-user/:userId", controller.deleteUser);

export default router