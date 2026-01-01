import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// System prompt for the AI
const SYSTEM_INSTRUCTION = `You are an AI Nepal Travel Assistant.
You help users with trekking routes, tour destinations, permits,
best seasons, difficulty levels, costs, and custom trip planning in Nepal.
Keep responses friendly, concise, and informative.
Ask follow-up questions when useful.`;

// POST /api/chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        // Validate request
        if (!message) {
            return res.status(400).json({
                error: 'Message is required',
                reply: 'Please provide a message to chat.'
            });
        }

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY is not configured');
            return res.status(500).json({
                reply: 'Server configuration error. Please contact support.'
            });
        }

        // Get the Gemini model with system instruction
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // Generate response
        const result = await model.generateContent(message);
        const response = await result.response;
        const aiReply = response.text();

        res.json({ reply: aiReply });

    } catch (error) {
        console.error('Server error:', error);
        console.error('Error details:', error.message);

        // Handle specific Gemini API errors
        if (error.message?.includes('API_KEY_INVALID')) {
            return res.status(500).json({
                reply: 'API key configuration error. Please check your Gemini API key.'
            });
        }

        if (error.status === 404) {
            return res.status(500).json({
                reply: 'Model configuration error. Please contact support.'
            });
        }

        res.status(500).json({
            reply: 'I apologize, but something went wrong. Please try again.'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        ai_provider: 'Google Gemini',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`AI Provider: Google Gemini (gemini-2.5-flash)`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Chat endpoint: http://localhost:${PORT}/api/chat`);
});
