import { create } from 'zustand';
import type { PlayerState } from '../features/networking/NetworkInterface';

interface PlayerStore {
    players: PlayerState[];
    setPlayers: (players: PlayerState[]) => void;
    getPlayer: (id: string) => PlayerState | undefined;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
    players: [],
    setPlayers: (players) => set({ players }),
    getPlayer: (id) => get().players.find(p => p.id === id)
}));
