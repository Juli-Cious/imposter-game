import { useState, useEffect } from 'react';
import { getGlobalImpact, type GlobalImpactData } from '../services/GlobalImpactService';

/**
 * Hook to fetch and display global impact across all players
 */
export function useGlobalImpact() {
    const [globalImpact, setGlobalImpact] = useState<GlobalImpactData>({
        totalCO2Prevented: 0,
        totalWasteRecycled: 0,
        totalPeopleProtected: 0,
        totalChallengesCompleted: 0,
        totalPlayers: 0,
        lastUpdated: Date.now()
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchGlobalImpact() {
            try {
                setLoading(true);
                const data = await getGlobalImpact();
                if (mounted) {
                    setGlobalImpact(data);
                    setError(null);
                }
            } catch (err) {
                if (mounted) {
                    setError('Failed to load global impact data');
                    console.error('Error fetching global impact:', err);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        fetchGlobalImpact();

        // Refresh every 30 seconds
        const interval = setInterval(() => fetchGlobalImpact(), 30000);

        return () => {
            mounted = false;
            clearInterval(interval);
        };
    }, []);

    return { globalImpact, loading, error };
}
