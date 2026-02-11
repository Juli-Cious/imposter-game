import { useEffect, useState } from 'react';

interface ChallengeAnimationProps {
    challengeId: string;
    status: 'PENDING' | 'PASS' | 'FAIL';
    output?: string;
}

// Solar Challenge Component
const SolarAnimation = ({ status, setStep, step }: { status: string, setStep: (s: number) => void, step: number }) => {
    useEffect(() => {
        if (status !== 'PASS') return;

        const timer1 = setTimeout(() => setStep(1), 400);
        const timer2 = setTimeout(() => setStep(2), 900);
        const timer3 = setTimeout(() => setStep(3), 1400);
        const timer4 = setTimeout(() => setStep(4), 1900);
        const timer5 = setTimeout(() => setStep(5), 2400);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
            clearTimeout(timer5);
        };
    }, [status, setStep]);

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 bg-gradient-to-br from-blue-950 to-gray-900">
            <h3 className="text-yellow-400 font-bold mb-4 text-sm uppercase tracking-wider">
                🔆 Solar Energy Calculation
            </h3>

            <div className="flex items-center gap-6">
                <div className={`transition-all duration-500 ${step >= 1 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    <div className="relative">
                        <div className="text-6xl animate-pulse">🔋</div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full font-bold">
                            5
                        </div>
                    </div>
                </div>

                <div className={`text-4xl font-bold text-yellow-400 transition-all duration-500 ${step >= 2 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}`}>
                    +
                </div>

                <div className={`transition-all duration-500 ${step >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    <div className="relative">
                        <div className="text-6xl animate-pulse" style={{ animationDelay: '0.2s' }}>🔋</div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full font-bold">
                            10
                        </div>
                    </div>
                </div>

                <div className={`text-4xl font-bold text-yellow-400 transition-all duration-500 ${step >= 4 ? 'scale-100' : 'scale-0'}`}>
                    =
                </div>

                <div className={`transition-all duration-700 ${step >= 5 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
                    <div className="relative">
                        <div className="text-7xl">⚡</div>
                        <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 px-4 py-1 rounded-full font-black text-xl ${step >= 5 ? 'animate-pulse' : ''}`}>
                            15
                        </div>
                        {step >= 5 && (
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

// Waste Challenge Component
const WasteAnimation = ({ status, setStep, step }: { status: string, setStep: (s: number) => void, step: number }) => {
    useEffect(() => {
        if (status !== 'PASS') return;

        const timers = [0, 1, 2, 3, 4].map((s) =>
            setTimeout(() => setStep(s + 1), s * 400)
        );

        return () => timers.forEach(clearTimeout);
    }, [status, setStep]);

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
                            className={`text-5xl transition-all duration-500 ${step > index
                                ? 'scale-110 brightness-125'
                                : 'scale-100 opacity-40 grayscale'
                                }`}
                        >
                            ♻️
                        </div>
                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-2 py-0.5 rounded font-bold text-sm transition-all ${step > index ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                            }`}>
                            {index}
                        </div>
                        {step === index + 1 && (
                            <div className="absolute -inset-2 border-2 border-green-400 rounded-full animate-ping" />
                        )}
                    </div>
                ))}
            </div>

            <div className="w-full max-w-md bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300 ease-out"
                    style={{ width: `${(step / 5) * 100}%` }}
                />
            </div>

            <div className="mt-4 text-gray-400 text-sm">
                Processing batch: <span className="text-green-400 font-bold">{Math.max(0, step - 1)}</span> / 4
            </div>
        </div>
    );
};

// Oxygen Challenge Component
const OxygenAnimation = ({ status, setStep, step, output, typedText, setTypedText }: {
    status: string,
    setStep: (s: number) => void,
    step: number,
    output?: string,
    typedText: string,
    setTypedText: (t: string) => void
}) => {
    const fullText = output?.trim() || "Oxy-System: ACTIVE";

    useEffect(() => {
        if (status !== 'PASS') return;

        let currentIndex = 0;
        const typingInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setTypedText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                setStep(1);
            }
        }, 80);

        return () => clearInterval(typingInterval);
    }, [status, fullText, setStep, setTypedText]);

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
                    {step >= 1 && (
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
                        className={`text-3xl transition-all duration-500 ${step >= 1 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-30 scale-75'
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

export const ChallengeAnimation = ({ challengeId, status, output }: ChallengeAnimationProps) => {
    const [animationStep, setAnimationStep] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [hasAnimated, setHasAnimated] = useState(false);

    // Reset animation when status changes or challenge changes
    useEffect(() => {
        if (status === 'PASS' && !hasAnimated) {
            setAnimationStep(0);
            setTypedText('');
            setHasAnimated(true);
        } else if (status === 'PENDING') {
            setHasAnimated(false);
            setAnimationStep(0);
            setTypedText('');
        }
    }, [status, hasAnimated, challengeId]);

    if (!challengeId) return null;

    return (
        <div className="h-full bg-gray-900 border-l border-gray-700">
            {challengeId === 'file_sum' && (
                <SolarAnimation status={status} setStep={setAnimationStep} step={animationStep} />
            )}
            {challengeId === 'file_loop' && (
                <WasteAnimation status={status} setStep={setAnimationStep} step={animationStep} />
            )}
            {challengeId === 'file_cpp_hello' && (
                <OxygenAnimation
                    status={status}
                    setStep={setAnimationStep}
                    step={animationStep}
                    output={output}
                    typedText={typedText}
                    setTypedText={setTypedText}
                />
            )}
            {!['file_sum', 'file_loop', 'file_cpp_hello'].includes(challengeId) && (
                <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                        <div className="text-4xl mb-2">🎯</div>
                        <div className="text-sm">No animation available</div>
                    </div>
                </div>
            )}
        </div>
    );
};
