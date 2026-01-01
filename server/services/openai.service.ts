import logger from "./logger";

interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}

interface OpenAIResponse {
    choices: Array<{
        message: {
            content: string;
        };
    }>;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are an AI Nepal Travel Assistant for Eraya Wellness Travels.
You help users with trekking routes, tour destinations, permits, best seasons,
difficulty levels, costs, and custom trip planning in Nepal.
Keep responses friendly, concise, and informative (2-3 short paragraphs max).
Ask follow-up questions when helpful.
Suggest specific treks or tours naturally based on user intent.`;

/**
 * Call OpenAI Chat Completion API
 * @param userMessage - The user's message
 * @param conversationHistory - Optional previous messages for context
 * @returns AI-generated response
 */
export async function getChatCompletion(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
): Promise<string> {
    if (!OPENAI_API_KEY) {
        logger.error("OpenAI API key not configured");
        throw new Error("AI service not properly configured. Please contact support.");
    }

    // Build messages array with system prompt, conversation history, and new message
    const messages: ChatMessage[] = [
        { role: "system", content: SYSTEM_PROMPT },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: "user", content: userMessage },
    ];

    try {
        logger.info("Calling OpenAI API", {
            model: OPENAI_MODEL,
            messageCount: messages.length,
        });

        const response = await fetch(OPENAI_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            logger.error("OpenAI API error", {
                status: response.status,
                statusText: response.statusText,
                error: errorData,
            });

            if (response.status === 401) {
                throw new Error("AI service authentication failed. Please contact support.");
            } else if (response.status === 429) {
                throw new Error("AI service is currently busy. Please try again in a moment.");
            } else {
                throw new Error("AI service temporarily unavailable. Please try again later.");
            }
        }

        const data: OpenAIResponse = await response.json();
        const aiMessage = data.choices?.[0]?.message?.content;

        if (!aiMessage) {
            logger.error("No content in OpenAI response", { data });
            throw new Error("Received empty response from AI service.");
        }

        logger.info("OpenAI API call successful", {
            responseLength: aiMessage.length,
        });

        return aiMessage;
    } catch (error) {
        if (error instanceof Error && error.message.includes("AI service")) {
            // Re-throw our custom error messages
            throw error;
        }

        logger.error("Unexpected error in OpenAI service", {
            error: error instanceof Error ? error.message : String(error),
        });
        throw new Error("Failed to communicate with AI service. Please try again.");
    }
}
