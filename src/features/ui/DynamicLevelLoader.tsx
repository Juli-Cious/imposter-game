import React from 'react';

interface DynamicLevelLoaderProps {
    onRetry?: () => void;
    error?: string;
}

/**
 * Loading screen displayed while AI generates a dynamic level
 */
export const DynamicLevelLoader: React.FC<DynamicLevelLoaderProps> = ({ onRetry, error }) => {
    if (error) {
        return (
            <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center z-50">
                <div className="text-center p-8 max-w-lg bg-red-500/10 border-2 border-red-500/30 rounded-xl">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-white text-2xl font-semibold mb-6">Oops! Generation Failed</h2>
                    <p className="text-red-300 mb-6">{error}</p>
                    {onRetry && (
                        <button
                            className="bg-gradient-to-br from-green-400 to-green-600 text-white border-none py-3 px-8 rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_16px_rgba(74,222,128,0.3)]"
                            onClick={onRetry}
                        >
                            🔄 Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] flex items-center justify-center z-50">
            <div className="text-center p-8 max-w-lg">
                <div className="text-[80px] mb-6 relative inline-block animate-float">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] bg-[radial-gradient(circle,rgba(74,222,128,0.3),transparent)] rounded-full animate-pulse-glow"></div>
                    🌍
                </div>
                <h2 className="text-white text-2xl font-semibold mb-6">Professor Gaia is Creating Your Mission...</h2>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 animate-progress-bar"></div>
                </div>
                <p className="text-white/70 text-sm mb-8">
                    Generating unique coding challenge aligned with environmental goals
                </p>
                <div className="flex flex-col gap-3 items-start max-w-[300px] mx-auto">
                    <div className="text-green-400 text-sm translate-x-[5px] transition-all duration-300">📝 Writing scenario...</div>
                    <div className="text-white/40 text-sm transition-all duration-300">🐛 Adding challenge...</div>
                    <div className="text-white/40 text-sm transition-all duration-300">🌱 Calculating SDG impact...</div>
                </div>
            </div>
        </div>
    );
};
