import { useState } from 'react';
import { triggerSabotage, type SabotageType } from '../../utils/SabotageSystem';
import { useSabotageCooldown } from '../../hooks/useSabotageCooldown';
import './SabotageMenu.css';

interface SabotageMenuProps {
    roomCode: string;
    playerId: string;
    targetFileId: string;
    onSabotageComplete?: () => void;
}

export const SabotageMenu = ({ roomCode, playerId, targetFileId, onSabotageComplete }: SabotageMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSabotaging, setIsSabotaging] = useState(false);
    const { canSabotage, cooldownRemaining } = useSabotageCooldown(roomCode);

    const handleSabotage = async (type: SabotageType, name: string) => {
        if (!canSabotage || isSabotaging) return;

        setIsSabotaging(true);
        setIsOpen(false);

        const result = await triggerSabotage(type, playerId, roomCode, targetFileId);

        if (result.success) {
            console.log(`[SabotageMenu] ${name} successful:`, result.description);
            onSabotageComplete?.();
        } else {
            console.warn(`[SabotageMenu] ${name} failed:`, result.description);
        }

        setIsSabotaging(false);
    };

    return (
        <div className="sabotage-menu-container">
            {/* Floating Sabotage Button */}
            <button
                className={`sabotage-button ${!canSabotage ? 'disabled' : ''} ${isSabotaging ? 'sabotaging' : ''}`}
                onClick={() => canSabotage && setIsOpen(!isOpen)}
                disabled={!canSabotage || isSabotaging}
                title={canSabotage ? 'Sabotage' : `Cooldown: ${cooldownRemaining}s`}
            >
                {isSabotaging ? '⏳' : '🔪'}
                {!canSabotage && (
                    <span className="cooldown-badge">{cooldownRemaining}s</span>
                )}
            </button>

            {/* Sabotage Options Menu */}
            {isOpen && canSabotage && (
                <div className="sabotage-menu">
                    <div className="sabotage-menu-header">
                        <span className="sabotage-menu-title">🕵️ SABOTAGE</span>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
                    </div>

                    <div className="sabotage-options">
                        <button
                            className="sabotage-option"
                            onClick={() => handleSabotage('syntax_error', 'Syntax Error')}
                        >
                            <div className="option-icon">⚠️</div>
                            <div className="option-content">
                                <div className="option-name">Syntax Error</div>
                                <div className="option-desc">Remove semicolon or add mismatched bracket</div>
                            </div>
                        </button>

                        <button
                            className="sabotage-option"
                            onClick={() => handleSabotage('logic_swap', 'Logic Swap')}
                        >
                            <div className="option-icon">🔄</div>
                            <div className="option-content">
                                <div className="option-name">Logic Swap</div>
                                <div className="option-desc">Swap operators (true/false, +/-)</div>
                            </div>
                        </button>

                        <button
                            className="sabotage-option"
                            onClick={() => handleSabotage('clear_line', 'Clear Line')}
                        >
                            <div className="option-icon">🗑️</div>
                            <div className="option-content">
                                <div className="option-name">Clear Line</div>
                                <div className="option-desc">Delete a random line of code</div>
                            </div>
                        </button>

                        <button
                            className="sabotage-option power-cut"
                            onClick={() => handleSabotage('power_cut', 'Power Cut')}
                        >
                            <div className="option-icon">⚡</div>
                            <div className="option-content">
                                <div className="option-name">Power Cut</div>
                                <div className="option-desc">Plunge the station into darkness</div>
                            </div>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
