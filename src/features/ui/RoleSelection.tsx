import React from 'react';
import { useGameStore } from '../../stores/useGameStore';

const RoleSelection: React.FC = () => {
    const { setPlayerRole, setPlayerLanguage, setGameState } = useGameStore();

    const handleSelect = (role: 'data_scientist' | 'web_activist' | 'systems_engineer', lang: 'python' | 'javascript' | 'cpp') => {
        setPlayerRole(role);
        setPlayerLanguage(lang);
        setGameState('LOBBY'); // Proceed to Lobby after selection
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white p-4">
            <h1 className="text-4xl font-bold mb-8 text-green-400">Choose Your Hero Class</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">

                {/* Python Role */}
                <div
                    onClick={() => handleSelect('data_scientist', 'python')}
                    className="bg-gray-800 p-6 rounded-xl border-2 border-yellow-500 hover:bg-gray-700 cursor-pointer transition-all hover:scale-105"
                >
                    <div className="text-6xl mb-4">🐍</div>
                    <h2 className="text-2xl font-bold text-yellow-400 mb-2">Data Scientist</h2>
                    <p className="text-sm text-gray-400 mb-4">Language: <strong>Python</strong></p>
                    <p className="italic">"Analyze pollution data and automate cleanup bots."</p>
                    <ul className="mt-4 text-sm list-disc list-inside text-gray-300">
                        <li>Automate tasks with Loops</li>
                        <li>Process environmental data</li>
                        <li>Easy to read syntax</li>
                    </ul>
                </div>

                {/* JS Role */}
                <div
                    onClick={() => handleSelect('web_activist', 'javascript')}
                    className="bg-gray-800 p-6 rounded-xl border-2 border-blue-500 hover:bg-gray-700 cursor-pointer transition-all hover:scale-105"
                >
                    <div className="text-6xl mb-4">🌐</div>
                    <h2 className="text-2xl font-bold text-blue-400 mb-2">Web Activist</h2>
                    <p className="text-sm text-gray-400 mb-4">Language: <strong>JavaScript</strong></p>
                    <p className="italic">"Connect global systems and spread awareness."</p>
                    <ul className="mt-4 text-sm list-disc list-inside text-gray-300">
                        <li>Build interactive dashboards</li>
                        <li>Manage network communications</li>
                        <li>Run everywhere (Web)</li>
                    </ul>
                </div>

                {/* C++ Role */}
                <div
                    onClick={() => handleSelect('systems_engineer', 'cpp')}
                    className="bg-gray-800 p-6 rounded-xl border-2 border-purple-500 hover:bg-gray-700 cursor-pointer transition-all hover:scale-105"
                >
                    <div className="text-6xl mb-4">⚙️</div>
                    <h2 className="text-2xl font-bold text-purple-400 mb-2">Systems Engineer</h2>
                    <p className="text-sm text-gray-400 mb-4">Language: <strong>C++</strong></p>
                    <p className="italic">"Optimize energy grids and recycling machinery."</p>
                    <ul className="mt-4 text-sm list-disc list-inside text-gray-300">
                        <li>High performance control</li>
                        <li>Hardware interface</li>
                        <li>Strict & powerful</li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

export default RoleSelection;
