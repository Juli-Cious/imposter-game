import { useGameStore } from '../../stores/useGameStore';

export const AcademyUI = () => {
    const { academyType, closeTerminal } = useGameStore();

    if (!academyType) return null;

    const lessons = {
        solar: {
            title: "SOLAR POWER ACADEMY",
            tutor: "Professor Doux",
            intro: "Hi! I'm Prof. Doux. Let's learn how to add energy!",
            concept: "We have two solar panels. To get the TOTAL power, we use the '+' sign. 5 + 10 = 15!",
            animation: (
                <div className="flex items-center justify-around h-32 bg-blue-900/30 rounded-lg p-4">
                    <div className="text-center animate-bounce">
                        <div className="text-3xl">☀️</div>
                        <div className="text-yellow-400 font-bold">5</div>
                    </div>
                    <div className="text-2xl font-bold">+</div>
                    <div className="text-center animate-bounce" style={{ animationDelay: '0.2s' }}>
                        <div className="text-3xl">☀️</div>
                        <div className="text-yellow-400 font-bold">10</div>
                    </div>
                    <div className="text-2xl font-bold">=</div>
                    <div className="relative animate-pulse">
                        <div className="text-4xl text-green-500">🔋</div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xl">15</div>
                    </div>
                </div>
            )
        },
        waste: {
            title: "RECYCLING ACADEMY",
            tutor: "Engineer Mort",
            intro: "Hello! I'm Mort. Let's learn how to repeat things!",
            concept: "Instead of saying 'Pick up trash' 5 times, we use a LOOP! It tells the robot to repeat the work for us.",
            animation: (
                <div className="h-32 bg-green-900/30 rounded-lg p-4 overflow-hidden relative">
                    <div className="flex gap-4 animate-[slide_4s_linear_infinite]">
                        {['📦', '📄', '🧴', '🥫', '📦'].map((item, i) => (
                            <div key={i} className="text-2xl">{item}</div>
                        ))}
                    </div>
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs font-mono border border-gray-600">
                        {"for (let i = 0; i < 5; i++)"}
                    </div>
                    <div className="absolute bottom-2 right-4 text-3xl animate-bounce">
                        🏗️
                    </div>
                </div>
            )
        },
        oxygen: {
            title: "OXYGEN ACADEMY",
            tutor: "Scientist Vita",
            intro: "Greetings! I'm Vita. Let's learn to give orders!",
            concept: "Computers need exact words. By printing 'Oxy-System: ACTIVE', you tell the machine exactly what to do!",
            animation: (
                <div className="flex flex-col items-center justify-center h-32 bg-teal-900/30 rounded-lg p-4">
                    <div className="bg-black p-2 font-mono text-green-500 rounded border border-green-800 mb-2">
                        std::cout &lt;&lt; "Oxy-System: ACTIVE" &lt;&lt; std::endl;
                    </div>
                    <div className="flex gap-4">
                        <div className="animate-pulse text-2xl">🫧</div>
                        <div className="animate-bounce text-2xl" style={{ animationDelay: '0.3s' }}>🌿</div>
                        <div className="animate-pulse text-2xl" style={{ animationDelay: '0.6s' }}>🫧</div>
                    </div>
                </div>
            )
        }
    };

    const currentLesson = lessons[academyType];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-[fade-in_0.3s_ease-out]">
            <style>{`
                @keyframes slide {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
            <div className="w-full max-w-md bg-gray-900 border-2 border-yellow-500 rounded-2xl p-6 shadow-2xl relative">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-yellow-400 font-black text-xl tracking-tighter uppercase">{currentLesson.title}</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{currentLesson.tutor}</p>
                    </div>
                    <button
                        onClick={closeTerminal}
                        className="bg-red-900/50 hover:bg-red-800 text-red-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center text-2xl border-2 border-yellow-400">
                            🦖
                        </div>
                        <div className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-tr-xl rounded-br-xl rounded-bl-sm font-bold text-sm">
                            {currentLesson.intro}
                        </div>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed italic">
                        "{currentLesson.concept}"
                    </p>
                </div>

                {currentLesson.animation}

                <div className="mt-6 flex justify-center">
                    <button
                        onClick={closeTerminal}
                        className="bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black py-3 px-8 rounded-full shadow-lg transform active:scale-95 transition-all uppercase tracking-tighter"
                    >
                        I Understand!
                    </button>
                </div>
            </div>
        </div>
    );
};
