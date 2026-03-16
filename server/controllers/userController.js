import mongoose from "mongoose";
import User from "../models/user.js";
import Stripe from "stripe";
import Course from "../models/course.js";
import Purchase from "../models/Purchase.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { clerkClient } from "@clerk/express";

// ── Helper: get or auto-create user if webhook missed them ────────────────────
const getOrCreateUser = async (userId) => {
    let user = await User.findById(userId);
    if (!user) {
        // Webhook didn't fire — fetch from Clerk and create manually
        const clerkUser = await clerkClient.users.getUser(userId);
        user = await User.create({
            _id: userId,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            imageUrl: clerkUser.imageUrl || '',
            enrolledCourses: [],
        });
    }
    return user;
}

export const getUserData = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const user = await getOrCreateUser(userId);  // ✅ auto-create if missing
        res.json({ success: true, user });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Users enrolled courses with lecture links
export const userEnrollledCourses = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const userData = await User.findById(userId).populate('enrolledCourses')

        if (!userData) {
            return res.json({ success: true, enrolledCourses: [] });
        }

        res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Purchase course
export const purchaseCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const { origin } = req.headers;
        const userId = req.auth().userId;

        const userData = await getOrCreateUser(userId);  // ✅ auto-create if missing
        const courseData = await Course.findById(courseId);

        if (!courseData) {
            return res.json({ success: false, message: "Course not found" });
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData);

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLowerCase();

        const line_items = [{
            price_data: {
                currency,
                product_data: { name: courseData.courseTitle },
                unit_amount: Math.floor(newPurchase.amount) * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items,
            mode: 'payment',
            metadata: {
                purchaseId: newPurchase._id.toString(),
                userId: userId.toString(),
                courseId: courseData._id.toString(),
            }
        })

        res.json({ success: true, session_url: session.url })
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update user course progress
export const updatUsereCourseProgress = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { courseId, lectureId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });

        if (progressData) {
            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: "Lecture already Completed" })
            }
            progressData.lectureCompleted.push(lectureId);
            await progressData.save();
        } else {
            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId],
            });
        }
        res.json({ success: true, message: "Course progress updated successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get user course progress
export const getUserCourseProgress = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { courseId } = req.body;
        const progressData = await CourseProgress.findOne({ userId, courseId });
        res.json({ success: true, progressData });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// User rating for course
export const addUserRating = async (req, res) => {
    const userId = req.auth().userId;
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: "Invalid Details" });
    }

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return res.json({ success: false, message: "Course not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        const isEnrolled = user.enrolledCourses?.some((id) => id.toString() === courseId);
        if (!isEnrolled) {
            return res.json({ success: false, message: "User not enrolled in the course" });
        }

        const existingRating = course.ratings.findIndex((r) => r.userId === userId);
        if (existingRating > -1) {
            course.ratings[existingRating].rating = rating;
        } else {
            course.ratings.push({ userId, rating });
        }

        await course.save();
        return res.json({ success: true, message: "Rating added successfully" });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}