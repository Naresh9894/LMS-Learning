import express from 'express'
import Groq from 'groq-sdk'
import Course from '../models/course.js'
import Purchase from '../models/Purchase.js'
import { CourseProgress } from '../models/CourseProgress.js'

const router = express.Router()

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// In-memory conversation storage
const conversationHistory = new Map()

// ================= USER CONTEXT =================
const getUserContext = async (userId) => {
  if (!userId) return null

  try {
    const enrollments = await Purchase.find({ buyer: userId })
      .populate('course')
      .limit(5)

    const progress = await CourseProgress.find({ userId }).limit(5)

    return {
      enrolledCourses: enrollments.map(e => e.course?.title).filter(Boolean),
      progressCount: progress.length
    }
  } catch (error) {
    console.error('Error getting user context:', error)
    return null
  }
}

// ================= SYSTEM PROMPT =================
const getSystemPrompt = (userContext) => {
  let prompt = `
You are an expert MERN stack instructor.

IMPORTANT:
MERN strictly means:
- MongoDB
- Express.js
- React
- Node.js

Do NOT mention Angular.
Do NOT confuse MERN with MVC.
Do NOT guess.

When explaining concepts:
- Give full detailed explanations
- Use headings
- Use bullet points
- Explain how components connect together
- Provide real-world example
- Minimum 400 words when user asks for explanation
`

  if (userContext) {
    prompt += `

User Context:
- Enrolled Courses: ${userContext.enrolledCourses.join(', ') || 'None'}
- Progress Count: ${userContext.progressCount}
`
  }

  return prompt
}

// ================= CHAT ROUTE =================
router.post('/chat', async (req, res) => {
  try {
    const { message, userId, conversationId } = req.body

    if (!message || message.trim() === '') {
      return res.json({
        response: "Hey 👋 Ask me anything about coding or your courses!",
        conversationId: null
      })
    }

    const convId = conversationId || `conv_${Date.now()}`
    let history = conversationHistory.get(convId) || []

    const userContext = userId ? await getUserContext(userId) : null

    // Build messages array with system prompt + conversation history + new message
    const messages = [
      { role: 'system', content: getSystemPrompt(userContext) },
      ...history,
      { role: 'user', content: message }
    ]

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.2,
      max_tokens: 1024,
    })

    const aiResponse = chatCompletion.choices[0]?.message?.content || "I couldn't generate a response."

    // Save conversation (limit last 20 messages)
    history.push({ role: 'user', content: message })
    history.push({ role: 'assistant', content: aiResponse })

    if (history.length > 20) {
      history = history.slice(-20)
    }

    conversationHistory.set(convId, history)

    res.json({
      response: aiResponse,
      conversationId: convId,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chatbot Error:', error?.response?.data || error.message)

    res.status(500).json({
      response: "I'm having trouble right now 😕 Please try again.",
      timestamp: new Date().toISOString()
    })
  }
})

// ================= CLEAR CHAT =================
router.post('/clear', (req, res) => {
  const { conversationId } = req.body

  if (conversationId && conversationHistory.has(conversationId)) {
    conversationHistory.delete(conversationId)
    return res.json({ message: 'Conversation cleared' })
  }

  res.json({ message: 'No conversation found' })
})

export default router