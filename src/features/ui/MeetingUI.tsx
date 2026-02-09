import React, { useState, useEffect } from 'react';
import { useMeetingStore } from '../../stores/useMeetingStore';
import { useGameStore } from '../../stores/useGameStore';
import Editor from '@monaco-editor/react';
import { LEVEL_1_PROBLEMS } from '../../shared/ProblemData';

declare global {
    interface Window {
        monaco: any;
    }
}

export const MeetingUI = () => {
    const { status, meetingEndTime, presenterId, highlightedLine, chatMessages } = useMeetingStore();
    const { network } = useGameStore();

    const [selectedFile, setSelectedFile] = useState<string>(Object.keys(LEVEL_1_PROBLEMS)[0]);
    const selectedFileRef = React.useRef(selectedFile); // Ref to track current file in callbacks

    useEffect(() => {
        selectedFileRef.current = selectedFile;
    }, [selectedFile]);

    const [isExpanded, setIsExpanded] = useState(true);
    const [showChat, setShowChat] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [chatInput, setChatInput] = useState('');

    // Editor Ref for decorations
    const editorRef = React.useRef<any>(null);
    const decorationsRef = React.useRef<string[]>([]);



    // Timer Logic
    useEffect(() => {
        if (status === 'IDLE') {
            setTimeLeft(0);
            return;
        }

        const interval = setInterval(() => {
            const remaining = Math.max(0, Math.ceil((meetingEndTime - Date.now()) / 1000));
            setTimeLeft(remaining);
        }, 100);

        return () => clearInterval(interval);
    }, [status, meetingEndTime]);

    // Blame Code Highlighting
    useEffect(() => {
        if (!editorRef.current || !window.monaco) return;

        const model = editorRef.current.getModel();
        if (!model) return;

        if (highlightedLine !== null && highlightedLine.fileId === selectedFile) {
            decorationsRef.current = model.deltaDecorations(decorationsRef.current, [
                {
                    range: new window.monaco.Range(highlightedLine.line, 1, highlightedLine.line, 1),
                    options: {
                        isWholeLine: true,
                        className: 'blame-line-highlight',
                        glyphMarginClassName: 'blame-glyph'
                    }
                }
            ]);
            editorRef.current.revealLineInCenter(highlightedLine.line);
        } else {
            decorationsRef.current = model.deltaDecorations(decorationsRef.current, []);
        }

    }, [highlightedLine, selectedFile]);


    // If status is IDLE, we don't show anything
    if (status === 'IDLE') return null;



    // Toggle handling
    if (!isExpanded) {
        return (
            <button
                onClick={() => setIsExpanded(true)}
                className="fixed bottom-4 right-4 bg-cyan-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-cyan-500 transition-all animate-bounce"
                title="Open Meeting Details"
            >
                🚨
            </button>
        )
    }

    const currentFileContent = LEVEL_1_PROBLEMS[selectedFile]?.content || "// File not found";

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !network) return;
        network.sendChatMessage(chatInput.trim());
        setChatInput('');
    };

    return (
        <div className={`fixed top-0 right-0 h-full bg-gray-900/95 border-l-2 border-cyan-500 shadow-2xl z-50 flex flex-col transition-all duration-300 ${showChat ? 'w-[60%] min-w-[600px]' : 'w-[40%] min-w-[500px]'}`}>

            {/* Header */}
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="cursor-pointer" onClick={() => setIsExpanded(false)}>
                        <h1 className="text-xl font-bold text-cyan-400 hover:text-cyan-300">EMERGENCY MEETING</h1>
                        <p className="text-gray-400 text-xs">Status: <span className="text-white">{status}</span></p>
                    </div>
                    <button
                        onClick={() => setShowChat(!showChat)}
                        className={`px-2 py-1 text-xs rounded border ${showChat ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                    >
                        {showChat ? 'Hide Chat' : 'Show Chat'} 💬
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-3xl font-mono text-red-500 animate-pulse">
                        {timeLeft}s
                    </div>
                    <button className="text-gray-500 hover:text-white" onClick={() => setIsExpanded(false)}>▶</button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Code Projector */}
                <div className={`${showChat ? 'w-[60%]' : 'w-full'} flex flex-col border-r border-gray-700 transition-all duration-300`}>
                    {/* File Tabs */}
                    <div className="flex bg-gray-800 border-b border-gray-700 overflow-x-auto scrollbar-hide">
                        {Object.entries(LEVEL_1_PROBLEMS).map(([key, problem]) => (
                            <button
                                key={key}
                                onClick={(e) => { e.stopPropagation(); setSelectedFile(key); }}
                                className={`px-3 py-2 text-xs whitespace-nowrap ${selectedFile === key ? 'bg-[#1e1e1e] text-cyan-400 border-t-2 border-cyan-400' : 'text-gray-400 hover:bg-gray-700'}`}
                            >
                                {problem.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 bg-[#1e1e1e] relative">
                        <Editor
                            height="100%"
                            defaultLanguage="python"
                            language={LEVEL_1_PROBLEMS[selectedFile]?.language || 'javascript'}
                            theme="vs-dark"
                            value={currentFileContent}
                            options={{
                                readOnly: true,
                                domReadOnly: true, // Helps prevent keyboard capture
                                minimap: { enabled: false },
                                fontSize: 13,
                                lineHeight: 20,
                                scrollBeyondLastLine: false,
                                glyphMargin: true,
                                renderLineHighlight: 'all' // Highlight full line
                            }}
                            onMount={(editor, monaco) => {
                                editorRef.current = editor;
                                window.monaco = monaco;

                                editor.onMouseDown((e: any) => {
                                    const isPresenter = network?.playerId === presenterId;
                                    if (isPresenter) {
                                        if ([2, 3, 4, 6, 7].includes(e.target.type)) {
                                            const line = e.target.position.lineNumber;
                                            if (network) {
                                                network.highlightLine(selectedFileRef.current, line);
                                            }
                                        }
                                    }
                                });
                            }}
                        />
                    </div>
                </div>

                {/* Right: Chat & Info */}
                {showChat && (
                    <div className="w-[40%] flex flex-col bg-gray-800/50 transition-all duration-300">

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar flex flex-col">
                            <div className="text-center text-gray-500 text-xs italic mb-2">
                                System: Meeting started. Discuss!
                            </div>
                            {chatMessages.map(msg => (
                                <div key={msg.id} className="bg-gray-700/50 p-2 rounded text-sm">
                                    <p className={`font-bold text-xs ${msg.playerId === network?.['playerId'] ? 'text-cyan-400' : 'text-purple-400'}`}>
                                        {msg.playerName || 'Unknown'} <span className="text-gray-500 font-normal opacity-50 text-[10px]">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                    </p>
                                    <p className="text-gray-200 break-words whitespace-pre-wrap">{msg.text}</p>
                                </div>
                            ))}
                        </div>

                        {/* Chat Input */}
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSendChat(e); }}
                            className="p-2 border-t border-gray-700 bg-gray-800"
                        >
                            <textarea
                                value={chatInput}
                                onChange={(e) => {
                                    setChatInput(e.target.value);
                                    // Auto-grow
                                    e.target.style.height = 'auto';
                                    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'; // Max 100px
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendChat(e);
                                    }
                                }}
                                placeholder="Type a message..."
                                rows={1}
                                className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 resize-none overflow-hidden"
                            />
                            <p className="text-[10px] text-gray-500 mt-1 text-right">Enter to send, Shift+Enter for new line</p>
                        </form>

                        {/* Voting Controls (Mini) */}
                        <div className="p-2 border-t border-gray-700 bg-gray-700/30">
                            <p className="text-xs text-gray-400 mb-1 text-center font-bold">VOTE</p>
                            <div className="grid grid-cols-3 gap-1">
                                {['Blue', 'Red', 'Green'].map(p => (
                                    <button key={p} className="p-1 bg-gray-600 rounded hover:bg-red-900/50 text-xs">
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
