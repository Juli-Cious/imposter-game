import { useState } from 'react';
import { TUTORIAL_STEPS } from '../../shared/StoryContent';
import { usePlayerProgress } from '../../stores/usePlayerProgress';

export const TutorialOverlay = () => {
    const { currentTutorialStep, setTutorialStep, completeTutorial } = usePlayerProgress();
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible || currentTutorialStep < 0) return null;

    const step = TUTORIAL_STEPS[currentTutorialStep];
    if (!step) return null;

    const handleNext = () => {
        if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
            setTutorialStep(currentTutorialStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentTutorialStep > 0) {
            setTutorialStep(currentTutorialStep - 1);
        }
    };

    const handleSkip = () => {
        completeTutorial();
        setIsVisible(false);
    };

    const handleComplete = () => {
        completeTutorial();
        setIsVisible(false);
    };

    const isFirstStep = currentTutorialStep === 0;
    const isLastStep = currentTutorialStep === TUTORIAL_STEPS.length - 1;

    const getArrowClass = () => {
        if (!step.arrow) return '';

        switch (step.position) {
            case 'right':
                return 'arrow-left';
            case 'left':
                return 'arrow-right';
            case 'top':
                return 'arrow-down';
            case 'bottom':
                return 'arrow-up';
            default:
                return '';
        }
    };

    return (
        <>
            {/* Dark Overlay */}
            <div className="fixed inset-0 z-[150] bg-black/70 backdrop-blur-sm pointer-events-none" />

            {/* Spotlight effect (for highlighted elements) */}
            {step.highlight && (
                <div
                    className="fixed z-[151] pointer-events-none"
                    style={{
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
                        // Position would need to be calculated based on target element
                        // For now, using center as example
                        top: '50%',
                        left: '50%',
                        width: '300px',
                        height: '200px',
                        transform: 'translate(-50%, -50%)',
                        borderRadius: '1rem',
                        transition: 'all 0.3s ease-out'
                    }}
                />
            )}

            {/* Tutorial Tooltip */}
            <div className={`fixed z-[160] ${step.position === 'center' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}>
                <div className={`relative ${getArrowClass()}`}>
                    <div className="bg-gradient-to-br from-purple-900 to-blue-900 border-4 border-yellow-500 rounded-2xl p-6 max-w-md shadow-2xl animate-fadeIn">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-bold text-yellow-400">{step.title}</h3>
                            <button
                                onClick={handleSkip}
                                className="text-gray-400 hover:text-white text-sm"
                            >
                                Skip Tutorial
                            </button>
                        </div>

                        {/* Description */}
                        <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                            {step.description}
                        </p>

                        {/* Navigation */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-400">
                                Step {currentTutorialStep + 1} of {TUTORIAL_STEPS.length}
                            </div>
                            <div className="flex gap-2">
                                {!isFirstStep && (
                                    <button
                                        onClick={handlePrevious}
                                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
                                    >
                                        ← Back
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 font-black py-2 px-8 rounded-lg shadow-lg transition-all"
                                >
                                    {isLastStep ? 'Got It! 🚀' : 'Next →'}
                                </button>
                            </div>
                        </div>

                        {/* Progress Dots */}
                        <div className="flex gap-1.5 justify-center mt-4">
                            {TUTORIAL_STEPS.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all ${index === currentTutorialStep
                                            ? 'bg-yellow-400 w-6'
                                            : index < currentTutorialStep
                                                ? 'bg-green-400'
                                                : 'bg-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Arrow Indicator (pointing to target) */}
                    {step.arrow && step.position === 'right' && (
                        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2">
                            <div className="text-6xl text-yellow-400 animate-bounce-horizontal">
                                ◄◄◄
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.9); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes bounce-horizontal {
                    0%, 100% { transform: translateX(0) translateY(-50%); }
                    50% { transform: translateX(-10px) translateY(-50%); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-bounce-horizontal {
                    animation: bounce-horizontal 1s ease-in-out infinite;
                }
            `}</style>
        </>
    );
};
