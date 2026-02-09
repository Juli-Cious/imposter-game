import { db } from '../../firebaseConfig';
import { ref, set } from 'firebase/database';
import { LEVEL_1_PROBLEMS } from '../../shared/ProblemData';

export const LevelManager = () => {

    const resetGameLevel = async () => {
        if (!confirm("⚠️ RESET SERVER? This will wipe all current player code.")) return;

        try {
            // 1. Overwrite the 'files' node in Firebase with our local template
            await set(ref(db, 'gamestate/files'), LEVEL_1_PROBLEMS);

            // 2. Also reset the build status
            await set(ref(db, 'gamestate/buildStatus'), 'BROKEN');

            alert("✅ Level 1 Loaded Successfully!");
        } catch (e) {
            alert("❌ Error uploading level: " + e);
        }
    };

    return (
        <div className="absolute bottom-4 left-4 pointer-events-auto">
            <button
                onClick={resetGameLevel}
                className="bg-red-900/50 hover:bg-red-600 text-red-200 text-xs px-2 py-1 rounded border border-red-500"
            >
                [ADMIN] RESET LEVEL
            </button>
        </div>
    );
};