import { useState, useEffect } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { db } from '../../firebaseConfig';
import { ref, onValue, set, update } from 'firebase/database';
import { executeCode } from '../game/CodeRunner';
import { LEVEL_1_PROBLEMS } from '../../shared/ProblemData';
import Editor from '@monaco-editor/react';
import { ChallengeAnimation } from './ChallengeAnimation';
import { SDGBadgeGroup } from './SDGBadge';
import { MentorChat } from './MentorChat';
import { usePlayerProgress } from '../../stores/usePlayerProgress';

export const CodeEditor = () => {
    const { activeFileId, closeTerminal } = useGameStore();
    const { completeChallenge } = usePlayerProgress();
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState<'PENDING' | 'PASS' | 'FAIL'>('PENDING');

    // Mentor Chat state
    const [showMentorChat, setShowMentorChat] = useState(false);

    // Get problem definition
    const problem = activeFileId ? LEVEL_1_PROBLEMS[activeFileId] : null;
    const filename = problem ? problem.name : 'Loading...';
    const language = problem ? problem.language : 'javascript'; // Default to JS if unknown

    // 1. Subscribe to the specific file in Firebase
    useEffect(() => {
        if (!activeFileId) return;

        const fileRef = ref(db, `gamestate/files/${activeFileId}`);

        // Listen for changes (from other players!)
        const unsubscribe = onValue(fileRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setStatus(data.testStatus || 'PENDING');
                // Only update local text if we aren't currently typing (simple lock)
                // For a prototype, simply overwriting is fine
                if (document.activeElement?.tagName !== 'TEXTAREA') {
                    setCode(data.content);
                }
            }
        });

        return () => unsubscribe();
    }, [activeFileId]);

    // Listen for ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                closeTerminal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeTerminal]);

    // 2. Handle Typing (Auto-Save to Firebase)
    const handleEditorChange = (value: string | undefined) => {
        if (value === undefined) return;

        setCode(value);
        // Write to Firebase instantly
        if (activeFileId) {
            set(ref(db, `gamestate/files/${activeFileId}/content`), value);
        }
    };

    // 3. Run Code via Piston
    const handleRun = async () => {
        if (!problem || !activeFileId) return;

        setIsRunning(true);
        setOutput("Running...");
        setLastError(null); // Clear previous errors

        // Execute against the problem's expected output
        const result = await executeCode(problem.language, code, problem.expectedOutput);

        setOutput(result.output);
        setIsRunning(false);

        // Update Status in Firebase
        const newStatus = result.success ? 'PASS' : 'FAIL';
        setStatus(newStatus);

        // Track completion in player progress
        if (result.success && activeFileId) {
            completeChallenge(activeFileId);
        } else {
            // If failed, checking if it's an error vs just wrong output
            if (result.output.toLowerCase().includes('error')) {
                setLastError(result.output);
                // Optional: Auto-open chat or show a "Ask Gaia" button
            }
        }

        update(ref(db, `gamestate/files/${activeFileId}`), {
            testStatus: newStatus
        });
    };

    // Open Mentor Chat
    const handleOpenMentorChat = () => {
        setShowMentorChat(true);
    };


    // State for Error Decoder
    const [lastError, setLastError] = useState<string | null>(null);

    // Monaco Editor OnMount - Register Eco-Lens
    const handleEditorDidMount = (_editor: any, monaco: any) => {
        // Register the Eco-Lens Hover Provider
        monaco.languages.registerHoverProvider('javascript', {
            provideHover: function (model: any, position: any) {
                const word = model.getWordAtPosition(position);
                if (!word) return null;

                const keywords: Record<string, string> = {
                    'for': '🔄 **LOOPS = RECYCLING ROBOTS**\n\nJust like sorting 100 bottles one by one is hard, loops let us automate the process! One loop can sort millions of items automatically.',
                    'while': '🔄 **LOOPS = PERPETUAL ENERGY**\n\nKeeps running as long as a condition is true, like a solar panel generating power while the sun is shining! ☀️',
                    'if': '🤔 **DECISIONS = SMART SENSORS**\n\nLike a pollution sensor deciding: "IF air is dirty, turn on the fans!"',
                    'else': '🛤️ **ALTERNATIVES = BACKUP POWER**\n\n"ELSE, stay in standby mode." It gives our code a backup plan!',
                    'var': '📦 **VARIABLES = CONTAINERS**\n\nThink of this like a recycling bin. We put data inside to use it later!',
                    'let': '📦 **VARIABLES = REUSABLE CONTAINERS**\n\nA box we can empty and fill with something new later!',
                    'const': '🔒 **CONSTANTS = PERMANENT FOUNDATIONS**\n\nLike the foundation of a wind turbine - it shouldn\'t change once it\'s built!',
                    'function': '⚙️ **FUNCTIONS = FACTORIES**\n\nA special machine that takes ingredients (inputs) and makes something new (outputs)!',
                    'return': '📤 **RETURN = DELIVERY**\n\nSending the finished product out of the factory!',
                    'print': '📢 **PRINT = PUBLIC ANNOUNCEMENT**\n\nBroadcasting a message to the world!',
                    'console': '🖥️ **CONSOLE = MISSION CONTROL**\n\nThe dashboard where we see what\'s happening in our system.',
                    'log': '📝 **LOG = CAPTAIN\'S LOG**\n\nRecording an event in the ship\'s records.'
                };

                if (keywords[word.word]) {
                    return {
                        range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
                        contents: [
                            { value: '**🌍 ECO-LENS**' },
                            { value: keywords[word.word] }
                        ]
                    };
                }
                return null;
            }
        });

        // Similarly for Python if we switch languages
        monaco.languages.registerHoverProvider('python', {
            provideHover: function (model: any, position: any) {
                const word = model.getWordAtPosition(position);
                if (!word) return null;

                const keywords: Record<string, string> = {
                    'for': '🔄 **LOOPS = RECYCLING ROBOTS**\n\nJust like sorting 100 bottles one by one is hard, loops let us automate the process! One loop can sort millions of items automatically.',
                    'while': '🔄 **LOOPS = PERPETUAL ENERGY**\n\nKeeps running as long as a condition is true, like a solar panel generating power while the sun is shining! ☀️',
                    'def': '⚙️ **DEF = BUILD MACHINE**\n\nDefining a new machine (function) that allows us to do a specific task repeatedly.',
                    'print': '📢 **PRINT = BROADCAST**\n\nSending a signal to the monitoring station!',
                    'if': '🤔 **DECISIONS = SMART SENSORS**\n\nLike a pollution sensor deciding: "IF air is dirty, turn on the fans!"',
                };
                if (keywords[word.word]) {
                    return {
                        range: new monaco.Range(position.lineNumber, word.startColumn, position.lineNumber, word.endColumn),
                        contents: [
                            { value: '**🌍 ECO-LENS**' },
                            { value: keywords[word.word] }
                        ]
                    };
                }
                return null;
            }
        });
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 p-10">
            <div className="bg-[#1e1e1e] w-full h-full max-w-6xl border border-gray-600 flex flex-col shadow-2xl">

                {/* Header (VS Code Style) */}
                <div className="bg-[#252526] p-2 flex justify-between items-center border-b border-black">
                    <div className="flex items-center gap-2">
                        <span className="text-white text-sm font-sans px-4 bg-[#1e1e1e] py-1 border-t border-blue-500">
                            {filename}
                        </span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${status === 'PASS' ? 'bg-green-900/50 text-green-300 border-green-700' :
                            status === 'FAIL' ? 'bg-red-900/50 text-red-300 border-red-700' : 'bg-yellow-900/50 text-yellow-300 border-yellow-700'
                            }`}>
                            {status}
                        </span>
                        {problem && problem.sdgGoals && (
                            <div className="ml-2">
                                <SDGBadgeGroup goals={problem.sdgGoals} size="small" />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={handleOpenMentorChat}
                            className="px-3 py-1 text-xs bg-purple-700 hover:bg-purple-600 text-white rounded flex items-center gap-1 transition-colors"
                        >
                            💬 Chat with Professor Gaia
                        </button>
                        <button
                            onClick={handleRun}
                            disabled={isRunning}
                            className={`px-3 py-0.5 text-xs text-white ${isRunning ? 'bg-gray-600' : 'bg-green-700 hover:bg-green-600'} rounded`}
                        >
                            {isRunning ? 'Running...' : '▶ RUN'}
                        </button>
                        <button onClick={closeTerminal} className="text-gray-400 hover:text-white px-2">✖</button>
                    </div>
                </div>

                {/* Environmental Context Panel */}
                {problem && (
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 border-b border-gray-700">
                        <div className="flex gap-4 items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-blue-400 text-xs font-bold">🌍 YOUR MISSION:</span>
                                </div>
                                <p className="text-gray-300 text-xs leading-relaxed">{problem.storyContext}</p>
                            </div>
                            <div className="flex-1 border-l border-gray-700 pl-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-green-400 text-xs font-bold">🎯 LEARNING:</span>
                                </div>
                                <p className="text-gray-300 text-xs leading-relaxed">{problem.detailedInstructions.split('\n')[0]}</p>
                            </div>
                        </div>
                        <div className="mt-2 bg-green-900/20 rounded px-2 py-1 border-l-2 border-green-500">
                            <span className="text-green-400 text-[10px] font-bold">💚 IMPACT: </span>
                            <span className="text-gray-300 text-[10px]">{problem.environmentalImpact}</span>
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-hidden flex">
                    {/* Code Editor - Left Side */}
                    <div className="flex-1 min-w-0">
                        <Editor
                            key={activeFileId} // Force remount on file change
                            height="100%"
                            language={language}
                            path={`file:///${filename}`} // Absolute path helps Monaco
                            theme="vs-dark"
                            value={code}
                            onChange={handleEditorChange}
                            onMount={handleEditorDidMount}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                            }}
                        />
                    </div>

                    {/* Animation Panel - Right Side */}
                    <div className="w-96 flex-shrink-0">
                        <ChallengeAnimation challengeId={activeFileId || ''} status={status} output={output} />
                    </div>
                </div>

                {/* Output Console */}
                <div className="h-32 bg-[#1e1e1e] border-t border-gray-700 p-2 font-mono text-sm overflow-auto">
                    <div className="text-gray-500 text-xs mb-1">TERMINAL OUTPUT:</div>
                    <pre className={`${output.includes('❌') ? 'text-red-400' : 'text-gray-300'}`}>
                        {output || "Ready to execute."}
                    </pre>
                </div>

                {/* Footer */}
                <div className="bg-[#007acc] text-white text-xs p-1 px-4 flex justify-between">
                    <span>{language.toUpperCase()}</span>
                    <span>Ln {code.split('\n').length}, Col 1</span>
                </div>
            </div>

            {/* AI Mentor Chat */}
            <MentorChat
                isOpen={showMentorChat}
                onClose={() => {
                    setShowMentorChat(false);
                    setLastError(null);
                }}
                challengeId={activeFileId || undefined}
                challengeDescription={problem?.description}
                currentCode={code}
                initialError={lastError || undefined}
            />
        </div>
    );
};