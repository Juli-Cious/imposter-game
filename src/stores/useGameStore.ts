import { create } from 'zustand';
import type { NetworkService } from '../features/networking/NetworkInterface';

interface GameStore {
    isTerminalOpen: boolean;
    terminalType: 'hacking' | 'editor' | 'hub' | 'school' | null;
    activeFileId: string | null;
    network: NetworkService | null;
    bgmVolume: number; // 0.0 to 1.0
    sfxVolume: number; // 0.0 to 1.0

    // Lobby State
    roomCode: string | null;
    playerId: string | null;
    playerName: string | null;
    isHost: boolean;
    gameState: 'MENU' | 'LOBBY' | 'GAME';
    gameStatus: 'IN_PROGRESS' | 'VICTORY' | 'DEFEAT';
    tasksCompleted: number;
    totalTasks: number;

    // Customization State
    playerSkin: string; // 'doux', 'mort', etc.
    playerTint: number; // Hex color
    playerRole: 'data_scientist' | 'web_activist' | 'systems_engineer' | null;
    playerLanguage: 'python' | 'javascript' | 'cpp' | null;

    openEditor: (fileId: string) => void;
    openTerminal: (type: 'hacking' | 'editor' | 'hub' | 'school') => void;
    closeTerminal: () => void;
    setNetwork: (network: NetworkService) => void;
    setBgmVolume: (volume: number) => void;
    setSfxVolume: (volume: number) => void;

    // Lobby Actions
    setRoomCode: (code: string | null) => void;
    setPlayerId: (id: string | null) => void;
    setPlayerName: (name: string | null) => void;
    setPlayerSkin: (skin: string) => void;
    setPlayerTint: (tint: number) => void;
    setIsHost: (isHost: boolean) => void;
    setIsHost: (isHost: boolean) => void;
    setPlayerRole: (role: 'data_scientist' | 'web_activist' | 'systems_engineer') => void;
    setPlayerLanguage: (lang: 'python' | 'javascript' | 'cpp') => void;
    incrementTasksCompleted: () => void;
    setGameStatus: (status: 'IN_PROGRESS' | 'VICTORY' | 'DEFEAT') => void;
}

export const useGameStore = create<GameStore>((set) => ({
    isTerminalOpen: false,
    terminalType: null,
    activeFileId: null,
    network: null,
    bgmVolume: 0.5,
    sfxVolume: 0.5,

    // Lobby State Defaults
    roomCode: null,
    playerId: null,
    playerName: null,
    isHost: false,
    gameState: 'MENU',
    gameStatus: 'IN_PROGRESS',
    tasksCompleted: 0,
    totalTasks: 3,

    // Default Customization
    playerSkin: 'doux',
    playerTint: 0xffffff,
    playerRole: null,
    playerLanguage: null,

    openEditor: (fileId) => set({
        isTerminalOpen: true,
        terminalType: 'editor',
        activeFileId: fileId
    }),

    openTerminal: (type) => set({
        isTerminalOpen: true,
        terminalType: type,
        activeFileId: null
    }),

    closeTerminal: () => set({
        isTerminalOpen: false,
        terminalType: null,
        activeFileId: null
    }),

    setNetwork: (network) => set({ network }),
    setBgmVolume: (volume) => set({ bgmVolume: volume }),
    setSfxVolume: (volume) => set({ sfxVolume: volume }),

    // Lobby Actions
    setRoomCode: (code) => set({ roomCode: code }),
    setPlayerId: (id) => set({ playerId: id }),
    setPlayerName: (name) => set({ playerName: name }),
    setPlayerSkin: (skin) => set({ playerSkin: skin }),
    setPlayerTint: (tint) => set({ playerTint: tint }),
    setIsHost: (isHost) => set({ isHost }),
    setGameState: (gameState) => set({ gameState }),
    setPlayerRole: (role) => set({ playerRole: role }),
    setPlayerLanguage: (lang) => set({ playerLanguage: lang }),
    incrementTasksCompleted: () => set((state) => {
        const newCount = state.tasksCompleted + 1;
        return {
            tasksCompleted: newCount,
            gameStatus: newCount >= state.totalTasks ? 'VICTORY' : 'IN_PROGRESS'
        };
    }),
    setGameStatus: (status) => set({ gameStatus: status })
}));