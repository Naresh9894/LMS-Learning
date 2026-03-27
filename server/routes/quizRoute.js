import express from 'express';
import { submitQuiz, getQuizProgress, checkAllQuizzesPassed } from '../controllers/quizController.js';

const quizRouter = express.Router();

quizRouter.post('/submit',       submitQuiz);
quizRouter.post('/progress',     getQuizProgress);
quizRouter.post('/check-all',    checkAllQuizzesPassed);

export default quizRouter;