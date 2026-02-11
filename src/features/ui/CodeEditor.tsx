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
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [status, setStatus] = useState<'PENDING' | 'PASS' | 'FAIL'>('PENDING');

    // Hint system state
    const [showHintModal, setShowHintModal] = useState(false);
    const [currentHint, setCurrentHint] = useState('');
    const [hintLevel, setHintLevel] = useState<'gentle' | 'specific' | 'solution'>('gentle');
    const [isLoadingHint, setIsLoadingHint] = useState(false);
    const [hintError, setHintError] = useState('');

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
        }

        update(ref(db, `gamestate/files/${activeFileId}`), {
            testStatus: newStatus
        });
    };

    // Open Mentor Chat
    const handleOpenMentorChat = () => {
        setShowMentorChat(true);
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
                        <ChallengeAnimation challengeId={activeFileId || ''} isRunning={isRunning} />
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
                onClose={() => setShowMentorChat(false)}
                challengeId={activeFileId || undefined}
                challengeDescription={problem?.description}
                currentCode={code}
            />
        </div>
    );
};