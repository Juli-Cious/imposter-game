import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';

export const GameTimer = () => {
    const { network, isHost, roomCode } = useGameStore();
    const [endTime, setEndTime] = useState<number | null>(null);
    const [displayTime, setDisplayTime] = useState(600);

    // 1. Subscribe to the TARGET END TIME (not seconds)
    useEffect(() => {
        if (!network) return;
        network.subscribeToTimer((serverEndTime) => {
            setEndTime(serverEndTime);
        });
    }, [network]);

    // 2. Local Ticker (Independent of server updates)
    useEffect(() => {
        if (!endTime) return;

        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
            setDisplayTime(remaining);

            // Victory Check (Any player can trigger this if time is up, to handle host disconnections)
            if (remaining <= 0 && roomCode && displayTime !== remaining) {
                // Note: displayTime check prevents spamming in loop if we didn't update state yet,
                // but better is to rely on the firebase check below.

                import('firebase/database').then(({ ref, get, set }) => {
                    import('../../firebaseConfig').then(({ db }) => {
                        const statusRef = ref(db, `rooms/${roomCode}/status`);
                        get(statusRef).then(snap => {
                            // Only trigger if game is still strictly PLAYING AND I AM HOST
                            if (snap.val() === 'PLAYING' && isHost) {
                                // console.log("[GameTimer] Time up! Triggering VICTORY_IMPOSTER");
                                set(statusRef, 'VICTORY_IMPOSTER');
                            }
                        });
                    });
                });
            }
        };

        // Run immediately
        updateTimer();

        // Run every 100ms for responsiveness (UI updates every second effectively due to ceil)
        const interval = setInterval(updateTimer, 100);
        return () => clearInterval(interval);
    }, [endTime, isHost, roomCode]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const isCritical = displayTime < 60; // Red alert last minute

    return (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-40 bg-black/80 border-2 ${isCritical ? 'border-red-500 text-red-500 animate-pulse' : 'border-blue-500 text-blue-400'} px-6 py-2 rounded-xl font-mono text-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
            {formatTime(displayTime)}
        </div>
    );
};
