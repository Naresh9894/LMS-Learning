import Course from "../models/course.js";
import { QuizProgress } from "../models/QuizProgress.js";

const PASS_PERCENTAGE = 70; // 70% to pass

// ── Submit Quiz ───────────────────────────────────────────────────────────────
export const submitQuiz = async (req, res) => {
    try {
        const userId   = req.auth.userId;
        const { courseId, chapterId, answers } = req.body;
        // answers = [{ questionId, selectedAnswer }]

        const course = await Course.findById(courseId);
        if (!course) return res.json({ success: false, message: 'Course not found' });

        const chapter = course.courseContent.find(c => c.chapterId === chapterId);
        if (!chapter) return res.json({ success: false, message: 'Chapter not found' });

        if (!chapter.quiz || chapter.quiz.length === 0)
            return res.json({ success: false, message: 'No quiz found for this chapter' });

        // Calculate score
        let correct = 0;
        chapter.quiz.forEach(q => {
            const userAnswer = answers.find(a => a.questionId === q.questionId);
            if (userAnswer && userAnswer.selectedAnswer === q.correctAnswer) {
                correct++;
            }
        });

        const score   = Math.round((correct / chapter.quiz.length) * 100);
        const passed  = score >= PASS_PERCENTAGE;

        // Save or update quiz progress
        const existing = await QuizProgress.findOne({ userId, courseId, chapterId });

        if (existing) {
            existing.score    = Math.max(existing.score, score); // keep best score
            existing.passed   = existing.passed || passed;       // once passed, always passed
            existing.attempts = existing.attempts + 1;
            if (passed && !existing.completedAt) existing.completedAt = new Date();
            await existing.save();
        } else {
            await QuizProgress.create({
                userId, courseId, chapterId,
                score, passed, attempts: 1,
                completedAt: passed ? new Date() : undefined,
            });
        }

        res.json({
            success: true,
            score,
            passed,
            correct,
            total: chapter.quiz.length,
            message: passed
                ? `🎉 You passed with ${score}%!`
                : `You scored ${score}%. You need ${PASS_PERCENTAGE}% to pass. Try again!`
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// ── Get Quiz Progress for a course ───────────────────────────────────────────
export const getQuizProgress = async (req, res) => {
    try {
        const userId  = req.auth.userId;
        const { courseId } = req.body;

        const progress = await QuizProgress.find({ userId, courseId });
        res.json({ success: true, quizProgress: progress });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// ── Check if all quizzes passed for a course ─────────────────────────────────
export const checkAllQuizzesPassed = async (req, res) => {
    try {
        const userId  = req.auth.userId;
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) return res.json({ success: false, message: 'Course not found' });

        // Get chapters that have quizzes
        const chaptersWithQuiz = course.courseContent.filter(
            c => c.quiz && c.quiz.length > 0
        );

        if (chaptersWithQuiz.length === 0) {
            // No quizzes — just check lecture completion
            return res.json({ success: true, allPassed: true, quizProgress: [] });
        }

        const progress = await QuizProgress.find({ userId, courseId, passed: true });
        const passedChapterIds = progress.map(p => p.chapterId);

        const allPassed = chaptersWithQuiz.every(
            c => passedChapterIds.includes(c.chapterId)
        );

        res.json({ success: true, allPassed, quizProgress: progress });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
