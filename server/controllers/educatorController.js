import {clerkClient} from "@clerk/express";
import User from "../models/user.js";
import {v2 as cloudinary} from 'cloudinary';
import Course from "../models/course.js";
import Purchase from "../models/Purchase.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { QuizProgress } from "../models/QuizProgress.js";

//Api controller to update role to educator
export const updateRoleToEducator = async (req, res) => {
    try{
        const userId = req.auth().userId;

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {role: 'educator'}
        });
        res.json({success: true, message: "You can publish course now"});
    }catch(error){
        res.json({success: false, message: error.message});
    }

}

//add new course
export const addCourse = async (req, res) => {
    try{
        const { courseData } = req.body;
        const imageFile = req.file;
        const educatorId = req.auth().userId;

        if(!imageFile){
            return res.json({success: false, message: "Course thumbnail Not attached"});
    }
    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);
    const imageUpload = await cloudinary.uploader.upload(imageFile.path)
    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();
    res.json({success: true, message: "Course Added successfully"});
    }catch(error){
        res.json({success: false, message: error.message});
    }
}

//get educator courses

export const getEducatorCourses = async (req, res) => {
    try{
        const educator = req.auth().userId;
        const courses = await Course.find({educator})
        res.json({success: true, courses});
    }catch(error){
        res.json({success: false, message: error.message});
    }

}

// get educator dashboard data(total eranings, enrolled students, total courses etc)

export const educatorDashboardData = async (req, res) => { 
    try{
        const educator = req.auth().userId;
        const courses = await Course.find({educator});
        const totalCourses = courses.length;

        const courseIds = courses.map((course) => course._id);
        //total earnings
        const purchases= await Purchase.find({courseId: {$in: courseIds}, status: 'completed'
        });
        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);
        //Collect unique student IDs from purchases
        const enrolledStudentData= [];
        for(const course of courses){
            const students = await User.find({_id: {$in: course.enrolledStudents}},'name imageUrl');

            students.forEach(student => {
                enrolledStudentData.push({
                    courseTitle: course.courseTitle,
                    student

            });        
        });
}

        // Course analytics
        const progressList = await CourseProgress.find({ courseId: { $in: courseIds } });
        const quizProgressList = await QuizProgress.find({ courseId: { $in: courseIds }, passed: true });

        const courseStats = courses.map(course => {
            const totalLectures = course.courseContent?.reduce((sum, ch) =>
                sum + (ch.chapterContent?.length || 0), 0) || 0;
            const quizChapters = course.courseContent?.filter(ch => ch.quiz && ch.quiz.length > 0) || [];
            const totalQuizChapters = quizChapters.length;

            const enrolledCount = course.enrolledStudents?.length || 0;
            const courseProgress = progressList.filter(p => String(p.courseId) === String(course._id));
            const completedCount = courseProgress.filter(p =>
                totalLectures > 0 && (p.lectureCompleted?.length || 0) >= totalLectures
            ).length;

            // Quiz pass: user must pass all quiz chapters
            let quizPassedCount = 0;
            if (totalQuizChapters > 0) {
                const passedForCourse = quizProgressList.filter(p => String(p.courseId) === String(course._id));
                const passedMap = new Map();
                passedForCourse.forEach(p => {
                    const key = String(p.userId);
                    if (!passedMap.has(key)) passedMap.set(key, new Set());
                    passedMap.get(key).add(String(p.chapterId));
                });
                passedMap.forEach(set => {
                    if (set.size >= totalQuizChapters) quizPassedCount += 1;
                });
            }

            const completionRate = enrolledCount > 0 ? Math.round((completedCount / enrolledCount) * 100) : 0;
            const quizPassRate = enrolledCount > 0 && totalQuizChapters > 0
                ? Math.round((quizPassedCount / enrolledCount) * 100)
                : 0;

            return {
                courseId: course._id,
                courseTitle: course.courseTitle,
                enrolledCount,
                totalLectures,
                totalQuizChapters,
                completionRate,
                quizPassRate,
            };
        });

res.json({success: true, dashboardData:{totalEarnings,enrolledStudentData,totalCourses, courseStats}}); }
    catch(error){
        res.json({success: false, message: error.message});
    }   
}
//export more educator related controllers here
export const getEnrolledStudentsData = async (req, res) => {
    try{
        const educator = req.auth().userId;
        const courses = await Course.find({educator});
        const courseIds = courses.map((course) => course._id);

        const purchases= await Purchase.find({courseId: {$in: courseIds}, status: 'completed'
        }).populate('userId','name imageUrl').populate('courseId','courseTitle');

        const enrolledStudents= purchases.map((purchase) => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt,
        })) 
        res.json({success: true, enrolledStudents});
    }catch(error){
        res.json({success: false, message: error.message});
    }   
}

// upload lecture video (optional)
export const uploadLectureVideo = async (req, res) => {
    try {
        const videoFile = req.file;
        if (!videoFile) {
            return res.json({ success: false, message: "Lecture video not attached" });
        }
        const uploadResult = await cloudinary.uploader.upload(videoFile.path, { resource_type: 'video' });
        res.json({ success: true, url: uploadResult.secure_url });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
