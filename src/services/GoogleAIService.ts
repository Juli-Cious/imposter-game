/**
 * Google AI Service for generating coding hints
 * Uses Google Generative AI (Gemini) for context-aware assistance
 */

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;
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
 * Build the AI prompt based on difficulty level
 */
function buildPrompt(request: HintRequest): string {
    const { challengeId, challengeDescription, currentCode, difficulty } = request;

    const baseContext = `You are a friendly coding teacher helping a child (age 8-14) learn programming through an environmental game.

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
- Use encouraging, friendly language
- Ask guiding questions
- Point out what they might be missing
- Keep it under 2-3 sentences
- Use emojis to make it fun

Hint:`;

        case 'specific':
            return `${baseContext}

The child has tried but still needs help. Give a more specific hint:
- Explain what specific code they need to add
- Give an example of the syntax (but not the complete solution)
- Explain why this code helps solve the environmental problem
- Keep it simple and encouraging
- Use emojis

Hint:`;

        case 'solution':
            return `${baseContext}

The child has struggled and needs to see a solution. Provide:
- Complete working code
- Line-by-line explanation of what each part does
- Explain how this helps the environment
- Encourage them to try modifying it
- Use simple language a child can understand

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
