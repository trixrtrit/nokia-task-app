import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/User";
import { IUserModel } from "types/User";


const createUser = async (req: Request, res: Response) => {
    try {

        const { name, email, task } = req.body;
        let newUser: IUserModel = await User.findOne({ email: email });
        if (newUser) {
            res.status(400).json({ message: `The email: ${email} is already registered` });
        }
        else {
            newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                name,
                email,
                task
            });

            await newUser.save();
            const allUsers: IUserModel[] = await User.find();
            res.status(201).json({ message: "User added", user: newUser, allUsers: allUsers });
            return newUser;
        }

    } catch (error) {
        res.status(500).json({ message: "F", error: error });
    }
};

const getUsers = async (req: Request, res: Response) => {
    try {
        const users: IUserModel[] = await User.find();
        res.status(200).json({ users });
        return users;

    } catch (error) {
        res.status(500).json({ error });
    }
};

const getUser = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId;
        const user: IUserModel = await User.findById(userId);
        if (user != null) {
            res.status(200).json({ user });
            return user;
        }
        else {
            res.status(404).json({ message: `User with id: ${userId} not found` });
        }

    } catch (error) {
        res.status(500).json({ error });
    }
}

const updateUser = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const req_body = req.body;
        const { email } = req_body;

        //must find if there are any other users with the same email
        const invalidUserLen: number = (await User.find({ _id: { $ne: userId }, email: email })).length
        const user: IUserModel = await User.findById(userId);
        if (user && invalidUserLen == 0) {
            const updatedUser: IUserModel = await user.updateOne(req_body);
            const allUsers: IUserModel[] = await User.find();
            res.status(200).json({ updatedUser, allUsers });
            return user;
        }
        else if (invalidUserLen > 0) {
            res.status(400).json({ message: `A different user with the email: ${email} already exists` });
        }
        else {
            res.status(404).json({ message: `User with id: ${userId} not found` });
        }

    } catch (error) {
        res.status(500).json({ error });
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser: IUserModel | null = await User.findByIdAndRemove(
            req.params.userId
        )
        const allUsers: IUserModel[] = await User.find()
        res.status(200).json({
            message: "User deleted",
            deletedUser,
            allUsers
        })
    } catch (error) {
    }
};

export default { getUser, getUsers, createUser, updateUser, deleteUser };