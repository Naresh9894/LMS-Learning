import express from "express";
import { getUserData, purchaseCourse, userEnrollledCourses } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/data',getUserData);
userRouter.get('/enrolled-courses',userEnrollledCourses);
userRouter.post('/purchase',purchaseCourse);

export default userRouter;