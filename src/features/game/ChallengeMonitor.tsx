import { useEffect } from 'react';
import { db } from '../../firebaseConfig';
import { ref, onValue } from 'firebase/database';
import { usePlayerProgress } from '../../stores/usePlayerProgress';
import toast from 'react-hot-toast';

export const ChallengeMonitor = () => {
    const { completedChallenges, uncompleteChallenge } = usePlayerProgress();

    useEffect(() => {
        const filesRef = ref(db, 'gamestate/files');

        const unsubscribe = onValue(filesRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;

            Object.entries(data).forEach(([fileId, fileData]: [string, any]) => {
                const status = fileData.testStatus || 'PENDING';

                // If file is failing/broken but we have it marked as completed -> Revert it!
                if (status !== 'PASS' && completedChallenges.includes(fileId)) {
                    console.log(`[ChallengeMonitor] Detected regression in ${fileId}. Un-completing.`);
                    uncompleteChallenge(fileId);

                    toast('⚠️ SABOTAGE DETECTED: Progress Lost!', {
                        icon: '📉',
                        style: {
                            background: '#7f1d1d',
                            color: '#fff',
                            fontWeight: 'bold'
                        }
                    });
                }
            });
        });

        return () => unsubscribe();
    }, [completedChallenges, uncompleteChallenge]);

    return null; // Headless component
};
