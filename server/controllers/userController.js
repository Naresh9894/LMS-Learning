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

        const amountInInr = (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100);
        const currency = process.env.CURRENCY.toLowerCase();
        const usdInrRate = Number(process.env.USD_INR_RATE || 83);
        const chargeAmount = currency === 'usd' ? (amountInInr / usdInrRate) : amountInInr;

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: chargeAmount.toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData);

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        const line_items = [{
            price_data: {
                currency,
                product_data: { name: courseData.courseTitle },
                unit_amount: Math.round(Number(newPurchase.amount) * 100)
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

// Track course views for recommendations
export const trackCourseView = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const { courseId } = req.body;
        if (!courseId) return res.json({ success: false, message: 'Course ID required' });

        const user = await User.findById(userId);
        if (!user) return res.json({ success: false, message: 'User not found' });

        const idx = user.courseViews?.findIndex(v => String(v.courseId) === String(courseId)) ?? -1;
        if (idx >= 0) {
            user.courseViews[idx].count += 1;
            user.courseViews[idx].lastViewedAt = new Date();
        } else {
            user.courseViews = user.courseViews || [];
            user.courseViews.push({ courseId, count: 1, lastViewedAt: new Date() });
        }

        await user.save();
        res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Personalized recommendations (behavior-based)
export const getRecommendations = async (req, res) => {
    try {
        const userId = req.auth().userId;
        const limit = Math.min(Number(req.query.limit) || 6, 12);

        const user = await User.findById(userId).populate('enrolledCourses');
        const enrolled = user?.enrolledCourses || [];
        const enrolledIds = new Set(enrolled.map(c => c._id.toString()));

        // Build category weights from enrollment + completion behavior + views
        const progressList = await CourseProgress.find({ userId });
        const progressMap = new Map(progressList.map(p => [String(p.courseId), p]));

        const categoryWeights = {};
        enrolled.forEach(course => {
            const totalLectures = course.courseContent?.reduce((sum, ch) =>
                sum + (ch.chapterContent?.length || 0), 0) || 0;
            const completed = progressMap.get(String(course._id))?.lectureCompleted?.length || 0;
            const completionRatio = totalLectures > 0 ? completed / totalLectures : 0;
            const weight = 1 + completionRatio; // base + engagement
            categoryWeights[course.category] = (categoryWeights[course.category] || 0) + weight;
        });

        // Add category weights from course views
        const views = user?.courseViews || [];
        if (views.length > 0) {
            const viewCourseIds = views.map(v => v.courseId);
            const viewedCourses = await Course.find({ _id: { $in: viewCourseIds } });
            const viewMap = new Map(views.map(v => [String(v.courseId), v]));
            viewedCourses.forEach(course => {
                const v = viewMap.get(String(course._id));
                if (!v) return;
                const viewWeight = Math.min(v.count || 1, 5) * 0.3; // cap influence
                categoryWeights[course.category] = (categoryWeights[course.category] || 0) + viewWeight;
            });
        }

        const candidates = await Course.find({ isPublished: true, _id: { $nin: [...enrolledIds] } })
            .populate({ path: 'educator' });

        const scoreCourse = (course) => {
            const ratings = course.ratings || course.courseRatings || [];
            const avgRating = ratings.length === 0 ? 0 : ratings.reduce((s, r) => s + (r.rating || 0), 0) / ratings.length;
            const ratingScore = avgRating / 5; // 0..1
            const popularityScore = Math.log10((course.enrolledStudents?.length || 0) + 1) / 2; // 0..~1
            const ageDays = (Date.now() - new Date(course.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            const recencyScore = Math.max(0, 30 - ageDays) / 30; // 0..1
            const categoryScore = categoryWeights[course.category] || 0;

            return (categoryScore * 3) + (ratingScore * 2) + popularityScore + recencyScore;
        };

        let ranked = candidates
            .map(c => ({ course: c, score: scoreCourse(c) }))
            .sort((a, b) => b.score - a.score)
            .map(x => x.course);

        // Fallback: if no behavior yet, sort by rating + popularity
        if (Object.keys(categoryWeights).length === 0) {
            ranked = candidates.sort((a, b) => {
                const ar = (a.ratings || a.courseRatings || []).reduce((s, r) => s + (r.rating || 0), 0) / Math.max((a.ratings || a.courseRatings || []).length, 1);
                const br = (b.ratings || b.courseRatings || []).reduce((s, r) => s + (r.rating || 0), 0) / Math.max((b.ratings || b.courseRatings || []).length, 1);
                const ap = (a.enrolledStudents?.length || 0);
                const bp = (b.enrolledStudents?.length || 0);
                return (br * 2 + bp) - (ar * 2 + ap);
            });
        }

        res.json({ success: true, courses: ranked.slice(0, limit) });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
