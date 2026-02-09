import { useEffect, useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { db } from '../../firebaseConfig';
import { ref, onValue, update } from 'firebase/database';

export const LobbyScreen = () => {
    const { roomCode, isHost, playerId, network, setGameState, playerSkin, playerTint } = useGameStore();
    const [players, setPlayers] = useState<any[]>([]);

    // Sync Customization to LocalStorage
    useEffect(() => {
        const session = localStorage.getItem('imposter_session');
        if (session) {
            try {
                const data = JSON.parse(session);
                // Only write if changed to avoid unnecessary writes, though checking object equality is cheap here
                if (data.skin !== (playerSkin || 'doux') || data.tint !== (playerTint || 0xffffff)) {
                    data.skin = playerSkin || 'doux';
                    data.tint = playerTint || 0xffffff;
                    localStorage.setItem('imposter_session', JSON.stringify(data));
                    // console.log("[Lobby] Updated local session customization", { skin: data.skin, tint: data.tint });
                }
            } catch (e) {
                console.error("Failed to update session", e);
            }
        }
    }, [playerSkin, playerTint]);

    useEffect(() => {
        if (!roomCode) {
            console.warn("[Lobby] Missing roomCode", { roomCode });
            return;
        }

        console.log(`[Lobby] Subscribing to rooms/${roomCode}`);

        const playersRef = ref(db, `rooms/${roomCode}/players`);
        const unsub = onValue(playersRef, (snapshot) => {
            console.log("[Lobby] Players update:", snapshot.key, snapshot.val());
            const data = snapshot.val();
            if (data) setPlayers(Object.values(data));
            else setPlayers([]);
        });

        // Listen for Game Start
        const statusRef = ref(db, `rooms/${roomCode}/status`);
        const unsubStatus = onValue(statusRef, (snapshot) => {
            const val = snapshot.val();
            console.log("[Lobby] Status update:", val);
            if (val === 'PLAYING') {
                console.log("[Lobby] Status is PLAYING, switching state...");
                setGameState('GAME');
            }
        });

        return () => {
            unsub();
            unsubStatus();
        };
    }, [roomCode, setGameState]);

    const handleStartGame = async () => {
        if (!roomCode) return;
        console.log("[Lobby] Host starting game...");
        // set status to PLAYING
        await update(ref(db, `rooms/${roomCode}`), { status: 'PLAYING' });
    };

    const copyCode = () => {
        if (roomCode) navigator.clipboard.writeText(roomCode);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
            <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-cyan-400">LOBBY</h1>
                    <div className="flex items-center gap-4 bg-gray-700 px-4 py-2 rounded">
                        <span className="text-gray-400">ROOM CODE:</span>
                        <span className="text-2xl font-mono tracking-widest font-bold">{roomCode}</span>
                        <button
                            onClick={copyCode}
                            className="ml-2 text-sm bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded transition"
                        >
                            COPY
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div className="bg-gray-700/50 p-4 rounded">
                        <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2">PLAYERS ({players.length})</h2>
                        <ul className="space-y-2">
                            {players.map((p) => (
                                <li key={p.id} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }}></div>
                                    <span className={p.id === playerId ? "text-yellow-400 font-bold" : "text-gray-300"}>
                                        {p.name} {p.id === playerId && "(YOU)"}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gray-700/50 p-4 rounded flex flex-col items-center justify-center">
                        <h2 className="text-xl font-bold mb-4 border-b border-gray-600 pb-2 w-full text-center">CUSTOMIZE</h2>

                        <div className="flex flex-col gap-4 w-full">
                            {/* Preview Area */}
                            <div className="flex justify-center mb-2">
                                <div className="relative w-24 h-24 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center overflow-hidden">
                                    {/* 
                                        Sprite Preview 
                                        We use a 24x24 base size scaled up. 
                                        Using a container to hold the sprite helps with centering.
                                    */}
                                    <div className="relative w-[96px] h-[96px]"> {/* 24 * 4 = 96 */}
                                        <style>{`
                                            @keyframes sprite-play {
                                                from { background-position-x: 0; }
                                                to { background-position-x: -400%; }
                                            }
                                            @keyframes mask-play {
                                                from { -webkit-mask-position-x: 0; mask-position-x: 0; }
                                                to { -webkit-mask-position-x: -400%; mask-position-x: -400%; }
                                            }
                                            .pixelated {
                                                image-rendering: pixelated;
                                            }
                                        `}</style>

                                        {/* Base Sprite */}
                                        <div
                                            className="absolute inset-0 pixelated"
                                            style={{
                                                backgroundImage: `url('assets/sprites/DinoSprites - ${useGameStore.getState().playerSkin || 'doux'}.png')`,
                                                backgroundSize: '2400% 100%',
                                                animation: 'sprite-play 0.8s steps(4) infinite'
                                            }}
                                        />

                                        {/* Tint Overlay (Masked) */}
                                        <div
                                            className="absolute inset-0 pixelated mix-blend-multiply"
                                            style={{
                                                backgroundColor: '#' + (useGameStore.getState().playerTint || 0xffffff).toString(16).padStart(6, '0'),
                                                WebkitMaskImage: `url('assets/sprites/DinoSprites - ${useGameStore.getState().playerSkin || 'doux'}.png')`,
                                                maskImage: `url('assets/sprites/DinoSprites - ${useGameStore.getState().playerSkin || 'doux'}.png')`,
                                                WebkitMaskSize: '2400% 100%',
                                                maskSize: '2400% 100%',
                                                animation: 'mask-play 0.8s steps(4) infinite'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Skin Selector (Arrows) */}
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => {
                                        const skins = ['doux', 'mort', 'tard', 'vita'];
                                        const currentSkin = useGameStore.getState().playerSkin || 'doux';
                                        const currentIndex = skins.indexOf(currentSkin);
                                        const nextIndex = (currentIndex - 1 + skins.length) % skins.length;
                                        const nextSkin = skins[nextIndex];

                                        useGameStore.getState().setPlayerSkin(nextSkin);
                                        network?.updatePlayerCustomization(nextSkin, useGameStore.getState().playerTint || 0xffffff);
                                    }}
                                    className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition hover:scale-110"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <button
                                    onClick={() => {
                                        const skins = ['doux', 'mort', 'tard', 'vita'];
                                        const currentSkin = useGameStore.getState().playerSkin || 'doux';
                                        const currentIndex = skins.indexOf(currentSkin);
                                        const nextIndex = (currentIndex + 1) % skins.length;
                                        const nextSkin = skins[nextIndex];

                                        useGameStore.getState().setPlayerSkin(nextSkin);
                                        network?.updatePlayerCustomization(nextSkin, useGameStore.getState().playerTint || 0xffffff);
                                    }}
                                    className="p-2 rounded-full bg-gray-600 hover:bg-gray-500 text-white transition hover:scale-110"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Tint Picker */}
                            <div className="flex justify-center gap-2 flex-wrap p-2 bg-gray-800/50 rounded-lg">
                                {/* NO TINT option */}
                                <button
                                    onClick={() => {
                                        useGameStore.getState().setPlayerTint(0xffffff);
                                        network?.updatePlayerCustomization(useGameStore.getState().playerSkin || 'doux', 0xffffff);
                                    }}
                                    className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center bg-white ${useGameStore.getState().playerTint === 0xffffff || !useGameStore.getState().playerTint
                                        ? 'border-cyan-400 scale-110 shadow-lg'
                                        : 'border-gray-400 hover:scale-105'
                                        }`}
                                >
                                    <span className="text-gray-500 text-[10px] font-bold">X</span>
                                </button>

                                {/* Colors */}
                                {[0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff].map((tint) => (
                                    <button
                                        key={tint}
                                        onClick={() => {
                                            useGameStore.getState().setPlayerTint(tint);
                                            network?.updatePlayerCustomization(useGameStore.getState().playerSkin || 'doux', tint);
                                        }}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${useGameStore.getState().playerTint === tint
                                            ? 'border-white scale-125 shadow-md'
                                            : 'border-transparent hover:scale-110'
                                            }`}
                                        style={{ backgroundColor: '#' + tint.toString(16).padStart(6, '0') }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    {isHost ? (
                        <button
                            onClick={handleStartGame}
                            className="w-full py-4 bg-green-600 hover:bg-green-500 rounded font-bold text-xl shadow-lg transition transform hover:scale-[1.02]"
                        >
                            START GAME
                        </button>
                    ) : (
                        <div className="text-center text-gray-400 animate-pulse">
                            Waiting for host to start...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
