import express from "express";
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updatUsereCourseProgress, userEnrollledCourses } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/data',getUserData);
userRouter.get('/enrolled-courses',userEnrollledCourses);
userRouter.post('/purchase',purchaseCourse);

userRouter.post('/update-course-progress',updatUsereCourseProgress);
userRouter.post('/get-course-progress',getUserCourseProgress);
userRouter.post('/add-rating', addUserRating);



export default userRouter;