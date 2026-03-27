import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureId:       { type: String,  required: true },
    lectureTitle:    { type: String,  required: true },
    lectureDuration: { type: Number,  required: true },
    lectureUrl:      { type: String,  required: true },
    lectureSource:   { type: String,  enum: ['link', 'upload'], default: 'link' },
    isPreviewFree:   { type: Boolean, default: false },
    lectureOrder:    { type: Number,  required: true },
}, { _id: false });

// ✅ NEW — quiz question schema
const quizQuestionSchema = new mongoose.Schema({
    questionId:     { type: String, required: true },
    question:       { type: String, required: true },
    options:        [{ type: String, required: true }], // array of 4 options
    correctAnswer:  { type: Number, required: true },   // index 0-3 of correct option
}, { _id: false });

const chapterSchema = new mongoose.Schema({
    chapterId:      { type: String, required: true },
    chapterOrder:   { type: Number, required: true },
    chapterTitle:   { type: String, required: true },
    chapterContent: [lectureSchema],
    quiz:           [quizQuestionSchema],               // ✅ NEW — quiz per chapter
}, { _id: false });

const courseSchema = new mongoose.Schema({
    courseTitle:       { type: String,  required: true },
    courseDescription: { type: String,  required: true },
    courseThumbnail:   { type: String },
    coursePrice:       { type: Number,  required: true },
    isPublished:       { type: Boolean, default: true },
    discount:          { type: Number,  required: true, min: 0, max: 100 },

    category: {
        type: String,
        default: 'Select Category',
        enum: [
            'Select Category','Technology', 'Web Development', 'AI & Machine Learning','Programming Languages',
            'Design', 'Photography', 'Travel', 'Business',
            'Music', 'Health & Fitness', 'Language', 'Finance', 'Marketing',
        ],
    },

    courseContent:    [chapterSchema],
    ratings:          [{ userId: { type: String }, rating: { type: Number, min: 1, max: 5 } }],
    educator:         { type: String, ref: 'User', required: true },
    enrolledStudents: [{ type: String, ref: 'User' }],

}, { timestamps: true, minimize: false });

const Course = mongoose.model('Course', courseSchema);
export default Course;
