import React, { useState } from 'react';
import { useGameStore } from '../../stores/useGameStore';
import { explainConcept } from '../../services/ai';

export const SchoolTerminal = () => {
    const { closeTerminal } = useGameStore();
    const [topic, setTopic] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const topics = ['Loops', 'Variables', 'Functions', 'If/Else', 'Arrays'];

    const handleAsk = async (selectedTopic: string) => {
        setTopic(selectedTopic);
        setLoading(true);
        setResponse('');
        try {
            const result = await explainConcept(selectedTopic, 'English');
            setResponse(result);
        } catch (err) {
            setResponse("The Professor is currently offline. (AI Error)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 p-4">
            <div className="bg-blue-50 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        🎓 The Academy
                    </h2>
                    <button
                        onClick={closeTerminal}
                        className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm transition-colors"
                    >
                        Close [ESC]
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 flex gap-6">

                    {/* Sidebar / Topics */}
                    <div className="w-1/3 border-r border-blue-200 pr-4">
                        <h3 className="font-bold text-gray-700 mb-4">Select a Topic:</h3>
                        <div className="space-y-2">
                            {topics.map(t => (
                                <button
                                    key={t}
                                    onClick={() => handleAsk(t)}
                                    disabled={loading}
                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all ${topic === t
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'bg-white hover:bg-blue-100 text-gray-700 border border-gray-200'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Custom Question */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">Or ask something specific:</p>
                            <input
                                type="text"
                                placeholder="Type topic..."
                                className="w-full border p-2 rounded mb-2 text-sm text-black"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAsk(e.currentTarget.value)
                                }}
                            />
                        </div>
                    </div>

                    {/* Main Display */}
                    <div className="w-2/3 flex flex-col">
                        <h3 className="font-bold text-gray-700 mb-2">Professor AI says:</h3>
                        <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4 custom-scrollbar overflow-y-auto min-h-[300px]">
                            {loading ? (
                                <div className="flex items-center justify-center h-full text-blue-400 animate-pulse">
                                    Parsing Knowledge Base...
                                </div>
                            ) : response ? (
                                <div className="prose prose-sm max-w-none text-black">
                                    {/* Simple markdown rendering could be added here, for now just pre-wrap */}
                                    <pre className="whitespace-pre-wrap font-sans text-sm">{response}</pre>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 italic">
                                    Select a topic to begin your lesson.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
