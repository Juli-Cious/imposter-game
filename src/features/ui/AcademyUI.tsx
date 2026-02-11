import { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { SDGBadgeGroup } from './SDGBadge';

export const AcademyUI = () => {
    const { academyType, closeTerminal } = useGameStore();
    const [currentStep, setCurrentStep] = useState(0);

    if (!academyType) return null;

    const lessons = {
        solar: {
            title: "☀️ SOLAR ENERGY ACADEMY",
            tutor: "Professor Sunny",
            sdgGoals: [7, 13],

            intro: "Welcome, future Earth-saver! 🌍",
            storyIntro: "Oh no! A village's lights are going out because they don't have enough clean energy. But YOU can learn the coding skill to help them switch to solar power!",

            realWorldImpact: "Did you know? When villages use solar panels instead of fossil fuels, they stop releasing harmful CO₂ that causes climate change. Your coding skills can really help save the planet!",

            conceptTitle: "Today's Superpower: ADDITION ➕",
            conceptExplanation: "Imagine you have 2 boxes of solar energy. One box has 5 units ⚡, another has 10 units ⚡. To find the TOTAL energy, we ADD them using the '+' sign!",

            steps: [
                {
                    title: "Step 1: Understanding Variables",
                    content: "Variables are like boxes that hold numbers. We name them so we can use them later!",
                    example: "a = 5    ← This box 'a' holds 5 units of solar energy\nb = 10   ← This box 'b' holds 10 units"
                },
                {
                    title: "Step 2: Addition Magic",
                    content: "When we want to combine the energy from both boxes, we use the '+' symbol",
                    example: "a + b = 5 + 10 = 15 units of clean energy! ⚡"
                },
                {
                    title: "Step 3: Showing the Result",
                    content: "We use 'print()' to display our answer so everyone can see how much energy we have!",
                    example: "print(a + b)\n↓\n15    ← The village has enough power! 🎉"
                }
            ],

            animations: [
                <div key="1" className="flex items-center justify-around h-32 bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-600/30">
                    <div className="text-center animate-bounce">
                        <div className="text-5xl">🔆</div>
                        <div className="text-yellow-400 font-bold text-2xl mt-2">5</div>
                        <div className="text-xs text-gray-400">Panel A</div>
                    </div>
                    <div className="text-3xl font-bold text-yellow-400 animate-pulse">+</div>
                    <div className="text-center animate-bounce" style={{ animationDelay: '0.2s' }}>
                        <div className="text-5xl">🔆</div>
                        <div className="text-yellow-400 font-bold text-2xl mt-2">10</div>
                        <div className="text-xs text-gray-400">Panel B</div>
                    </div>
                    <div className="text-3xl font-bold text-yellow-400 animate-pulse" style={{ animationDelay: '0.4s' }}>=</div>
                    <div className="relative">
                        <div className="text-6xl animate-pulse">⚡</div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-black text-3xl drop-shadow-lg">15</div>
                        <div className="text-xs text-green-400 text-center font-bold mt-1">Enough!</div>
                    </div>
                </div>,

                <div key="2" className="h-32 bg-gradient-to-br from-green-900/30 to-blue-900/30 rounded-lg p-4 border border-green-600/30">
                    <div className="text-center mb-2">
                        <div className="text-2xl">🏘️ Village Powered! 🎉</div>
                    </div>
                    <div className="flex justify-around items-center">
                        <div className="text-center">
                            <div className="text-3xl">🏫</div>
                            <div className="text-xs text-green-400">School Lit</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl">🏥</div>
                            <div className="text-xs text-green-400">Clinic Open</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl">💡</div>
                            <div className="text-xs text-green-400">Lights On</div>
                        </div>
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-300">
                        ✨ Zero pollution! Clean energy! ✨
                    </div>
                </div>
            ]
        },

        waste: {
            title: "♻️ RECYCLING SYSTEMS ACADEMY",
            tutor: "Engineer Loop",
            sdgGoals: [12],

            intro: "Hello, Environmental Hero! 🦸",
            storyIntro: "Emergency! Five trucks full of recyclables just arrived at the recycling plant. If we don't sort them quickly, they'll go to the landfill and pollute our Earth! We need YOUR coding powers!",

            realWorldImpact: "True Fact: Recycling plants that use automated sorting can process 100,000 items per hour! This saves forests, reduces ocean plastic, and keeps our planet beautiful.  When YOU learn to code loops, you're learning the same skill that powers these amazing machines!",

            conceptTitle: "Today's Superpower: LOOPS 🔄",
            conceptExplanation: "Instead of writing 'Check Truck' five times, we teach the computer to REPEAT the task automatically! This is called a LOOP. Programmers use loops to save time and avoid mistakes!",

            steps: [
                {
                    title: "Step 1: The Problem",
                    content: "We have 5 trucks to check (numbered 0, 1, 2, 3, 4). Writing 'check truck 0', 'check truck 1'... five times is boring!",
                    example: "console.log(0);\nconsole.log(1);\nconsole.log(2); ← Too much work! 😫"
                },
                {
                    title: "Step 2: Loop to the Rescue!",
                    content: "A FOR loop repeats code automatically! It counts from a start number to an end number.",
                    example: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\n↑ This runs 5 times automatically! 🎉"
                },
                {
                    title: "Step 3: How It Works",
                    content: "Let's break it down:\n• 'let i = 0' → Start at truck 0\n• 'i < 5' → Keep going until we reach 5\n• 'i++' → Add 1 each time (0→1→2→3→4)\n• 'console.log(i)' → Show which truck we're checking",
                    example: "Loop runs:\ni=0 → prints 0\ni=1 → prints 1\n...until i=4!"
                }
            ],

            animations: [
                <div key="1" className="h-32 bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-lg p-4 border border-green-600/30">
                    <div className="text-center mb-2">
                        <div className="bg-gray-800 px-3 py-1 rounded font-mono text-sm text-green-400 inline-block">
                            for (let i = 0; i {'<'} 5; i++)
                        </div>
                    </div>
                    <div className="flex gap-2 justify-center items-center">
                        {[0, 1, 2, 3, 4].map((num) => (
                            <div key={num} className="text-center animate-bounce" style={{ animationDelay: `${num * 0.2}s` }}>
                                <div className="text-3xl">🚚</div>
                                <div className="bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mx-auto">
                                    {num}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-2 text-sm text-gray-300">
                        Loop processes all trucks automatically! 🔄
                    </div>
                </div>,

                <div key="2" className="h-32 bg-gradient-to-br from-teal-900/30 to-green-900/30 rounded-lg p-4 border border-teal-600/30 flex flex-col justify-center items-center">
                    <div className="text-4xl mb-2">🌍 ♻️ 🌳</div>
                    <div className="text-center">
                        <div className="text-green-400 font-bold">Materials Saved Today:</div>
                        <div className="text-2xl text-white font-black">5 Truck Loads!</div>
                        <div className="text-xs text-gray-400 mt-1">Kept out of landfills ✨</div>
                    </div>
                </div>
            ]
        },

        oxygen: {
            title: "💨 AIR QUALITY ACADEMY",
            tutor: "Scientist Vita",
            sdgGoals: [13, 3],

            intro: "Greetings, Planet Protector! 🛡️",
            storyIntro: "Earth's air is getting polluted! But we have hope - air quality sensors that detect harmful gases. Your mission? Learn to program the sensor to announce when it's successfully monitoring our atmosphere!",

            realWorldImpact: "Amazing Truth: Right now, thousands of air quality sensors around the world are protecting over 1 BILLION people by detecting pollution and warning communities! When you learn to print messages in code, you're learning the EXACT skill that makes these life-saving alerts possible!",

            conceptTitle: "Today's Superpower: OUTPUT 📢",
            conceptExplanation: "Computers need to communicate with us! When your code wants to show a message, we use special commands to PRINT or OUTPUT text. It's like giving the computer a voice!",

            steps: [
                {
                    title: "Step 1: Understanding Output",
                    content: "When a program needs to tell us something (like 'System Active'), it PRINTS text to the screen.",
                    example: "Think of it like a robot announcing:\n'BEEP! Sensors Online! BEEP!' 🤖"
                },
                {
                    title: "Step 2: The cout Command",
                    content: "In C++, we use 'std::cout' (say: 'see-out') to print messages. It's like the computer's megaphone!",
                    example: "std::cout << \"Hello!\";\n↓\nHello!  ← appears on screen"
                },
                {
                    title: "Step 3: Your Mission",
                    content: "You need to print exactly: 'Oxy-System: ACTIVE'\nThis tells scientists the air quality monitor is working!",
                    example: 'std::cout << "Oxy-System: ACTIVE" << std::endl;\n\n✅ Sensor activated! Air is being monitored! 🌍'
                }
            ],

            animations: [
                <div key="1" className="h-32 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-4 border border-cyan-600/30 flex items-center justify-center">
                    <div className="bg-black rounded-lg p-4 border-2 border-cyan-600 w-full">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-700">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-gray-500 text-xs ml-2">Air Quality Monitor</span>
                        </div>
                        <div className="font-mono text-sm">
                            <div className="text-gray-500">$ ./start_monitoring.sh</div>
                            <div className="text-green-400 animate-pulse mt-1">Oxy-System: ACTIVE</div>
                        </div>
                    </div>
                </div>,

                <div key="2" className="h-32 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-lg p-4 border border-blue-600/30">
                    <div className="text-center">
                        <div className="text-3xl mb-2">🏙️ 💨 ✅</div>
                        <div className="text-cyan-400 font-bold text-lg">City Protected!</div>
                        <div className="text-sm text-gray-300 mt-1">
                            Air quality: <span className="text-green-400">GOOD</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                            Sensors monitoring 24/7 for pollution
                        </div>
                    </div>
                </div>
            ]
        }
    };

    const currentLesson = lessons[academyType];
    const currentAnimation = currentLesson.animations[currentStep];
    const maxSteps = Math.max(currentLesson.steps.length, currentLesson.animations.length);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-[fade-in_0.3s_ease-out]">
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
            `}</style>

            <div className="w-full max-w-4xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-500 rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="text-3xl">{currentLesson.title.slice(0, 2)}</div>
                        <div>
                            <h2 className="text-white font-black text-xl tracking-tight uppercase">{currentLesson.title}</h2>
                            <p className="text-yellow-100 text-xs font-bold uppercase tracking-wide">Professor: {currentLesson.tutor}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <SDGBadgeGroup goals={currentLesson.sdgGoals} size="small" />
                        <button
                            onClick={closeTerminal}
                            className="bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors ml-2"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {/* Story Introduction */}
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-xl p-5 border-l-4 border-blue-500">
                                <div className="flex items-start gap-3">
                                    <div className="text-4xl">👋</div>
                                    <div>
                                        <h3 className="text-blue-300 font-bold text-lg mb-2">{currentLesson.intro}</h3>
                                        <p className="text-gray-200 leading-relaxed">{currentLesson.storyIntro}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-green-900/40 to-teal-900/40 rounded-xl p-5 border-l-4 border-green-500">
                                <div className="flex items-start gap-3">
                                    <div className="text-3xl">🌍</div>
                                    <div>
                                        <h3 className="text-green-300 font-bold text-lg mb-2">Real-World Impact</h3>
                                        <p className="text-gray-200 leading-relaxed text-sm">{currentLesson.realWorldImpact}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-yellow-900/40 to-orange-900/40 rounded-xl p-5 border-l-4 border-yellow-500">
                                <div className="flex items-start gap-3">
                                    <div className="text-3xl">⚡</div>
                                    <div className="flex-1">
                                        <h3 className="text-yellow-300 font-bold text-lg mb-2">{currentLesson.conceptTitle}</h3>
                                        <p className="text-gray-200 leading-relaxed">{currentLesson.conceptExplanation}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Learning Steps */}
                    {currentStep > 0 && currentStep <= currentLesson.steps.length && (
                        <div className="space-y-4">
                            {currentLesson.steps[currentStep - 1] && (
                                <>
                                    <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700">
                                        <h3 className="text-yellow-400 font-bold text-lg mb-3">
                                            {currentLesson.steps[currentStep - 1].title}
                                        </h3>
                                        <p className="text-gray-200 leading-relaxed mb-3">
                                            {currentLesson.steps[currentStep - 1].content}
                                        </p>
                                        <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 border border-green-900/50">
                                            <pre className="whitespace-pre-wrap">{currentLesson.steps[currentStep - 1].example}</pre>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Animation */}
                    <div className="mt-4">
                        {currentAnimation}
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="bg-gray-800 p-4 flex justify-between items-center border-t border-gray-700">
                    <div className="text-gray-400 text-sm">
                        Step {currentStep + 1} of {maxSteps + 1}
                    </div>
                    <div className="flex gap-2">
                        {currentStep > 0 && (
                            <button
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition-all"
                            >
                                ← Back
                            </button>
                        )}
                        {currentStep < maxSteps && (
                            <button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black py-2 px-6 rounded-lg shadow-lg transition-all"
                            >
                                Next →
                            </button>
                        )}
                        {currentStep === maxSteps && (
                            <button
                                onClick={closeTerminal}
                                className="bg-green-600 hover:bg-green-500 text-white font-black py-2 px-8 rounded-lg shadow-lg transition-all animate-pulse"
                            >
                                Start Challenge! 🚀
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
