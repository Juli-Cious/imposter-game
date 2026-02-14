/**
 * Google AI Service for Professor Gaia - AI Mentor
 * Uses Google Generative AI (Gemini) for context-aware, conversational assistance
 */

// Debug helper for API key troubleshooting


const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;

// Model fallback priorities for different AI features

// Chaos Engine & Green Code Analyzer: Prioritize intelligence (27B first)
const CHAOS_ENGINE_MODELS = [
    'gemma-3-27b-it',  // Most capable for complex bug generation
    'gemma-3-12b-it',  // Good balance
    'gemma-3-4b-it',   // Faster
    'gemma-3-2b-it'    // Fastest/Fallback
];

// Professor Gaia: Prioritize speed (12B first for faster hints)
const PROFESSOR_GAIA_MODELS = [
    'gemma-3-12b-it',  // Faster responses for real-time hints
    'gemma-3-4b-it',   // Even faster
    'gemma-3-2b-it'    // Fastest/Fallback
];

// Green Code Analyzer: Prioritize moderate models for speed
const GREEN_CODE_MODELS = [
    'gemma-3-12b-it',  // Good balance of logic and speed
    'gemma-3-4b-it',   // Fast
    'gemma-3-27b-it',  // Highly accurate but slower (fallback)
    'gemma-3-2b-it'    // Fastest
];

const API_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

interface GenerationConfig {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
}

interface GeminiPart {
    text: string;
}

interface GeminiContent {
    parts: GeminiPart[];
}

interface GeminiCandidate {
    content: GeminiContent;
}

interface GeminiResponse {
    candidates?: GeminiCandidate[];
}

/**
 * Generic API call with custom model priority list
 * Attempts models in order until one succeeds
 */
async function callGemmaWithModelList(prompt: string, config: GenerationConfig, modelList: string[]): Promise<GeminiResponse> {
    let lastError: Error | null = null;

    for (const model of modelList) {
        try {
            const url = `${API_BASE_URL}/${model}:generateContent?key=${API_KEY}`;

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: config
                })
            });

            if (response.ok) {
                const data = await response.json();
                // console.log(`✅ Success using model: ${model}`);
                return data;
            }

            // Model not available or other error, try next
            console.warn(`⚠️ Model ${model} failed (${response.status}), trying next...`);
            lastError = new Error(`Model ${model}: ${response.status}`);

        } catch (error) {
            console.warn(`⚠️ Model ${model} error:`, error);
            lastError = error instanceof Error ? error : new Error(String(error));
            continue;
        }
    }

    // All models failed
    throw lastError || new Error('All models failed');
}

/**
 * Chaos Engine fallback (27B → 12B → 4B → 2B)
 */
async function callChaosEngine(prompt: string, config: GenerationConfig): Promise<GeminiResponse> {
    return callGemmaWithModelList(prompt, config, CHAOS_ENGINE_MODELS);
}

/**
 * Professor Gaia fallback (12B → 4B → 2B)
 */
async function callProfessorGaia(prompt: string, config: GenerationConfig): Promise<GeminiResponse> {
    return callGemmaWithModelList(prompt, config, PROFESSOR_GAIA_MODELS);
}

