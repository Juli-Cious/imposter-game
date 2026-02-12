import * as GoogleAIService from './GoogleAIService';
import { useGameStore } from '../stores/useGameStore';
import { usePlayerProgress } from '../stores/usePlayerProgress';
import { useMeetingStore } from '../stores/useMeetingStore';
import { usePlayerStore } from '../stores/usePlayerStore';
import { LEVEL_1_PROBLEMS } from '../shared/ProblemData';
import { db } from '../firebaseConfig';
import { ref, update } from 'firebase/database';
import { FirebaseAdapter } from '../features/networking/FirebaseAdapter';

interface BotInstance {
    id: string;
    adapter: FirebaseAdapter;
    role: 'imposter' | 'hero';
    name: string;
}

export class AIImposterService {
    private static instance: AIImposterService;
    private loopInterval: any = null;
    private moveInterval: any = null;
    private isRunning = false;
    private lastSabotageTime = 0;
    private sabotageCooldown = 30000; // 30s initial cooldown

    // Bot Identity
    private bots: BotInstance[] = [];

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

        // 1. Spawn Bots
        setTimeout(() => this.spawnBots(roomCode), 2000);

        // 2. Start Logic Loop (Sabotage, Voting)
        this.loopInterval = setInterval(() => {
            this.gameLoop();
        }, 5000);

        // 3. Start Movement Loop (Frequent updates)
        this.moveInterval = setInterval(() => {
            this.moveBots();
        }, 2000);
    }

    stop() {
        this.isRunning = false;
        if (this.loopInterval) clearInterval(this.loopInterval);
        if (this.moveInterval) clearInterval(this.moveInterval);

        // Disconnect bots?
        // this.bots.forEach(b => b.adapter.disconnect());
        // this.bots = [];
    }

    private async spawnBots(roomCode: string) {
        if (this.bots.length > 0) return;

        console.log('[AI Imposter] Spawning Bots...');

        const botConfigs = [
            { name: "GlitchBot 9000", role: 'imposter', skin: 'mort', tint: 0xff0000 },
            { name: "CrewBot Alpha", role: 'hero', skin: 'doux', tint: 0x00ff00 },
            { name: "CrewBot Beta", role: 'hero', skin: 'vita', tint: 0x0000ff },
            { name: "CrewBot Gamma", role: 'hero', skin: 'tard', tint: 0xffff00 }
        ] as const;

        for (const config of botConfigs) {
            const adapter = new FirebaseAdapter();
            const id = await adapter.connect(roomCode, config.name, `bot-${config.name.replace(/\s/g, '').toLowerCase()}`, config.skin, config.tint);

            // Set Role explicitly
            await update(ref(db, `rooms/${roomCode}/players/${id}`), {
                role: config.role,
                isAlive: true,
                status: 'active'
            });

            this.bots.push({
                id,
                adapter,
                role: config.role,
                name: config.name
            });
        }
    }

    private moveBots() {
        if (!this.isRunning) return;

        this.bots.forEach(bot => {
            if (this.isRunning) { // Double check
                // Random movement
                // Map size is roughly 800x600 for now or whatever the canvas is.
                // Let's assume a safe area of 100-700 x, 100-500 y
                const x = 100 + Math.random() * 600;
                const y = 100 + Math.random() * 400;

                // Animate? Firebase adapter just sends position.
                // In a real game we'd pathfind. Here we just teleport/slide.
                bot.adapter.sendPlayerMove(x, y);
            }
        });
    }

    private async gameLoop() {
        if (!this.isRunning) return;

        const { gameState } = useGameStore.getState();
        const { completedChallenges } = usePlayerProgress.getState();

        // 1. Handle Voting
        this.handleBotVoting();

        if (gameState !== 'GAME') return;

        // 2. Difficulty Scaling
        const progressPercent = (completedChallenges.length / Object.keys(LEVEL_1_PROBLEMS).length);
        if (progressPercent > 0.5) this.sabotageCooldown = 15000;

        // 3. Sabotage Logic (Only for Imposter Bots)
        const imposterBot = this.bots.find(b => b.role === 'imposter');

        if (imposterBot && imposterBot.id) {
            // Check if imposter is alive/active?
            // let's assume yes for now
        }

        const now = Date.now();
        if (now - this.lastSabotageTime > this.sabotageCooldown) {
            const uncompleted = Object.keys(LEVEL_1_PROBLEMS).filter(id => !completedChallenges.includes(id));
            if (uncompleted.length === 0) return;

            const targetFileId = uncompleted[Math.floor(Math.random() * uncompleted.length)];
            await this.sabotageFile(targetFileId, imposterBot);
            this.lastSabotageTime = now;
        }
    }

    private async handleBotVoting() {
        const { status, votes } = useMeetingStore.getState();

        if (status === 'DISCUSSION') {
            const { playerId } = useGameStore.getState();

            this.bots.forEach(bot => {
                if (!votes[bot.id]) {
                    // 20% chance to vote per tick
                    if (Math.random() > 0.2) {
                        // Vote logic
                        // Imposter votes for Player (if active)
                        // Hero votes randomly or skips

                        let candidate = 'skip';

                        if (bot.role === 'imposter') {
                            candidate = playerId || 'skip';
                        } else {
                            // Hero votes randomly
                            const allPlayers = usePlayerStore.getState().players;
                            // Filter out self
                            const targets = allPlayers.filter(p => p.id !== bot.id);
                            if (targets.length > 0) {
                                const target = targets[Math.floor(Math.random() * targets.length)];
                                candidate = target.id;
                            }
                        }

                        bot.adapter.vote(bot.id, candidate);

                        // Chat message
                        const msgs = [
                            "I'm voting for " + candidate,
                            "Sus.",
                            "I saw them vent!",
                            "Skip?",
                            "Who is it?"
                        ];
                        bot.adapter.sendChatMessage(msgs[Math.floor(Math.random() * msgs.length)]);
                    }
                }
            });
        }
    }

    private async sabotageFile(fileId: string, bot?: BotInstance) {
        if (!bot) return;

        console.log(`[AI Imposter] Sabotaging ${fileId}...`);
        const originalCode = LEVEL_1_PROBLEMS[fileId].content;
        const { difficulty } = useGameStore.getState();

        // Map game difficulty
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
                update(ref(db, `gamestate/files/${fileId}`), {
                    content: sabotage.code,
                    lastSabotage: {
                        timestamp: Date.now(),
                        type: sabotage.sabotageType
                    },
                    testStatus: 'FAIL'
                });

                console.log(`[AI Imposter] ${fileId} sabotaged!`);
                bot.adapter.sendChatMessage(`I tweaked ${fileId}. Good luck fixing it! 😈`);
            }
        } catch (e) {
            console.error("[AI Imposter] Failed to generate sabotage", e);
        }
    }
}
