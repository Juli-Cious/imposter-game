/**
 * Type definitions for AI-powered dynamic level generation and code review
 */

// SDG Themes for level generation
export const SDGTheme = {
    WATER: 'SDG 6: Clean Water',
    ENERGY: 'SDG 7: Clean Energy',
    CONSUMPTION: 'SDG 12: Responsible Consumption',
    CLIMATE: 'SDG 13: Climate Action'
} as const;

export type SDGThemeValue = typeof SDGTheme[keyof typeof SDGTheme];

// Programming languages supported
export type ProgrammingLanguage = 'python' | 'javascript' | 'dart';

// Difficulty levels
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Bug types
export type BugType = 'syntax' | 'logic' | 'performance';

// Dynamic Level Structure (from AI generation)
export interface DynamicLevel {
    level_id: string;
    title: string;
    description: string;
    language: ProgrammingLanguage;
    initial_code: string;
    solution_code: string;
    bug_type: BugType;
    hint: string;
    sdg_impact: string;
}

// Request to generate a dynamic level
export interface DynamicLevelRequest {
    difficulty: DifficultyLevel;
    language: ProgrammingLanguage;
    theme: SDGThemeValue;
}

// Response from dynamic level generation
export interface DynamicLevelResponse {
    success: boolean;
    level?: DynamicLevel;
    error?: string;
}

// Code complexity analysis
export interface CodeComplexity {
    notation: string; // e.g., "O(n)", "O(n^2)"
    description: string;
}

// Environmental impact metrics
export interface EnvironmentalImpact {
    energy_wasted_kwh: number;
    real_world_equivalent: string;
    sdg_message: string;
}

// Green Coder Score (post-game analysis)
export interface GreenCoderScore {
    green_coder_score: number; // 0-100
    player_complexity: string;
    optimal_complexity: string;
    complexity_comparison: string;
    energy_impact: EnvironmentalImpact;
    feedback: string;
    optimization_tip: string;
    professor_gaia_message: string;
}

// Request for code review
export interface GreenCoderRequest {
    player_code: string;
    solution_code: string;
    challenge_description: string;
    language: ProgrammingLanguage;
}

// Response from code review
export interface GreenCoderResponse {
    success: boolean;
    score?: GreenCoderScore;
    error?: string;
}

// Real-world equivalency mappings
export interface RealWorldEquivalent {
    metric: string; // e.g., "Energy Saved", "CO2 Reduced"
    value: number;
    unit: string;
    equivalent: string; // e.g., "Charging 100 iPhones"
    icon: string; // emoji or icon name
}
