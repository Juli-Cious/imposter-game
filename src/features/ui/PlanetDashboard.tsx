import { usePlayerProgress } from '../../stores/usePlayerProgress';
import { SDGBadgeGroup } from './SDGBadge';

export const PlanetDashboard = () => {
    const { totalImpact, getCompletionPercentage } = usePlayerProgress();
    const percent = getCompletionPercentage();

    // Visual state based on progress
    // 0-30%: Dirty, Brown/Grey
    // 30-70%: Healing, Green/Blue returning
    // 70-100%: Thriving, glowing, satellites

    const getPlanetColor = () => {
        if (percent < 30) return '#4B4B4B'; // Grey/Dead
        if (percent < 70) return '#4A6741'; // Healing
        return '#1E88E5'; // Blue/Clean
    };

    const getAtmosphereOpacity = () => {
        // Less pollution (opacity) as percent goes up
        return Math.max(0.1, 1 - (percent / 100));
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-8 items-center">

            {/* Visual Planet Representation */}
            <div className="relative w-64 h-64 flex-shrink-0">
                {/* 1. Atmosphere / Pollution Haze */}
                <div
                    className="absolute inset-[-20px] rounded-full blur-xl transition-all duration-1000"
                    style={{
                        backgroundColor: percent < 50 ? '#3e2723' : '#4fc3f7',
                        opacity: getAtmosphereOpacity()
                    }}
                />

                {/* 2. Planet Base */}
                <div
                    className="absolute inset-0 rounded-full shadow-inner overflow-hidden transition-colors duration-1000"
                    style={{ backgroundColor: getPlanetColor() }}
                >
                    {/* Continents (Simple CSS Shapes for aesthetics) */}
                    <div className="absolute top-4 left-8 w-16 h-20 bg-black/20 rounded-full blur-sm" />
                    <div className="absolute bottom-8 right-12 w-24 h-24 bg-black/20 rounded-full blur-sm" />

                    {/* Greenery - Appearing as we progress */}
                    <div
                        className="absolute inset-0 transition-opacity duration-1000"
                        style={{ opacity: percent / 100 }}
                    >
                        {/* Land turning green */}
                        <div className="absolute top-4 left-8 w-16 h-20 bg-green-600/60 rounded-full blur-xs" />
                        <div className="absolute bottom-8 right-12 w-24 h-24 bg-green-500/60 rounded-full blur-xs" />
                    </div>
                </div>

                {/* 3. Orbiting Elements (Satellites/Clouds) */}
                <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
                    {/* Clouds if dirty */}
                    {percent < 70 && (
                        <>
                            <div className="absolute top-0 left-1/2 w-12 h-4 bg-gray-400/50 rounded-full blur-sm" />
                            <div className="absolute bottom-4 right-1/4 w-16 h-6 bg-gray-500/50 rounded-full blur-md" />
                        </>
                    )}

                    {/* Satellites if clean */}
                    {percent > 60 && (
                        <div className="absolute -top-4 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_cyan]" />
                    )}
                </div>

                {/* Status Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center drop-shadow-md">
                        <div className="text-4xl font-black text-white">{percent}%</div>
                        <div className="text-[10px] uppercase font-bold text-gray-200 tracking-widest">Restored</div>
                    </div>
                </div>
            </div>

            {/* Stats Panel */}
            <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-6 w-full">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">GLOBAL IMPACT DASHBOARD</h2>
                        <p className="text-gray-400 text-sm">Real-time environmental monitoring</p>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${percent === 100 ? 'bg-green-500 text-black' : 'bg-yellow-600/50 text-yellow-200'
                            }`}>
                            {percent === 100 ? 'PLANET SAVED' : 'RESTORATION IN PROGRESS'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {/* CO2 Stat */}
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">☁️</span>
                            <span className="text-gray-400 text-xs font-bold uppercase">CO₂ Prevented</span>
                        </div>
                        <div className="text-2xl font-mono text-cyan-300">
                            {totalImpact.co2Prevented} <span className="text-sm text-gray-500">tons</span>
                        </div>
                    </div>

                    {/* Trees/Waste Stat */}
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">♻️</span>
                            <span className="text-gray-400 text-xs font-bold uppercase">Waste Recycled</span>
                        </div>
                        <div className="text-2xl font-mono text-green-300">
                            {totalImpact.wasteRecycled} <span className="text-sm text-gray-500">loads</span>
                        </div>
                    </div>

                    {/* People protected */}
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">🛡️</span>
                            <span className="text-gray-400 text-xs font-bold uppercase">Protected</span>
                        </div>
                        <div className="text-2xl font-mono text-yellow-300">
                            {totalImpact.peopleProtected > 1000000
                                ? `${(totalImpact.peopleProtected / 1000000).toFixed(1)}B`
                                : totalImpact.peopleProtected}
                            <span className="text-sm text-gray-500"> people</span>
                        </div>
                    </div>
                </div>

                {/* SDG Badges */}
                <div className="bg-gray-900/50 rounded-lg p-4 flex items-center gap-4">
                    <span className="text-gray-500 text-xs font-bold uppercase whitespace-nowrap">Goals Targeted:</span>
                    <SDGBadgeGroup goals={totalImpact.sdgsContributed} size="small" />
                    {totalImpact.sdgsContributed.length === 0 && (
                        <span className="text-gray-600 text-sm italic">Complete missions to contribute to UN Goals.</span>
                    )}
                </div>
            </div>
        </div>
    );
};
