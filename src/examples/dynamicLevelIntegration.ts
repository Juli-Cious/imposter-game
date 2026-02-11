/**
 * Example integration demonstrating how to use dynamic level generation
 * This can be integrated into your game's level selection or challenge station
 */

import { generateDynamicLevel, analyzeGreenCode } from '../services/GoogleAIService';
import { SDGTheme, type SDGThemeValue, type ProgrammingLanguage, type DifficultyLevel } from '../types/ai-levels';

/**
 * Example 1: Generate a dynamic level
 */
export async function exampleGenerateLevel() {
    console.log('🎮 Generating dynamic level...');

    const result = await generateDynamicLevel({
        difficulty: 'medium',
        language: 'javascript',
        theme: SDGTheme.CLIMATE
    });

    if (result.success && result.level) {
        console.log('✅ Level generated successfully!');
        console.log('📝 Title:', result.level.title);
        console.log('🐛 Bug Type:', result.level.bug_type);
        console.log('💡 Hint:', result.level.hint);
        console.log('🌱 SDG Impact:', result.level.sdg_impact);

        // You can now use this level in your game:
        // - Display result.level.description to the player
        // - Show result.level.initial_code in the code editor
        // - Compare player's fix to result.level.solution_code

        return result.level;
    } else {
        console.error('❌ Failed to generate level:', result.error);
        // Fallback to hardcoded level
        return null;
    }
}

/**
 * Example 2: Analyze player's solution for Green Coder Score
 */
export async function exampleAnalyzeCode(
    playerCode: string,
    levelData: { solution_code: string; description: string; language: ProgrammingLanguage }
) {
    console.log('🔍 Analyzing code efficiency...');

    const result = await analyzeGreenCode({
        player_code: playerCode,
        solution_code: levelData.solution_code,
        challenge_description: levelData.description,
        language: levelData.language
    });

    if (result.success && result.score) {
        console.log('✅ Analysis complete!');
        console.log('🎯 Green Coder Score:', result.score.green_coder_score, '/100');
        console.log('⚡ Energy Impact:', result.score.energy_impact.energy_wasted_kwh, 'kWh');
        console.log('🌍 Real World:', result.score.energy_impact.real_world_equivalent);

        // Now show the GreenCoderScoreModal with this data
        return result.score;
    } else {
        console.error('❌ Failed to analyze code:', result.error);
        return null;
    }
}

/**
 * Example 3: Complete flow - Generate level, player solves, analyze solution
 */
export class DynamicLevelFlow {
    private currentLevel: any = null;

    async startLevel(difficulty: DifficultyLevel, theme: SDGThemeValue, language: ProgrammingLanguage) {
        // Step 1: Show loading screen (DynamicLevelLoader component)
        const result = await generateDynamicLevel({ difficulty, language, theme });

        if (result.success && result.level) {
            this.currentLevel = result.level;
            // Step 2: Hide loader, show level UI with initial_code
            return this.currentLevel;
        } else {
            // Show error state in DynamicLevelLoader with retry button
            throw new Error(result.error || 'Failed to generate level');
        }
    }

    async submitSolution(playerCode: string) {
        if (!this.currentLevel) {
            throw new Error('No active level');
        }

        // Step 1: Check if code is correct (basic validation)
        // You can use your existing code runner here

        // Step 2: Analyze efficiency with AI
        const analysis = await analyzeGreenCode({
            player_code: playerCode,
            solution_code: this.currentLevel.solution_code,
            challenge_description: this.currentLevel.description,
            language: this.currentLevel.language
        });

        if (analysis.success && analysis.score) {
            // Step 3: Show GreenCoderScoreModal with the analysis
            // Also update player stats based on green_coder_score
            return analysis.score;
        }

        return null;
    }
}

/**
 * Example 4: Integration with existing challenge system
 * Add this to your challenge selection screen or level manager
 */
export const DYNAMIC_LEVEL_CONFIG = {
    // Easy level for beginners
    easy_water: {
        difficulty: 'easy' as DifficultyLevel,
        theme: SDGTheme.WATER,
        language: 'javascript' as ProgrammingLanguage,
        description: 'Learn basic coding with water management'
    },

    // Medium level for intermediate
    medium_energy: {
        difficulty: 'medium' as DifficultyLevel,
        theme: SDGTheme.ENERGY,
        language: 'javascript' as ProgrammingLanguage,
        description: 'Optimize energy usage algorithms'
    },

    // Hard level for advanced
    hard_climate: {
        difficulty: 'hard' as DifficultyLevel,
        theme: SDGTheme.CLIMATE,
        language: 'javascript' as ProgrammingLanguage,
        description: 'Master algorithmic efficiency for climate action'
    }
};
