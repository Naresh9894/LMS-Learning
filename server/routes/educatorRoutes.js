import express from 'express';
import {addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator} from '../controllers/educatorController.js';
import { protectEducator } from '../middlewares/authMIddleware.js';
import upload from '../configs/multer.js';

const educatorRouter = express.Router();

//Route to update role to educator
educatorRouter.get('/update-role', updateRoleToEducator);
educatorRouter.post('/add-course',upload.single('image'),protectEducator,
 addCourse);
educatorRouter.get('/courses', protectEducator, getEducatorCourses);
educatorRouter.get('/dashboard-data', protectEducator, educatorDashboardData);
educatorRouter.get('/course/:courseId/students', protectEducator, getEnrolledStudentsData);

export default educatorRouter;