// Enhanced debugging for API key issues
if (!API_KEY) {
    console.error('🚨 GEMINI API KEY NOT FOUND 🚨');
    console.error('Environment variable VITE_GOOGLE_AI_API_KEY is not set.');
    console.error('\n📋 Debugging Checklist:');
    console.error('1. Local Development:');
    console.error('   - Create a .env file in the project root');
    console.error('   - Add: VITE_GOOGLE_AI_API_KEY=your_api_key_here');
    console.error('   - Restart the dev server');
    console.error('\n2. Vercel Deployment:');
    console.error('   - Go to Vercel Dashboard → Project → Settings → Environment Variables');
    console.error('   - Variable name must be EXACTLY: VITE_GOOGLE_AI_API_KEY (case-sensitive)');
    console.error('   - Enable for: Production, Preview, and Development');
    console.error('   - CRITICAL: After adding the variable, REDEPLOY the project!');
    console.error('\n3. Current Environment Info:');
    console.error('   - Mode:', import.meta.env.MODE);
    console.error('   - Base URL:', import.meta.env.BASE_URL);
    console.error('   - Available env vars starting with VITE_:',
        Object.keys(import.meta.env).filter(key => key.startsWith('VITE_'))
    );
} else {
    // console.log('✅ Gemini API Key loaded successfully');
    // console.log('🔑 Key preview:', API_KEY.substring(0, 10) + '...' + API_KEY.substring(API_KEY.length - 4));
}

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
        console.error('❌ getHint() called but API key is missing');
        return {
            success: false,
            hint: '',
            error: '🔧 Gemini API not configured. Check browser console for setup instructions. If deployed on Vercel, ensure environment variables are set and the project is redeployed.'
        };
    }

    try {
        const prompt = buildPrompt(request);

        const data = await callProfessorGaia(prompt, {
            temperature: 0.7,
            maxOutputTokens: 500,
        });
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
        console.error('❌ chatWithMentor() called but API key is missing');
        return {
            success: false,
            message: '',
            error: '🌍 Professor Gaia is currently unavailable (API key not configured). Check browser console for debugging steps. If on Vercel: Settings → Environment Variables → Add VITE_GOOGLE_AI_API_KEY → Redeploy.'
        };
    }

    try {
        const prompt = buildChatPrompt(request);

        const data = await callProfessorGaia(prompt, {
            temperature: 0.8,
            maxOutputTokens: 400,
        });
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

// --- Error Explanation Types ---

interface ErrorExplanationRequest {
    code: string;
    error: string;
    challengeDescription?: string;
    language?: string;
}

interface ErrorExplanationResponse {
    explanation: string;
    success: boolean;
    fixSuggestion?: string;
    error?: string;
}

/**
 * Explain a coding error using Professor Gaia's persona
 */
export async function explainError(request: ErrorExplanationRequest): Promise<ErrorExplanationResponse> {
    if (!API_KEY) {
        console.error('❌ explainError() called but API key is missing');
        return {
            success: false,
            explanation: '',
            error: '🔧 Error explanation unavailable (API key not configured). See console for setup guide.'
        };
    }

    try {
        const prompt = buildErrorPrompt(request);

        const data = await callProfessorGaia(prompt, {
            temperature: 0.6, // Lower temperature for more precise error explanations
            maxOutputTokens: 300,
        });
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I couldn\'t quite understand that error.';

        // Simple parsing if the AI returns JSON-like format or just text
        // For now we assume the AI follows the prompt to be conversational

        return {
            success: true,
            explanation: text.trim()
        };
    } catch (error) {
        console.error('Error explaining code:', error);
        return {
            success: false,
            explanation: '',
            error: error instanceof Error ? error.message : 'Professor Gaia encountered an error'
        };
    }
}

function buildErrorPrompt(request: ErrorExplanationRequest): string {
    const { code, error, challengeDescription, language } = request;
    return `You are Professor Gaia, the friendly AI mentor for a children's coding game.
    
The student has encountered an error in their ${language || 'code'}.
    
Context:
- Challenge: ${challengeDescription || 'Unknown'}
- Code:
\`\`\`
${code}
\`\`\`
- Error Message: "${error}"

Your task:
1. Explain what this error means in simple, child-friendly terms (metaphors are great!).
2. Don't simply give the answer, but point them to the specific line or concept that is broken.
3. Be encouraging! Errors are part of learning.
4. Keep it short (max 2-3 sentences).
5. Use emojis.
6. Return ONLY the explanation message.`;
}

// --- Dynamic Sabotage Generation ---

interface SabotageRequest {
    baseCode: string;
    level: 'easy' | 'medium' | 'hard';
    concept: string; // e.g. "loops", "variables", "syntax"
}

interface SabotageResponse {
    code: string;
    sabotageType: string;
    fixInstructions: string;
    success: boolean;
    error?: string;
}

/**
 * Generates a "sabotaged" version of code for the Imposter to plant
 */
export async function generateSabotage(request: SabotageRequest): Promise<SabotageResponse> {
    if (!API_KEY) {
        return {
            success: false,
            code: request.baseCode, // Fallback to original
            sabotageType: 'Network Error',
            fixInstructions: 'Check API Key',
            error: 'API Key missing'
        };
    }

    try {
        const prompt = `You are the "glitch" in the system. 
        Take this working code and introduce a subtle bug (sabotage) based on the concept: "${request.concept}".
        Difficulty: ${request.level}.

        Working Code:
        \`\`\`
        ${request.baseCode}
        \`\`\`

        Return a JSON object with this structure:
        {
            "sabotagedCode": "The full code with the bug inserted",
            "sabotageType": "Short name of the bug (e.g. Infinite Loop)",
            "fixInstructions": "One sentence hint on how to fix it"
        }
        
        Ensure the sabotaged code is syntactically valid enough to "run" but fail logic or loop forever, unless the concept is "syntax error".`;

        const data = await callChaosEngine(prompt, {
            temperature: 0.9,
            maxOutputTokens: 1000
        });
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        // Clean markdown code blocks if present to get pure JSON
        if (!text) throw new Error('No content generated');
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonText);

        return {
            success: true,
            code: result.sabotagedCode,
            sabotageType: result.sabotageType,
            fixInstructions: result.fixInstructions
        };

    } catch (error) {
        console.error('Error generating sabotage:', error);
        return {
            success: false,
            code: request.baseCode,
            sabotageType: 'Generation Failed',
            fixInstructions: 'Use standard manual sabotage',
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

// --- AI Code Review ---

interface ReviewRequest {
    code: string;
    originalChallenge: string;
    timeTaken?: number;
}

interface ReviewResponse {
    rating: number; // 1-5
    feedback: string; // Encouraging feedback
    tip: string; // Optimization tip
    success: boolean;
}

/**
 * Reviews a student's solution after they submit
 */
export async function reviewCode(request: ReviewRequest): Promise<ReviewResponse> {
    if (!API_KEY) return { success: false, rating: 0, feedback: '', tip: '' };

    try {
        const prompt = `You are Professor Gaia. A student just solved this challenge: "${request.originalChallenge}".
        
        Their Code:
        \`\`\`
        ${request.code}
        \`\`\`

        Provide a JSON review:
        {
            "rating": (integer 1-5 based on efficiency and cleanliness),
            "feedback": "Encouraging remark exploring what they did well (warm tone)",
            "tip": "One cool coding tip to make it even better next time"
        }`;

        const data = await callProfessorGaia(prompt, {
            temperature: 0.7
        });
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('No content generated');
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const result = JSON.parse(jsonText);

        return {
            success: true,
            rating: result.rating,
            feedback: result.feedback,
            tip: result.tip
        };

    } catch (e) {
        return { success: false, rating: 0, feedback: 'Great job!', tip: '' };
    }
}

// --- Dynamic Level Generation (Chaos Engine) ---

import type {
    DynamicLevelRequest,
    DynamicLevelResponse,
    DynamicLevel,
    GreenCoderRequest,
    GreenCoderResponse,
} from '../types/ai-levels';

/**
 * Generate a complete coding challenge dynamically using AI
 * This enables infinite unique levels aligned with SDG themes
 */
export async function generateDynamicLevel(request: DynamicLevelRequest): Promise<DynamicLevelResponse> {
    if (!API_KEY) {
        console.error('❌ generateDynamicLevel() called but API key is missing');
        return {
            success: false,
            error: '🎮 Cannot generate dynamic levels (API key not configured). Check console for setup instructions.'
        };
    }

    try {
        const prompt = buildChaosEnginePrompt(request);

        const data = await callChaosEngine(prompt, {
            temperature: 0.9, // Higher creativity for varied levels
            maxOutputTokens: 1500
        });
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('No response from AI');
        }

        // Clean markdown code blocks and parse JSON
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const level: DynamicLevel = JSON.parse(jsonText);

        // Validate required fields
        if (!level.level_id || !level.title || !level.initial_code || !level.solution_code) {
            throw new Error('Invalid level structure from AI');
        }

        // console.log(`[AI] Generated dynamic level: ${level.title} (${level.bug_type})`);

        return {
            success: true,
            level
        };

    } catch (error) {
        console.error('Error generating dynamic level:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Build the "Chaos Engine" system prompt for level generation
 */
function buildChaosEnginePrompt(request: DynamicLevelRequest): string {
    const { difficulty, language, theme } = request;

    return `ROLE:
You are the "Chaos Engine," a game level generator for a coding puzzle game about saving the planet. Your goal is to generate coding challenges that contain ONE specific, solvable logic or syntax error.

INPUT PARAMETERS:
1. Difficulty: ${difficulty}
2. Language: ${language}
3. Theme: ${theme}

INSTRUCTIONS:
1. Scenario Generation: Create a short, urgent scenario based on the Theme (e.g., "The solar panel alignment algorithm is stuck!").
2. Code Generation: Write a function that *should* solve the scenario but contains a specific bug based on the Difficulty:
   - Easy: Syntax error, typo, or wrong operator (e.g., + instead of -).
   - Medium: Logic error (infinite loop, off-by-one, wrong conditional).
   - Hard: Performance issue (O(n^2) nested loops), memory leak, or edge case failure.
3. Solvability: The bug must be fixable by changing 1-3 lines of code.
4. Output Format: You must output ONLY valid JSON. Do not output markdown code blocks.

JSON STRUCTURE:
{
  "level_id": "unique_string",
  "title": "Short Mission Title",
  "description": "The narrative description of the problem.",
  "language": "${language}",
  "initial_code": "The buggy code string (escape newlines)",
  "solution_code": "The correct code string",
  "bug_type": "syntax | logic | performance",
  "hint": "A subtle clue for the player.",
  "sdg_impact": "Text explaining how fixing this specific code helps the SDG (e.g., 'Optimizing this loop saves 500kW of server power')."
}

Generate the level now:`;
}

/**
 * Analyze code efficiency and calculate Green Coder Score
 * Provides Big-O analysis and environmental impact metrics
 */
export async function analyzeGreenCode(request: GreenCoderRequest): Promise<GreenCoderResponse> {
    if (!API_KEY) {
        console.error('❌ analyzeGreenCode() called but API key is missing');
        return {
            success: false,
            error: '🌱 Green Coder analysis unavailable (API key not configured). Check console for help.'
        };
    }

    try {
        const prompt = buildGreenCoderPrompt(request);

        const data = await callGemmaWithModelList(prompt, {
            temperature: 0.6,
            maxOutputTokens: 600
        }, GREEN_CODE_MODELS);
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error('No response from AI');

        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return { success: true, score: JSON.parse(jsonText) };

    } catch (error) {
        console.error('Error analyzing green code:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

/**
 * Build the Green Coder analysis prompt (Pruned for speed)
 */
function buildGreenCoderPrompt(request: GreenCoderRequest): string {
    const { player_code, solution_code, challenge_description, language } = request;

    return `Analyze code efficiency and environmental impact. 
Return ONLY JSON. No markdown blocks.

Input:
Challenge: ${challenge_description}
Language: ${language}
Optimal: \`${solution_code}\`
Player: \`${player_code}\`

Requirements:
1. Compare Big-O complexity (Time/Space).
2. Calculate Green Score (0-100). (100 = Optimal).
3. Metric: 1 watt-hour = 1 billion extra operations.

JSON Structure:
{
  "green_coder_score": number,
  "player_complexity": "string",
  "optimal_complexity": "string",
  "complexity_comparison": "brief text",
  "energy_impact": {
    "energy_wasted_kwh": number,
    "real_world_equivalent": "short string",
    "sdg_message": "1 sentence"
  },
  "feedback": "encouraging text",
  "optimization_tip": "technical tip",
  "professor_gaia_message": "warm closing"
}

Analyze now:`;
}

