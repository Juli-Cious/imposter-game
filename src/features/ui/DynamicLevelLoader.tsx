import React from 'react';
import './DynamicLevelLoader.css';

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
            <div className="dynamic-level-loader error-state">
                <div className="loader-content">
                    <div className="error-icon">⚠️</div>
                    <h2>Oops! Generation Failed</h2>
                    <p className="error-message">{error}</p>
                    {onRetry && (
                        <button className="retry-button" onClick={onRetry}>
                            🔄 Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="dynamic-level-loader">
            <div className="loader-content">
                <div className="gaia-avatar">
                    <div className="avatar-glow"></div>
                    🌍
                </div>
                <h2>Professor Gaia is Creating Your Mission...</h2>
                <div className="loading-bar">
                    <div className="loading-progress"></div>
                </div>
                <p className="loading-hint">
                    Generating unique coding challenge aligned with environmental goals
                </p>
                <div className="loading-steps">
                    <div className="step active">📝 Writing scenario...</div>
                    <div className="step">🐛 Adding challenge...</div>
                    <div className="step">🌱 Calculating SDG impact...</div>
                </div>
            </div>
        </div>
    );
};
