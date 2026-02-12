import React, { useState, useEffect } from 'react';
import { useMeetingStore } from '../../stores/useMeetingStore';
import { useGameStore } from '../../stores/useGameStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { LEVEL_1_PROBLEMS } from '../../shared/ProblemData';
import { ref, update } from 'firebase/database';
import { db } from '../../firebaseConfig';

declare global {
    interface Window {
        monaco: any;
    }
}

export const MeetingUI = () => {
    const { status, meetingEndTime, presenterId, highlightedLine, chatMessages, votes } = useMeetingStore();
    const { network, playerId, isHost, roomCode } = useGameStore();
    const { players } = usePlayerStore();

    const [selectedFile] = useState<string>(Object.keys(LEVEL_1_PROBLEMS)[0]);
    const selectedFileRef = React.useRef(selectedFile);
    const [timeLeft, setTimeLeft] = useState(0);
    const [chatInput, setChatInput] = useState('');
    const [hasVoted, setHasVoted] = useState(false);
    const [resultMessage, setResultMessage] = useState<string | null>(null);

    // Editor Ref
    const editorRef = React.useRef<any>(null);
    const decorationsRef = React.useRef<string[]>([]);

    useEffect(() => {
        selectedFileRef.current = selectedFile;
    }, [selectedFile]);

    // Timer Logic
    useEffect(() => {
        if (status === 'IDLE') {
            setTimeLeft(0);
            setResultMessage(null);
            return;
        }

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((meetingEndTime - Date.now()) / 1000));
            setTimeLeft(remaining);

            // Host checks for end of meeting
            if (isHost && remaining === 0 && status === 'DISCUSSION') {
                handleMeetingEnd();
            }
        }, 100);

        return () => clearInterval(interval);
    }, [status, meetingEndTime, isHost]);

    // Check if I voted
    useEffect(() => {
        if (playerId && votes[playerId]) {
            setHasVoted(true);
        } else {
            setHasVoted(false);
        }
    }, [votes, playerId]);

    // Host Logic: Calculate Results
    const handleMeetingEnd = async () => {
        if (!roomCode) return;

        // 1. Tally Votes
        const voteCounts: Record<string, number> = {};
        let skipCount = 0;

        Object.values(votes).forEach(votedId => {
            if (votedId === 'skip') skipCount++;
            else voteCounts[votedId] = (voteCounts[votedId] || 0) + 1;
        });

        // 2. Determine Result
        let maxVotes = 0;
        let candidate: string | null = null;
        let isTie = false;

        Object.entries(voteCounts).forEach(([id, count]) => {
            if (count > maxVotes) {
                maxVotes = count;
                candidate = id;
                isTie = false;
            } else if (count === maxVotes) {
                isTie = true;
            }
        });

        // 3. Apply Result
        if (skipCount >= maxVotes || isTie || !candidate) {
            // Skip
            update(ref(db, `rooms/${roomCode}/meeting`), { status: 'RESULTS', result: 'Skipped' });
        } else {
            // Eject
            const ejectedPlayer = players.find(p => p.id === candidate);
            if (ejectedPlayer) {
                // Update player status
                const updates: any = {};
                updates[`rooms/${roomCode}/players/${candidate}/isAlive`] = false;

                // Redemption Arc: If Imposter, they become Reformed
                if (ejectedPlayer.role === 'imposter') {
                    updates[`rooms/${roomCode}/players/${candidate}/status`] = 'reformed';
                    updates[`rooms/${roomCode}/players/${candidate}/role`] = 'reformed';
                    setResultMessage(`${ejectedPlayer.name} was the Imposter! They are now Reformed.`);
                } else {
                    updates[`rooms/${roomCode}/players/${candidate}/status`] = 'ejected';
                    setResultMessage(`${ejectedPlayer.name} was NOT the Imposter.`);
                }

                update(ref(db), updates);

                update(ref(db, `rooms/${roomCode}/meeting`), {
                    status: 'RESULTS',
                    result: ejectedPlayer.role === 'imposter' ? 'IMPOSTER CAUGHT' : 'INNOCENT EJECTED'
                });
            }
        }

        // 4. Reset after delay
        setTimeout(() => {
            update(ref(db, `rooms/${roomCode}/meeting`), {
                status: 'IDLE',
                votes: {},
                highlightedLine: null
            });
        }, 5000); // 5s result screen
    };

    const handleVote = (candidateId: string) => {
        if (hasVoted || !network || status !== 'DISCUSSION') return;
        network.vote(playerId!, candidateId);
    };

    // Blame Code Highlighting (Same as before)
    useEffect(() => {
        if (!editorRef.current || !window.monaco) return;
        const model = editorRef.current.getModel();
        if (!model) return;

        if (highlightedLine !== null && highlightedLine.fileId === selectedFile) {
            decorationsRef.current = model.deltaDecorations(decorationsRef.current, [{
                range: new window.monaco.Range(highlightedLine.line, 1, highlightedLine.line, 1),
                options: { isWholeLine: true, className: 'blame-line-highlight', glyphMarginClassName: 'blame-glyph' }
            }]);
            editorRef.current.revealLineInCenter(highlightedLine.line);
        } else {
            decorationsRef.current = model.deltaDecorations(decorationsRef.current, []);
        }
    }, [highlightedLine, selectedFile]);

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !network) return;
        network.sendChatMessage(chatInput.trim());
        setChatInput('');
    };

    // Trigger Meeting (Emergency Button)
    const handleStartMeeting = () => {
        if (network && playerId) {
            network.startMeeting(playerId);
        }
    }

    // --- RENDER ---

    // 1. IDLE (Show Button)
    if (status === 'IDLE') {
        return (
            <button
                onClick={handleStartMeeting} // NOW REAL TRIGGER
                className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-red-500 transition-all animate-bounce border-2 border-red-400"
                title="EMERGENCY MEETING"
            >
                🚨
            </button>
        )
    }

    // 2. ACTIVE MEETING (Overlay)
    const currentFileContent = LEVEL_1_PROBLEMS[selectedFile]?.content || "// File not found";

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="fixed inset-0 z-50 bg-gray-900/95 flex flex-col"
            >
                {/* Header */}
                <div className="bg-red-900/40 border-b-4 border-red-600 p-4 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-red-500/10 animate-pulse"></div>
                    <div className="z-10 flex items-center gap-4">
                        <h1 className="text-4xl font-black text-white italic tracking-widest shadow-black drop-shadow-lg">
                            EMERGENCY MEETING
                        </h1>
                        <div className="bg-black/50 px-3 py-1 rounded text-red-400 font-mono">
                            Status: {status}
                        </div>
                    </div>
                    <div className="z-10 text-5xl font-mono text-white font-bold">
                        {timeLeft}s
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT: VOTING AREA */}
                    <div className="w-1/2 p-8 overflow-y-auto bg-gray-800/50 flex flex-col gap-4">
                        <h2 className="text-2xl font-bold text-center mb-4 text-gray-300">WHO IS THE IMPOSTER?</h2>

                        <div className="grid grid-cols-2 gap-4">
                            {players.map(player => {
                                const isMe = player.id === playerId;
                                const hasPlayerVoted = Object.keys(votes).includes(player.id);
                                const myVote = votes[playerId!] === player.id;

                                return (
                                    <button
                                        key={player.id}
                                        disabled={hasVoted || !player.isAlive} // Dead men tell no tales
                                        onClick={() => handleVote(player.id)}
                                        className={`relative p-4 rounded-xl border-2 transition-all flex items-center gap-4
                                            ${!player.isAlive ? 'opacity-50 grayscale border-gray-700 bg-gray-900 cursor-not-allowed' :
                                                hasVoted ? 'border-gray-600 bg-gray-800 cursor-default' :
                                                    'border-gray-500 bg-gray-700 hover:border-red-500 hover:bg-red-900/20 active:scale-95 cursor-pointer'}
                                            ${myVote ? 'border-green-500 ring-2 ring-green-500/50' : ''}
                                        `}
                                    >
                                        {/* Avatar */}
                                        <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-gray-900 relative">
                                            {/* Sprite preview could go here */}
                                            <div className="absolute inset-0 flex items-center justify-center font-bold text-xl" style={{ color: player.color }}>
                                                {player.name.charAt(0)}
                                            </div>
                                        </div>

                                        <div className="text-left flex-1">
                                            <div className="font-bold text-lg">{player.name} {isMe && "(YOU)"}</div>
                                            <div className="text-xs text-gray-400">
                                                {player.isAlive ? (hasPlayerVoted ? "Voted" : "Thinking...") : "DEAD"}
                                            </div>
                                        </div>

                                        {/* Status Indicators */}
                                        {hasPlayerVoted && player.isAlive && (
                                            <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold">
                                                VOTED
                                            </div>
                                        )}
                                        {!player.isAlive && (
                                            <div className="bg-red-900/50 text-red-500 px-2 py-1 rounded text-xs font-bold">
                                                DEAD
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Skip Button */}
                        <div className="mt-auto pt-4 border-t border-gray-700">
                            <button
                                disabled={hasVoted}
                                onClick={() => handleVote('skip')}
                                className={`w-full py-4 rounded-xl font-bold text-xl transition-all
                                    ${hasVoted ? 'bg-gray-700 text-gray-500 cursor-default' : 'bg-gray-600 hover:bg-gray-500 text-white hover:scale-[1.02]'}
                                `}
                            >
                                SKIP VOTE 💨
                            </button>
                        </div>
                    </div>

                    {/* RIGHT: EVIDENCE & CHAT */}
                    <div className="w-1/2 flex flex-col border-l border-gray-700 bg-gray-900">
                        {/* Tabs */}
                        <div className="flex bg-gray-800 border-b border-gray-700">
                            <div className="px-6 py-3 font-bold text-cyan-400 border-b-2 border-cyan-400">
                                EVIDENCE (CODE)
                            </div>
                            <div className="px-6 py-3 font-bold text-gray-500 hover:text-gray-300 cursor-pointer">
                                CHAT
                            </div>
                        </div>

                        {/* Editor View */}
                        <div className="flex-1 relative bg-[#1e1e1e]">
                            <Editor
                                height="100%"
                                defaultLanguage="javascript"
                                language={LEVEL_1_PROBLEMS[selectedFile]?.language || 'javascript'}
                                theme="vs-dark"
                                value={currentFileContent}
                                options={{
                                    readOnly: true,
                                    domReadOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 12,
                                    lineHeight: 18,
                                    renderLineHighlight: 'all'
                                }}
                                onMount={(editor, monaco) => {
                                    editorRef.current = editor;
                                    window.monaco = monaco;
                                    // Click to Highlight Logic
                                    editor.onMouseDown((e: any) => {
                                        if (network?.playerId === presenterId && [2, 3, 4, 6, 7].includes(e.target.type)) {
                                            network.highlightLine(selectedFile, e.target.position.lineNumber);
                                        }
                                    });
                                }}
                            />

                            {/* Chat Overlay (Bottom) */}
                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gray-900/90 border-t border-gray-700 flex flex-col">
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    {chatMessages.map(msg => (
                                        <div key={msg.id} className="text-sm">
                                            <span className="font-bold text-cyan-400">{msg.playerName}: </span>
                                            <span className="text-gray-300">{msg.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleSendChat} className="p-2 border-t border-gray-700 flex gap-2">
                                    <input
                                        value={chatInput}
                                        onChange={e => setChatInput(e.target.value)}
                                        className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                                        placeholder="Discuss..."
                                    />
                                    <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded text-white font-bold">SEND</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RESULTS OVERLAY */}
                {status === 'RESULTS' && (
                    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center animate-fadeIn">
                        <h1 className="text-6xl font-black text-white mb-8 tracking-tighter">
                            {resultMessage || "VOTING COMPLETE"}
                        </h1>
                        <div className="text-2xl text-gray-400 animate-pulse">
                            Procedding...
                        </div>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
};
