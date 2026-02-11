import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("VITE_GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

export interface ChatMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

export const getChatResponse = async (history: ChatMessage[], message: string): Promise<string> => {
    try {
        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error getting chat response:", error);
        throw error;
    }
};

export const getHint = async (context: string): Promise<string> => {
    try {
        const prompt = `You are a helpful AI assistant in an 'Imposter' game. 
    The user is asking for a hint based on the following context: ${context}. 
    Provide a subtle hint without revealing the imposter directly.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error getting hint:", error);
        throw error;
    }
};

export const explainConcept = async (concept: string, language: string): Promise<string> => {
    try {
        const prompt = `You are a helpful Computer Science teacher. 
    Explain the concept of '${concept}' in ${language} to a beginner. 
    Provide a short definition and a simple code example. 
    Keep it concise.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error explaining concept:", error);
        throw error;
    }
};
