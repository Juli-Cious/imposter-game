/**
 * Google AI Service for Professor Gaia - AI Mentor
 * Uses Google Generative AI (Gemini) for context-aware, conversational assistance
 */

// Fallback key provided for Vercel deployment where env cannot be configured by user
const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || 'AIzaSyD3sFTS8gINLxm5KtJXJnPPbVkXQ5pLMiU';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

interface HintRequest {
    challengeId: string;
    challengeDescription: string;
    currentCode: string;
    difficulty: 'gentle' | 'specific' | 'solution';
}

interface HintResponse {
    hint: string;
    success: boolean;
    error?: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'mentor';
    content: string;
    timestamp: number;
}

interface ChatRequest {
    message: string;
    challengeId?: string;
    challengeDescription?: string;
    currentCode?: string;
    conversationHistory?: ChatMessage[];
}

interface ChatResponse {
    message: string;
    success: boolean;
    error?: string;
}

/**
 * Get a coding hint from Google AI
 */
export async function getHint(request: HintRequest): Promise<HintResponse> {
    if (!API_KEY) {
        return {
            success: false,
            hint: '',
            error: 'API key not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file.'
        };
    }

    try {
        const prompt = buildPrompt(request);

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 500,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const hint = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate hint.';

        return {
            success: true,
            hint: hint.trim()
        };
    } catch (error) {
        console.error('Error getting hint:', error);
        return {
            success: false,
            hint: '',
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Chat with Professor Gaia (conversational AI mentor)
 */
export async function chatWithMentor(request: ChatRequest): Promise<ChatResponse> {
    if (!API_KEY) {
        return {
            success: false,
            message: '',
            error: 'Professor Gaia is currently unavailable (API key not configured).'
        };
    }

    try {
        const prompt = buildChatPrompt(request);

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.8,
                    maxOutputTokens: 400,
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Chat request failed: ${response.status}`);
        }

        const data = await response.json();
        const message = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I\'m having trouble responding right now. Try again!';

        return {
            success: true,
            message: message.trim()
        };
    } catch (error) {
        console.error('Error in mentor chat:', error);
        return {
            success: false,
            message: '',
            error: error instanceof Error ? error.message : 'Professor Gaia encountered an error'
        };
    }
}

/**
 * Build conversational prompt for Professor Gaia
 */
function buildChatPrompt(request: ChatRequest): string {
    const { message, challengeDescription, currentCode, conversationHistory } = request;

    let prompt = `You are Professor Gaia, an AI mentor in a coding game for children (ages 8-14). 
You are the Ancient Guardian of Earth who helps young heroes learn coding to save the planet.

Your personality:
- Warm, encouraging, and patient like a beloved teacher
- Enthusiastic about the environment and coding
- Uses simple, child-friendly language
- Includes emojis to make conversations fun
- Always connects coding to environmental impact
- Celebrates small wins and encourages learning from mistakes

`;

    // Add context if available
    if (challengeDescription) {
        prompt += `\nCurrent Challenge: ${challengeDescription}`;
    }
    if (currentCode) {
        prompt += `\n\nStudent's code:\n\`\`\`\n${currentCode}\n\`\`\``;
    }

    // Add conversation history for context
    if (conversationHistory && conversationHistory.length > 0) {
        prompt += `\n\nPrevious conversation:`;
        conversationHistory.slice(-4).forEach(msg => {
            const speaker = msg.role === 'user' ? 'Student' : 'You (Professor Gaia)';
            prompt += `\n${speaker}: ${msg.content}`;
        });
    }

    prompt += `\n\nStudent's question: ${message}\n\nYour response (as Professor Gaia, keep it under 3 sentences, use emojis):`;

    return prompt;
}

/**
 * Build the AI prompt based on difficulty level
 */
function buildPrompt(request: HintRequest): string {
    const { challengeDescription, currentCode, difficulty } = request;

    const baseContext = `You are Professor Gaia, the friendly AI mentor helping a young hero (age 8-14) save Earth through coding.

Challenge: ${challengeDescription}
Current code:
\`\`\`
${currentCode}
\`\`\`
`;

    switch (difficulty) {
        case 'gentle':
            return `${baseContext}

Give a gentle hint that guides the child toward the solution without giving away the answer. 
- Use encouraging, friendly language with Professor Gaia's warm personality
- Ask guiding questions
- Point out what they might be missing
- Keep it under 2-3 sentences
- Use emojis to make it fun
- Remember you're Professor Gaia, Earth's Guardian

Hint:`;

        case 'specific':
            return `${baseContext}

The child has tried but still needs help. Give a more specific hint:
- Explain what specific code they need to add
- Give an example of the syntax (but not the complete solution)
- Explain how this code helps solve the environmental problem
- Keep it simple and encouraging
- Use emojis
- Speak as Professor Gaia

Hint:`;

        case 'solution':
            return `${baseContext}

The child has struggled and needs to see a solution. As Professor Gaia, provide:
- Complete working code
- Line-by-line explanation of what each part does
- Explain how this helps save Earth
- Encourage them to try modifying it
- Use simple, warm language
- Celebrate their persistence

Solution:`;

        default:
            return baseContext;
    }
}

/**
 * Rate limiting helper - prevents too many hint requests
 */
class HintRateLimiter {
    private lastRequestTime = 0;
    private readonly COOLDOWN_MS = 5000; // 5 seconds between hints

    canRequest(): boolean {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        return timeSinceLastRequest >= this.COOLDOWN_MS;
    }

    getTimeRemaining(): number {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const remaining = this.COOLDOWN_MS - timeSinceLastRequest;
        return Math.max(0, Math.ceil(remaining / 1000));
    }

    recordRequest(): void {
        this.lastRequestTime = Date.now();
    }
}

export const hintRateLimiter = new HintRateLimiter();
