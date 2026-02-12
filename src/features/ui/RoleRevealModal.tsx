import { useEffect, useState } from 'react';
import './RoleRevealModal.css';

interface RoleRevealModalProps {
    playerRole: 'hero' | 'imposter' | 'reformed';
    onClose: () => void;
}

export const RoleRevealModal = ({ playerRole, onClose }: RoleRevealModalProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation on mount
        setTimeout(() => setIsVisible(true), 100);
    }, []);

    const isHero = playerRole === 'hero';
    const isReformed = playerRole === 'reformed';

    return (
        <div className="role-reveal-overlay" onClick={onClose}>
            <div
                className={`role-reveal-modal ${isVisible ? 'visible' : ''} ${isHero || isReformed ? 'hero-theme' : 'imposter-theme'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="role-reveal-content">
                    {/* Icon Display */}
                    <div className={`role-icon ${isHero || isReformed ? 'hero-icon' : 'imposter-icon'}`}>
                        {isHero ? '🦸‍♀️' : isReformed ? '😇' : '🕵️'}
                    </div>

                    {/* Role Title */}
                    <h1 className="role-title">
                        {isHero ? 'YOU ARE A HERO!' : isReformed ? 'YOU ARE REFORMED!' : 'YOU ARE THE IMPOSTER!'}
                    </h1>

                    {/* Role Description */}
                    <p className="role-description">
                        {isHero
                            ? 'Fix the code and find the saboteur before it\'s too late!'
                            : isReformed
                                ? 'You have turned a new leaf! Help the heroes win!'
                                : 'Sabotage the mission without getting caught!'}
                    </p>

                    {/* Additional Icons */}
                    <div className="role-emojis">
                        {isHero ? '🔍💻✨' : isReformed ? '🛠️🤝✨' : '🎭💀🔥'}
                    </div>

                    {/* Objectives */}
                    <div className="role-objectives">
                        <h3>Your Mission:</h3>
                        {isHero ? (
                            <ul>
                                <li>Complete coding challenges</li>
                                <li>Watch for suspicious behavior</li>
                                <li>Vote to eject the imposter</li>
                            </ul>
                        ) : (
                            <ul>
                                <li>Pretend to fix the code</li>
                                <li>Use sabotage actions discreetly</li>
                                <li>Avoid getting caught!</li>
                            </ul>
                        )}
                    </div>

                    {/* Close Button */}
                    <button className="role-reveal-close" onClick={onClose}>
                        START MISSION
                    </button>
                </div>
            </div>
        </div>
    );
};
