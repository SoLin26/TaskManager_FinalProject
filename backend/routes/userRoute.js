import express from "express";
import { getUserData } from "../controller/userController.js";


const userRouter = express();

userRouter.get('/data', userAuth, getUserData)

export default userRouter;