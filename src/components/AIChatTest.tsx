import { useState } from 'react';
import { getChatResponse } from '../services/ai';
import type { ChatMessage } from "../services/ai";

const AIChatTest: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setError(null);

        try {
            const responseText = await getChatResponse(messages, input);
            const modelMessage: ChatMessage = { role: 'model', parts: [{ text: responseText }] };
            setMessages(prev => [...prev, modelMessage]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
            setInput('');
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-xl shadow-md space-y-4">
            <h2 className="text-xl font-bold">AI Chat Test</h2>
            <div className="h-64 overflow-y-auto bg-white p-2 rounded border border-gray-300">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-200'}`}>
                            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.parts[0].text}
                        </span>
                    </div>
                ))}
                {loading && <div className="text-gray-500 italic">Thinking...</div>}
                {error && <div className="text-red-500">Error: {error}</div>}
            </div>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 p-2 border border-gray-300 rounded"
                    placeholder="Type a message..."
                />
                <button
                    onClick={handleSend}
                    disabled={loading}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default AIChatTest;
