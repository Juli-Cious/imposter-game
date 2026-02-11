import { useState, useEffect } from 'react';
import { INTRO_SCENES } from '../../shared/StoryContent';
import { usePlayerProgress } from '../../stores/usePlayerProgress';

interface IntroAnimationProps {
    onComplete: () => void;
}

export const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const { markIntroSeen, skipIntro } = usePlayerProgress();

    const currentScene = INTRO_SCENES[currentSceneIndex];
    const isLastScene = currentSceneIndex === INTRO_SCENES.length - 1;

    // Auto-advance to next scene
    useEffect(() => {
        if (!isVisible) return;

        const timer = setTimeout(() => {
            if (isLastScene) {
                handleComplete();
            } else {
                setCurrentSceneIndex(currentSceneIndex + 1);
            }
        }, currentScene.duration);

        return () => clearTimeout(timer);
    }, [currentSceneIndex, isVisible, currentScene.duration, isLastScene]);

    const handleSkip = () => {
        skipIntro();
        setIsVisible(false);
        onComplete();
    };

    const handleComplete = () => {
        markIntroSeen();
        setIsVisible(false);
        onComplete();
    };

    if (!isVisible) return null;

    // Animation styles based on scene
    const getAnimationClass = () => {
        switch (currentScene.animation) {
            case 'fade-in':
                return 'animate-fadeIn';
            case 'shake':
                return 'animate-shake';
            case 'glow':
                return 'animate-glow';
            case 'pulse':
                return 'animate-pulse';
            case 'bounce':
                return 'animate-bounce';
            default:
                return 'animate-fadeIn';
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div
                className="absolute inset-0 transition-all duration-1000"
                style={{ background: currentScene.background }}
            />

            {/* Starfield effect */}
            <div className="absolute inset-0 opacity-30">
                {[...Array(50)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`
                        }}
                    />
                ))}
            </div>

            {/* Cinematic letterbox bars */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-black opacity-90" />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-black opacity-90" />

            {/* Content Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
                {/* Visual Elements (Emojis) */}
                <div className={`text-8xl mb-8 ${getAnimationClass()}`}>
                    {currentScene.visual}
                </div>

                {/* Main Text */}
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 drop-shadow-2xl leading-tight animate-slideUp">
                    {currentScene.text}
                </h2>

                {/* Narration */}
                {currentScene.narration && (
                    <p className="text-xl md:text-2xl text-gray-200 italic opacity-90 animate-slideUp" style={{ animationDelay: '0.3s' }}>
                        {currentScene.narration}
                    </p>
                )}

                {/* Progress Indicator */}
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
                    {INTRO_SCENES.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSceneIndex
                                    ? 'bg-white w-8'
                                    : index < currentSceneIndex
                                        ? 'bg-white/60'
                                        : 'bg-white/20'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Skip Button */}
            <button
                onClick={handleSkip}
                className="absolute top-20 right-8 bg-black/50 hover:bg-black/70 text-white px-6 py-3 rounded-full transition-all text-sm font-bold backdrop-blur-sm border border-white/20"
            >
                Skip Intro (ESC)
            </button>

            {/* Start Button (last scene only) */}
            {isLastScene && (
                <button
                    onClick={handleComplete}
                    className="absolute bottom-32 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 px-12 py-4 rounded-full font-black text-2xl shadow-2xl animate-bounce border-4 border-white/30"
                >
                    Begin Your Adventure! 🚀
                </button>
            )}

            {/* Keyboard shortcut */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.8); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                @keyframes glow {
                    0%, 100% { filter: drop-shadow(0 0 20px gold); }
                    50% { filter: drop-shadow(0 0 40px gold); }
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 1s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.8s ease-out;
                }
                .animate-shake {
                    animation: shake 0.5s ease-in-out infinite;
                }
                .animate-glow {
                    animation: glow 2s ease-in-out infinite;
                }
                .animate-twinkle {
                    animation: twinkle 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

// ESC key handler
if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Handled by parent component
        }
    });
}
