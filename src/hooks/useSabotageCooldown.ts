import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

interface SabotageCooldown {
    canSabotage: boolean;
    cooldownRemaining: number;
    triggerCooldown: () => void;
}

/**
 * Custom hook for managing sabotage cooldown
 * Listens to Firebase for global cooldown state
 * 
 * @param roomCode - The current room code
 * @returns Cooldown state and control function
 */
export function useSabotageCooldown(roomCode: string | null): SabotageCooldown {
    const [cooldownEnd, setCooldownEnd] = useState<number>(0);
    const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

    // Listen to Firebase for cooldown updates
    useEffect(() => {
        if (!roomCode) return;

        const cooldownRef = ref(db, `rooms/${roomCode}/sabotage/cooldownEnd`);
        const unsubscribe = onValue(cooldownRef, (snapshot) => {
            const end = snapshot.val() || 0;
            setCooldownEnd(end);
        });

        return () => unsubscribe();
    }, [roomCode]);

    // Update remaining time every second
    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
            setCooldownRemaining(remaining);
        }, 100); // Update frequently for smooth countdown

        return () => clearInterval(interval);
    }, [cooldownEnd]);

    const canSabotage = cooldownRemaining === 0;

    const triggerCooldown = () => {
        // Cooldown is managed by SabotageSystem.triggerSabotage()
        // This function is here for potential manual triggers
        setCooldownEnd(Date.now() + 30000);
    };

    return {
        canSabotage,
        cooldownRemaining,
        triggerCooldown
    };
}
