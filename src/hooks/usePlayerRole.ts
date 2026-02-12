import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

/**
 * Custom hook to get the current player's role
 * @param roomCode - The current room code
 * @param playerId - The current player ID
 * @returns The player's role or null
 */
export function usePlayerRole(
    roomCode: string | null,
    playerId: string | null
): 'hero' | 'imposter' | 'reformed' | null {
    const [role, setRole] = useState<'hero' | 'imposter' | 'reformed' | null>(null);

    useEffect(() => {
        if (!roomCode || !playerId) {
            setRole(null);
            return;
        }

        const roleRef = ref(db, `rooms/${roomCode}/players/${playerId}/role`);
        const unsubscribe = onValue(roleRef, (snapshot) => {
            const roleValue = snapshot.val();
            setRole(roleValue || null);
        });

        return () => unsubscribe();
    }, [roomCode, playerId]);

    return role;
}
