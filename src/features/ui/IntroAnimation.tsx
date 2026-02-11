import { useEffect, useState } from 'react';
import { INTRO_SCENES } from '../../shared/StoryContent';
import { usePlayerProgress } from '../../stores/usePlayerProgress';
import './DinoIntro.css';

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

    // Render different dinosaur scenes based on visual type
    const renderDinoScene = () => {
        const visual = currentScene.visual;

        switch (visual) {
            case 'dinos-worried':
                return (
                    <div className="dino-scene">
                        <div className="dino dino-doux worried" style={{ left: '20%' }} />
                        <div className="dino dino-mort worried" style={{ left: '40%' }} />
                        <div className="dino dino-tard worried" style={{ left: '60%' }} />
                        <div className="dino dino-vita worried" style={{ left: '80%' }} />
                    </div>
                );

            case 'dinos-gather':
                return (
                    <div className="dino-scene">
                        <div className="dino dino-doux walk-in-left" />
                        <div className="dino dino-mort walk-in-left delay-1" />
                        <div className="dino dino-tard walk-in-right" />
                        <div className="dino dino-vita walk-in-right delay-1" />
                    </div>
                );

            case 'dinos-powers':
                return (
                    <div className="dino-scene">
                        <div className="dino dino-doux power-up" style={{ left: '15%' }}>
                            <div className="power-icon">⚡</div>
                        </div>
                        <div className="dino dino-mort power-up delay-1" style={{ left: '35%' }}>
                            <div className="power-icon">♻️</div>
                        </div>
                        <div className="dino dino-tard power-up delay-2" style={{ left: '55%' }}>
                            <div className="power-icon">💨</div>
                        </div>
                        <div className="dino dino-vita power-up delay-3" style={{ left: '75%' }}>
                            <div className="power-icon">🌱</div>
                        </div>
                    </div>
                );

            case 'dinos-walking':
                return (
                    <div className="dino-scene">
                        <div className="dino dino-doux walking" />
                        <div className="dino dino-mort walking delay-1" />
                        <div className="dino dino-tard walking delay-2" />
                        <div className="dino dino-vita walking delay-3" />
                    </div>
                );

            case 'dinos-celebrate':
                return (
                    <div className="dino-scene">
                        <div className="dino dino-doux celebrate" style={{ left: '15%' }} />
                        <div className="dino dino-mort celebrate delay-1" style={{ left: '35%' }} />
                        <div className="dino dino-tard celebrate delay-2" style={{ left: '55%' }} />
                        <div className="dino dino-vita celebrate delay-3" style={{ left: '75%' }} />
                        <div className="confetti-container">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <div key={i} className="confetti" style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`,
                                    background: ['#ff0', '#f0f', '#0ff', '#0f0', '#f00'][Math.floor(Math.random() * 5)]
                                }} />
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="intro-container-dino">
            {/* Animated Background */}
            <div
                className="intro-background"
                style={{ background: currentScene.background }}
            />

            {/* Particle Effects */}
            <div className="particle-field">
                {Array.from({ length: 40 }).map((_, i) => (
                    <div
                        key={`particle-${i}`}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                        }}
                    />
                ))}
            </div>

            {/* Cinematic letterbox bars */}
            <div className="letterbox-top" />
            <div className="letterbox-bottom" />

            {/* Dinosaur Scene */}
            <div className="scene-container">
                {renderDinoScene()}
            </div>

            {/* Text Content */}
            <div className="text-container">
                <h2 className="scene-text">
                    {currentScene.text}
                </h2>
                {currentScene.narration && (
                    <p className="scene-narration">
                        {currentScene.narration}
                    </p>
                )}
            </div>

            {/* Skip Button */}
            <button onClick={handleSkip} className="skip-btn">
                Skip Intro ›
            </button>

            {/* Start Button (last scene only) */}
            {isLastScene && (
                <button onClick={handleComplete} className="start-btn">
                    Start Adventure! 🚀
                </button>
            )}
        </div>
    );
};
