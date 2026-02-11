import { generateSabotage, reviewCode } from './GoogleAIService';

interface CachedSabotage {
    challengeId: string;
    sabotagedCode: string;
    fix: string;
    type: string;
    timestamp: number;
}

class AIChallengeService {
    private cache: Map<string, CachedSabotage> = new Map();

    /**
     * Pre-generates sabotage for a level so it's ready when the imposter strikes
     */
    async prepareSabotage(challengeId: string, baseCode: string, concept: string): Promise<void> {
        if (this.cache.has(challengeId)) return;

        console.log(`[AI] Preparing sabotage for ${challengeId}...`);
        const result = await generateSabotage({
            baseCode,
            level: 'medium',
            concept
        });

        if (result.success) {
            this.cache.set(challengeId, {
                challengeId,
                sabotagedCode: result.code,
                fix: result.fixInstructions,
                type: result.sabotageType,
                timestamp: Date.now()
            });
            console.log(`[AI] Sabotage ready: ${result.sabotageType}`);
        }
    }

    /**
     * Gets the sabotaged code (from cache or generates on fly)
     */
    async getSabotage(challengeId: string, baseCode: string, concept: string) {
        if (this.cache.has(challengeId)) {
            return this.cache.get(challengeId);
        }

        await this.prepareSabotage(challengeId, baseCode, concept);
        return this.cache.get(challengeId);
    }

    /**
     * Submits player code for AI review
     */
    async submitForReview(challengeId: string, code: string) {
        return await reviewCode({
            code,
            originalChallenge: challengeId
        });
    }
}

export const aiChallengeService = new AIChallengeService();
