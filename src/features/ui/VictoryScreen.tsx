import { useGameStore } from '../../stores/useGameStore';

export const VictoryScreen = () => {
    const { setGameStatus, setGameState, closeTerminal } = useGameStore();

    const handleReturn = () => {
        closeTerminal();
        setGameStatus('IN_PROGRESS');
        setGameState('LOBBY'); // Or MENU
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-[100] animate-fadeIn">
            <div className="bg-green-900/20 border-2 border-green-500 p-12 rounded-2xl max-w-2xl text-center shadow-[0_0_50px_rgba(0,255,0,0.3)] backdrop-blur-sm">
                <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-6 drop-shadow-md">
                    MISSION COMPLETE
                </h1>

                <div className="space-y-6 text-green-100/90 text-lg">
                    <p className="text-2xl font-light">
                        Systems Restored. The Station is Green.
                    </p>

                    <div className="grid grid-cols-3 gap-4 py-8">
                        <div className="bg-black/40 p-4 rounded border border-green-500/30">
                            <div className="text-3xl mb-2">🌊</div>
                            <div className="text-sm uppercase tracking-wider">Oceans Clean</div>
                        </div>
                        <div className="bg-black/40 p-4 rounded border border-green-500/30">
                            <div className="text-3xl mb-2">⚡</div>
                            <div className="text-sm uppercase tracking-wider">Energy Pure</div>
                        </div>
                        <div className="bg-black/40 p-4 rounded border border-green-500/30">
                            <div className="text-3xl mb-2">♻️</div>
                            <div className="text-sm uppercase tracking-wider">Zero Waste</div>
                        </div>
                    </div>

                    <p className="italic text-gray-400">
                        "Your code has paved the way for a sustainable future."
                    </p>
                </div>

                <button
                    onClick={handleReturn}
                    className="mt-10 px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg transform transition hover:scale-105"
                >
                    Return to Lobby
                </button>
            </div>
        </div>
    );
};
