import { create } from 'zustand';

export type MeetingStatus = 'IDLE' | 'DISCUSSION' | 'VOTING' | 'RESULTS';

interface MeetingState {
    status: MeetingStatus;
    callerId: string | null;
    meetingEndTime: number;
    presenterId: string | null;
    highlightedLine: { fileId: string, line: number } | null;
    votes: Record<string, string>; // voterId -> candidateId (or 'skip')
    chatMessages: import('../features/networking/NetworkInterface').ChatMessage[];
    result: string | null;

    // Actions (Local updates from Subscriber)
    setMeetingState: (newState: Partial<MeetingState>) => void;

    // Optimistic / Local Actions (Optional, if needed for instant feedback)
    reset: () => void;
}

export const useMeetingStore = create<MeetingState & { setMeetingState: (s: Partial<MeetingState>) => void; reset: () => void }>((set) => ({
    status: 'IDLE',
    callerId: null,
    meetingEndTime: 0,
    presenterId: null,
    highlightedLine: null,
    votes: {},
    chatMessages: [],
    result: null,

    setMeetingState: (newState) => set((state) => ({ ...state, ...newState })),

    // Reset to defaults
    reset: () => set({
        status: 'IDLE',
        callerId: null,
        meetingEndTime: 0,
        presenterId: null,
        highlightedLine: null,
        votes: {},
        chatMessages: [],
        result: null
    })
}));
