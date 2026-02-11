import { useEffect, useState } from 'react';

interface ChallengeAnimationProps {
    challengeId: string;
    isRunning: boolean;
}

export const ChallengeAnimation = ({ challengeId, isRunning }: ChallengeAnimationProps) => {
    const [animationStep, setAnimationStep] = useState(0);
    const [typedText, setTypedText] = useState('');

    // Reset animation when running starts
    useEffect(() => {
        if (isRunning) {
            setAnimationStep(0);
            setTypedText('');
        }
    }, [isRunning]);

    // Solar Challenge: Addition Animation
    const SolarAnimation = () => {
        useEffect(() => {
            if (!isRunning) return;

            const timer1 = setTimeout(() => setAnimationStep(1), 400);
            const timer2 = setTimeout(() => setAnimationStep(2), 900);
            const timer3 = setTimeout(() => setAnimationStep(3), 1400);
            const timer4 = setTimeout(() => setAnimationStep(4), 1900);
            const timer5 = setTimeout(() => setAnimationStep(5), 2400);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
                clearTimeout(timer4);
                clearTimeout(timer5);
            };
        }, [isRunning]);

        return (
            <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-blue-950 to-gray-900">
                <h3 className="text-yellow-400 font-bold mb-4 text-sm uppercase tracking-wider">
                    🔆 Solar Energy Calculation
                </h3>

                <div className="flex items-center gap-6">
                    {/* First Battery - appears at step 1 */}
                    <div className={`transition-all duration-500 ${animationStep >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                        <div className="relative">
                            <div className="text-6xl animate-pulse">🔋</div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                                5
                            </div>
                        </div>
                    </div>

                    {/* Plus Sign - appears at step 2 */}
                    <div className={`text-4xl font-bold text-yellow-400 transition-all duration-500 ${animationStep >= 2 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
                        +
                    </div>

                    {/* Second Battery - appears at step 3 */}
                    <div className={`transition-all duration-500 ${animationStep >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                        <div className="relative">
                            <div className="text-6xl animate-pulse" style={{ animationDelay: '0.2s' }}>🔋</div>
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                                10
                            </div>
                        </div>
                    </div>

                    {/* Equals - appears at step 4 */}
                    <div className={`text-4xl font-bold text-yellow-400 transition-all duration-500 ${animationStep >= 4 ? 'scale-100' : 'scale-0'}`}>
                        =
                    </div>

                    {/* Result - appears at step 5 */}
                    <div className={`transition-all duration-700 ${animationStep >= 5 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                        <div className="relative">
                            <div className="text-7xl">⚡</div>
                            <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 px-4 py-1 rounded-full font-black text-xl ${animationStep >= 5 ? 'animate-pulse' : ''}`}>
                                15
                            </div>
                            {animationStep >= 5 && (
                                <div className="absolute inset-0 animate-ping">
                                    <div className="text-7xl opacity-50">⚡</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-12 text-gray-400 text-sm italic">
                    Combining energy outputs: 5 + 10 = 15 units
                </div>
            </div>
        );
    };

    // Waste Challenge: Loop Animation
    const WasteAnimation = () => {
        useEffect(() => {
            if (!isRunning) return;

            const timers = [0, 1, 2, 3, 4].map((step) =>
                setTimeout(() => setAnimationStep(step + 1), step * 400)
            );

            return () => timers.forEach(clearTimeout);
        }, [isRunning]);

        const items = [0, 1, 2, 3, 4];

        return (
            <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-green-950 to-gray-900">
                <h3 className="text-yellow-400 font-bold mb-4 text-sm uppercase tracking-wider">
                    ♻️ Recycling Loop Process
                </h3>

                <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-green-700">
                    <code className="text-green-400 font-mono text-sm">
                        for (let i = 0; i &lt; 5; i++)
                    </code>
                </div>

                <div className="flex gap-4 mb-6">
                    {items.map((index) => (
                        <div key={index} className="relative">
                            <div
                                className={`text-5xl transition-all duration-500 ${animationStep > index
                                    ? 'scale-110 brightness-125'
                                    : 'scale-100 opacity-40 grayscale'
                                    }`}
                            >
                                ♻️
                            </div>
                            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-2 py-0.5 rounded font-bold text-sm transition-all ${animationStep > index ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                                }`}>
                                {index}
                            </div>
                            {animationStep === index + 1 && (
                                <div className="absolute -inset-2 border-2 border-green-400 rounded-full animate-ping" />
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-full max-w-md bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                    <div
                        className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300 ease-out"
                        style={{ width: `${(animationStep / 5) * 100}%` }}
                    />
                </div>

                <div className="mt-4 text-gray-400 text-sm">
                    Processing batch: <span className="text-green-400 font-bold">{Math.max(0, animationStep - 1)}</span> / 4
                </div>
            </div>
        );
    };

    // Oxygen Challenge: Typing Animation
    const OxygenAnimation = () => {
        const fullText = "Oxy-System: ACTIVE";

        useEffect(() => {
            if (!isRunning) return;

            let currentIndex = 0;
            const typingInterval = setInterval(() => {
                if (currentIndex <= fullText.length) {
                    setTypedText(fullText.slice(0, currentIndex));
                    currentIndex++;
                } else {
                    clearInterval(typingInterval);
                    setAnimationStep(1);
                }
            }, 80);

            return () => clearInterval(typingInterval);
        }, [isRunning]);

        return (
            <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-teal-950 to-gray-900">
                <h3 className="text-yellow-400 font-bold mb-4 text-sm uppercase tracking-wider">
                    💨 Oxygen System Initialization
                </h3>

                <div className="bg-black rounded-lg p-6 border-2 border-teal-700 shadow-2xl w-full max-w-md">
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-700">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-gray-500 text-xs font-mono">Terminal</span>
                    </div>

                    <div className="font-mono text-sm">
                        <div className="text-gray-500 mb-2">$ ./o2_scrubber.exe</div>
                        <div className="flex items-center">
                            <span className="text-green-400">
                                {typedText}
                            </span>
                            {typedText.length < fullText.length && (
                                <span className="inline-block w-2 h-4 bg-green-400 ml-1 animate-pulse"></span>
                            )}
                        </div>
                        {animationStep >= 1 && (
                            <div className="mt-4 text-teal-400 animate-pulse">
                                ✓ System ready
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex gap-2">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className={`text-3xl transition-all duration-500 ${animationStep >= 1 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-30 scale-75'
                                }`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                        >
                            💨
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render appropriate animation based on challenge
    const renderAnimation = () => {
        switch (challengeId) {
            case 'file_sum':
                return <SolarAnimation />;
            case 'file_loop':
                return <WasteAnimation />;
            case 'file_cpp_hello':
                return <OxygenAnimation />;
            default:
                return (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🎯</div>
                            <div className="text-sm">No animation available</div>
                        </div>
                    </div>
                );
        }
    };

    if (!challengeId) return null;

    return (
        <div className="h-full bg-gray-900 border-l border-gray-700">
            {renderAnimation()}
        </div>
    );
};
