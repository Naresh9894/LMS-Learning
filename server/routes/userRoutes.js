import express from "express";
import { addUserRating, getRecommendations, getUserCourseProgress, getUserData, purchaseCourse, trackCourseView, updatUsereCourseProgress, userEnrollledCourses } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get('/data',getUserData);
userRouter.get('/enrolled-courses',userEnrollledCourses);
userRouter.post('/purchase',purchaseCourse);

userRouter.post('/update-course-progress',updatUsereCourseProgress);
userRouter.post('/get-course-progress',getUserCourseProgress);
userRouter.post('/add-rating', addUserRating);
userRouter.get('/recommendations', getRecommendations);
userRouter.post('/track-view', trackCourseView);



export default userRouter;
