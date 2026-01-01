import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "./logger";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are an AI Nepal Travel Assistant for Eraya Wellness Travels.
You help users with trekking routes, tour destinations, permits, best seasons,
difficulty levels, costs, and custom trip planning in Nepal.
Keep responses friendly, concise, and informative (2-3 short paragraphs max).
Ask follow-up questions when helpful.
Suggest specific treks or tours naturally based on user intent.`;

/**
 * Call Google Gemini Chat Completion API
 * @param userMessage - The user's message
 * @returns AI-generated response
 */
export async function getChatCompletion(userMessage: string): Promise<string> {
    if (!GEMINI_API_KEY) {
        logger.error("Gemini API key not configured");
        throw new Error("AI service not properly configured. Please contact support.");
    }

    try {
        logger.info("Calling Gemini API", {
            model: GEMINI_MODEL,
        });

        // Initialize Gemini API
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

        // Create prompt with system context and user message
        const prompt = `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = result.response;
        const aiMessage = response.text();

        if (!aiMessage) {
            logger.error("No content in Gemini response");
            throw new Error("Received empty response from AI service.");
        }

        logger.info("Gemini API call successful", {
            responseLength: aiMessage.length,
        });

        return aiMessage;
    } catch (error) {
        if (error instanceof Error && error.message.includes("AI service")) {
            // Re-throw our custom error messages
            throw error;
        }

        logger.error("Unexpected error in Gemini service", {
            error: error instanceof Error ? error.message : String(error),
        });
        throw new Error("Failed to communicate with AI service. Please try again.");
    }
}
