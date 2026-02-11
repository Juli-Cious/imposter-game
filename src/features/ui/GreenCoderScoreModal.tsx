import React from 'react';
import type { GreenCoderScore } from '../../types/ai-levels';
import './GreenCoderScoreModal.css';

interface GreenCoderScoreModalProps {
    score: GreenCoderScore;
    onClose: () => void;
    isVisible: boolean;
}

/**
 * Post-game analysis modal showing Green Coder Score and efficiency metrics
 */
export const GreenCoderScoreModal: React.FC<GreenCoderScoreModalProps> = ({
    score,
    onClose,
    isVisible
}) => {
    if (!isVisible) return null;

    const getScoreColor = (value: number): string => {
        if (value >= 90) return '#22c55e'; // Excellent
        if (value >= 75) return '#4ade80'; // Great
        if (value >= 60) return '#facc15'; // Good
        if (value >= 40) return '#fb923c'; // Fair
        return '#ef4444'; // Needs improvement
    };

    const getScoreLabel = (value: number): string => {
        if (value >= 90) return 'Excellent! 🌟';
        if (value >= 75) return 'Great Work! ⭐';
        if (value >= 60) return 'Good Job! ✨';
        if (value >= 40) return 'Keep Learning! 💪';
        return 'Room to Grow! 🌱';
    };

    return (
        <div className="green-coder-modal-overlay" onClick={onClose}>
            <div className="green-coder-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2>🌍 Green Coder Analysis</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                {/* Score Display */}
                <div className="score-section">
                    <div className="score-circle" style={{ borderColor: getScoreColor(score.green_coder_score) }}>
                        <div className="score-value" style={{ color: getScoreColor(score.green_coder_score) }}>
                            {score.green_coder_score}
                        </div>
                        <div className="score-max">/100</div>
                    </div>
                    <div className="score-label">{getScoreLabel(score.green_coder_score)}</div>
                </div>

                {/* Professor Gaia Message */}
                <div className="gaia-message">
                    <div className="gaia-icon">🌍</div>
                    <p>{score.professor_gaia_message}</p>
                </div>

                {/* Complexity Analysis */}
                <div className="analysis-section">
                    <h3>⚡ Efficiency Analysis</h3>
                    <div className="complexity-comparison">
                        <div className="complexity-item">
                            <span className="label">Your Solution:</span>
                            <span className="value player">{score.player_complexity}</span>
                        </div>
                        <div className="complexity-item">
                            <span className="label">Optimal:</span>
                            <span className="value optimal">{score.optimal_complexity}</span>
                        </div>
                    </div>
                    <p className="comparison-text">{score.complexity_comparison}</p>
                </div>

                {/* Environmental Impact */}
                <div className="impact-section">
                    <h3>🌱 Environmental Impact</h3>
                    <div className="impact-stat">
                        <div className="stat-icon">⚡</div>
                        <div className="stat-content">
                            <div className="stat-value">{score.energy_impact.energy_wasted_kwh} kWh</div>
                            <div className="stat-label">Energy Difference</div>
                        </div>
                    </div>
                    <div className="real-world-equivalent">
                        <div className="equivalent-icon">🔌</div>
                        <p>{score.energy_impact.real_world_equivalent}</p>
                    </div>
                    <div className="sdg-impact">
                        <div className="sdg-badge">SDG Impact</div>
                        <p>{score.energy_impact.sdg_message}</p>
                    </div>
                </div>

                {/* Feedback & Tips */}
                <div className="feedback-section">
                    <div className="feedback-box">
                        <h4>💚 Feedback</h4>
                        <p>{score.feedback}</p>
                    </div>
                    {score.optimization_tip && (
                        <div className="tip-box">
                            <h4>💡 Optimization Tip</h4>
                            <p>{score.optimization_tip}</p>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <button className="continue-button" onClick={onClose}>
                    Continue Your Journey 🚀
                </button>
            </div>
        </div>
    );
};
