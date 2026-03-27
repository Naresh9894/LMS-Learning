import mongoose from "mongoose";

const quizProgressSchema = new mongoose.Schema({
    userId:    { type: String, required: true },
    courseId:  { type: String, required: true },
    chapterId: { type: String, required: true },
    passed:    { type: Boolean, default: false },
    score:     { type: Number, default: 0 },      // percentage 0-100
    attempts:  { type: Number, default: 0 },
    completedAt: { type: Date },
}, { timestamps: true });

// compound index — one record per user per chapter
quizProgressSchema.index({ userId: 1, courseId: 1, chapterId: 1 }, { unique: true });

export const QuizProgress = mongoose.model('QuizProgress', quizProgressSchema);