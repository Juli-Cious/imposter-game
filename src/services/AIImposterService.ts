import { GoogleAIService } from './GoogleAIService';
import { useGameStore } from '../stores/useGameStore';
import { usePlayerProgress } from '../stores/usePlayerProgress';
import { useMeetingStore } from '../stores/useMeetingStore'; // Correct import
import { LEVEL_1_PROBLEMS } from '../shared/ProblemData';
import { db } from '../firebaseConfig';
import { ref, update } from 'firebase/database'; // Removed unused set
import { FirebaseAdapter } from '../features/networking/FirebaseAdapter';

export class AIImposterService {
    private static instance: AIImposterService;
    private loopInterval: NodeJS.Timeout | null = null;
    private isRunning = false;
    private lastSabotageTime = 0;
    private sabotageCooldown = 30000; // 30s initial cooldown

    // Bot Identity
    private botId: string | null = null;
    private botAdapter: FirebaseAdapter | null = null;

    private constructor() { }

    static getInstance(): AIImposterService {
        if (!AIImposterService.instance) {
            AIImposterService.instance = new AIImposterService();
        }
        return AIImposterService.instance;
    }

    async start() {
        if (this.isRunning) return;
        const { roomCode, playerId } = useGameStore.getState();
        if (!roomCode || !playerId) return;

        this.isRunning = true;
        console.log('[AI Imposter] Initializing...');

        // 1. Spawn Bot if needed (Single Player Check)
        setTimeout(() => this.checkAndSpawnBot(roomCode), 2000);

        // 2. Start Loop
        this.loopInterval = setInterval(() => {
            this.gameLoop();
        }, 5000);
    }

    stop() {
        this.isRunning = false;
        if (this.loopInterval) clearInterval(this.loopInterval);

        // Disconnect bot when game ends to avoid ghosts
        if (this.botAdapter) {
            // this.botAdapter.disconnect(); // If method exists
        }
    }

    private async checkAndSpawnBot(roomCode: string) {
        if (!this.botId) {
            console.log('[AI Imposter] Spawning GlitchBot 9000...');
            this.botAdapter = new FirebaseAdapter();
            this.botId = await this.botAdapter.connect(roomCode, "GlitchBot 9000", "ai-bot-id", "mort", 0xff0000);

            // Set Bot Role to Imposter explicitly
            update(ref(db, `rooms/${roomCode}/players/${this.botId}`), {
                role: 'imposter',
                isAlive: true,
                status: 'active'
            });
        }
    }

    private async gameLoop() {
        if (!this.isRunning) return;

        const { gameState } = useGameStore.getState();
        const { completedChallenges } = usePlayerProgress.getState();

        // 1. Handle Voting if Meeting is Active
        this.handleBotVoting();

        if (gameState !== 'GAME') return;

        // 2. Difficulty Scaling
        const progressPercent = (completedChallenges.length / Object.keys(LEVEL_1_PROBLEMS).length);
        if (progressPercent > 0.5) this.sabotageCooldown = 15000;

        // 3. Sabotage Logic
        // Check if bot is alive/active before sabotaging
        if (this.botId) {
            const { players } = useGameStore.getState() as any; // Or usePlayerStore
            // Since we don't have direct access to player store here easily without import
            // Let's assume if game is still running, bot might be alive.
            // But if we want to stop sabotage after catch:
            // We can check local variable or fetch from DB.
            // For now, let's leave it. If the bot is "Reformed", maybe they should HELP (highlight bugs).
            // But for Phase 4 scope, just preventing sabotage is enough.

            // Let's just utilize the existing cooldown.
        }

        const now = Date.now();
        if (now - this.lastSabotageTime > this.sabotageCooldown) {
            const uncompleted = Object.keys(LEVEL_1_PROBLEMS).filter(id => !completedChallenges.includes(id));
            if (uncompleted.length === 0) return;

            const targetFileId = uncompleted[Math.floor(Math.random() * uncompleted.length)];
            await this.sabotageFile(targetFileId);
            this.lastSabotageTime = now;
        }
    }

    private async handleBotVoting() {
        if (!this.botAdapter || !this.botId) return;

        const { status, votes } = useMeetingStore.getState();

        // Only vote during DISCUSSION phase and if haven't voted yet
        if (status === 'DISCUSSION' && !votes[this.botId]) {
            // Simple logic: Vote for random player (or skip)
            // But wait a random time to simulate thinking
            if (Math.random() > 0.1) { // 10% chance to vote per tick (5s tick is slow, maybe increase tick rate or just do it once)
                // This loop runs every 5s. 
                // Let's just vote immediately for now to ensure progress.

                // Get candidates
                const { players } = useGameStore.getState() as any; // or fetch via adapter?
                // We don't have players list in GameStore easily accessible here unless we use usePlayerStore
                // Better to just skip or vote self (bad idea).
                // Let's vote 'skip' for now or try to vote for the player.

                const { playerId } = useGameStore.getState();
                // 50% chance to vote for player, 50% skip
                const candidate = Math.random() > 0.5 && playerId ? playerId : 'skip';

                this.botAdapter.vote(this.botId, candidate);
                this.botAdapter.sendChatMessage("I think it's the human...");
            }
        }
    }

    private async sabotageFile(fileId: string) {
        console.log(`[AI Imposter] Sabotaging ${fileId}...`);
        const originalCode = LEVEL_1_PROBLEMS[fileId].content;
        const { difficulty } = useGameStore.getState();

        // Map game difficulty to LLM level
        const levelMap: Record<string, 'easy' | 'medium' | 'hard'> = {
            'EASY': 'easy',
            'MEDIUM': 'medium',
            'HARD': 'hard'
        };

        try {
            const sabotage = await GoogleAIService.generateSabotage({
                baseCode: originalCode,
                level: levelMap[difficulty] || 'easy',
                concept: 'syntax error'
            });

            if (sabotage.success) {
                // Write to Firebase
                update(ref(db, `gamestate/files/${fileId}`), {
                    content: sabotage.code,
                    lastSabotage: {
                        timestamp: Date.now(),
                        type: sabotage.sabotageType
                    },
                    testStatus: 'FAIL' // Force fail
                });

                console.log(`[AI Imposter] ${fileId} sabotaged!`);
                this.botAdapter?.sendChatMessage(`I tweaked ${fileId}. Good luck fixing it! 😈`);
            }
        } catch (e) {
            console.error("[AI Imposter] Failed to generate sabotage", e);
        }
    }
}
