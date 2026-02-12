import { ref, get, update, increment } from 'firebase/database';
import { db as database } from '../firebaseConfig';

/**
 * Global Impact Tracking Service
 * Aggregates environmental impact across ALL players
 */

export interface GlobalImpactData {
    totalCO2Prevented: number;
    totalWasteRecycled: number;
    totalPeopleProtected: number;
    totalChallengesCompleted: number;
    totalPlayers: number;
    lastUpdated: number;
}

const GLOBAL_IMPACT_PATH = 'globalImpact';

/**
 * Add environmental impact to global aggregated totals
 */
export async function addToGlobalImpact(impact: {
    co2Prevented?: number;
    wasteRecycled?: number;
    peopleProtected?: number;
    challengesCompleted?: number;
}): Promise<void> {
    try {
        const updates: Record<string, any> = {
            lastUpdated: Date.now()
        };

        if (impact.co2Prevented) {
            updates.totalCO2Prevented = increment(impact.co2Prevented);
        }
        if (impact.wasteRecycled) {
            updates.totalWasteRecycled = increment(impact.wasteRecycled);
        }
        if (impact.peopleProtected) {
            updates.totalPeopleProtected = increment(impact.peopleProtected);
        }
        if (impact.challengesCompleted) {
            updates.totalChallengesCompleted = increment(impact.challengesCompleted);
        }

        const globalRef = ref(database, GLOBAL_IMPACT_PATH);
        await update(globalRef, updates);
    } catch (error) {
        console.error('Failed to update global impact:', error);
        // Don't throw - global impact is a nice-to-have, not critical
    }
}

/**
 * Register a new unique player in global stats
 */
export async function registerPlayer(playerId: string): Promise<void> {
    try {
        const playerRef = ref(database, `players/${playerId}`);
        const globalRef = ref(database, GLOBAL_IMPACT_PATH);

        const snapshot = await get(playerRef);

        if (!snapshot.exists()) {
            // New player - increment global count
            await update(globalRef, {
                totalPlayers: increment(1)
            });

            // Mark player as registered
            await update(playerRef, {
                registeredAt: Date.now(),
                lastSeen: Date.now()
            });
        } else {
            // Existing player - update last seen
            await update(playerRef, {
                lastSeen: Date.now()
            });
        }
    } catch (error) {
        console.error('Failed to register player:', error);
    }
}

/**
 * Fetch current global impact totals
 */
export async function getGlobalImpact(): Promise<GlobalImpactData> {
    try {
        const globalRef = ref(database, GLOBAL_IMPACT_PATH);
        const snapshot = await get(globalRef);

        if (snapshot.exists()) {
            return snapshot.val() as GlobalImpactData;
        }

        // Return defaults if no data exists yet
        return {
            totalCO2Prevented: 0,
            totalWasteRecycled: 0,
            totalPeopleProtected: 0,
            totalChallengesCompleted: 0,
            totalPlayers: 0,
            lastUpdated: Date.now()
        };
    } catch (error) {
        console.error('Failed to fetch global impact:', error);
        // Return defaults on error
        return {
            totalCO2Prevented: 0,
            totalWasteRecycled: 0,
            totalPeopleProtected: 0,
            totalChallengesCompleted: 0,
            totalPlayers: 0,
            lastUpdated: Date.now()
        };
    }
}
