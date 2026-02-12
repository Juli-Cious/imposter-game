import type { NetworkService, PlayerState, MeetingState, ChatMessage } from "./NetworkInterface";
import { db } from "../../firebaseConfig";
import { ref, onValue, set, update, onDisconnect, push } from "firebase/database";
import type { DatabaseReference } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';

export class FirebaseAdapter implements NetworkService {
  public playerId: string;
  private roomCode: string | null = null;
  private playerName: string | null = null;

  constructor() {
    this.playerId = uuidv4();
  }

  // Helper to get relative path in room
  private getRoomRef(path: string): DatabaseReference {
    if (!this.roomCode) throw new Error("Not connected to a room!");
    return ref(db, `rooms/${this.roomCode}/${path}`);
  }

  async connect(roomCode: string, playerName: string, existingPlayerId?: string, skin: string = 'doux', tint: number = 0xffffff): Promise<string> {
    this.roomCode = roomCode;
    this.playerName = playerName;
    this.playerId = existingPlayerId || this.playerId;
    console.log(`[Firebase] Connecting to room ${roomCode} as ${playerName} (${this.playerId})`);

    const myRef = this.getRoomRef(`players/${this.playerId}`);

    // 1. Set initial state
    try {
      await set(myRef, {
        id: this.playerId,
        x: 400, // We could load this from DB if we wanted true persistence, but spawn is fine for now
        y: 300,
        color: '#ffffff', // Legacy field, kept for safety
        name: playerName,
        isOnline: true,
        skin: skin,
        tint: tint,
        // Imposter Mode fields (will be set when game starts)
        role: null,
        isAlive: true,
        status: 'active'
      });
      console.log('[Firebase] Player write success');
    } catch (e) {
      console.error('[Firebase] Player write failed', e);
    }

    // 2. Auto-remove player if they close the tab
    // onDisconnect(myRef).remove(); // OLD WAY: Delete player

    // NEW WAY: Mark as offline (Ghost Mode)
    const myPresenceRef = this.getRoomRef(`players/${this.playerId}/isOnline`);
    onDisconnect(myPresenceRef).set(false);

    return this.playerId;
  }

  disconnect() {
    if (this.roomCode) {
      const myRef = this.getRoomRef(`players/${this.playerId}`);
      set(myRef, null);
      this.roomCode = null;
    }
  }

  subscribeToPlayers(callback: (players: PlayerState[]) => void): void {
    if (!this.roomCode) return;
    const playersRef = this.getRoomRef('players');
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      const playerList = data ? Object.values(data) as PlayerState[] : [];
      callback(playerList);
    });
  }

  sendPlayerMove(x: number, y: number): void {
    if (!this.roomCode) return;
    const myRef = this.getRoomRef(`players/${this.playerId}`);
    update(myRef, { x, y });
  }

  sendHackCommand(command: string): void {
    if (!this.roomCode) return;
    const hacksRef = this.getRoomRef('gamestate/hacks');
    push(hacksRef, {
      command: command,
      timestamp: Date.now(),
      author: this.playerId
    });
  }

  // --- Meeting Implementation ---

  subscribeToMeeting(callback: (state: MeetingState) => void): void {
    if (!this.roomCode) return;
    const meetingRef = this.getRoomRef('meeting');
    onValue(meetingRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        callback(data);
      } else {
        callback({
          status: 'IDLE',
          callerId: null,
          meetingEndTime: 0,
          presenterId: null,
          highlightedLine: null,
          votes: {},
          result: null
        });
      }
    });
  }

  startMeeting(callerId: string): void {
    if (!this.roomCode) return;
    const meetingRef = this.getRoomRef('meeting');
    update(meetingRef, {
      status: 'DISCUSSION',
      callerId: callerId,
      presenterId: callerId,
      meetingEndTime: Date.now() + 60000,
      highlightedLine: null,
      votes: {}
    });
  }

  endMeeting(): void {
    if (!this.roomCode) return;
    const meetingRef = this.getRoomRef('meeting');
    update(meetingRef, {
      status: 'IDLE',
      callerId: null,
      presenterId: null,
      highlightedLine: null,
      votes: {},
      result: null
    });
  }

  vote(voterId: string, candidateId: string): void {
    if (!this.roomCode) return;
    const voteRef = this.getRoomRef(`meeting/votes/${voterId}`);
    set(voteRef, candidateId);
  }

  highlightLine(fileId: string, line: number): void {
    if (!this.roomCode) return;
    const lineRef = this.getRoomRef('meeting/highlightedLine');
    set(lineRef, { fileId, line });
  }

  sendChatMessage(text: string, playerName: string): void {
    if (!this.roomCode) return;
    const chatRef = this.getRoomRef('meeting/chat');

    push(chatRef, {
      id: uuidv4(),
      playerId: this.playerId,
      playerName: playerName, // Use passed name from UI (Store)
      text,
      timestamp: Date.now()
    });
  }

  subscribeToChat(callback: (messages: ChatMessage[]) => void): void {
    if (!this.roomCode) return;
    const chatRef = this.getRoomRef('meeting/chat');
    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      const messages = data ? Object.values(data) as import("./NetworkInterface").ChatMessage[] : [];
      messages.sort((a, b) => a.timestamp - b.timestamp);
      callback(messages);
    });
  }

  updatePlayerCustomization(skin: string, tint: number): void {
    if (!this.roomCode) return;
    const myRef = this.getRoomRef(`players/${this.playerId}`);
    update(myRef, { skin, tint });
  }

  submitFeedback(rating: number, comment: string): Promise<void> {
    const feedbackRef = ref(db, 'feedback');
    const newFeedbackRef = push(feedbackRef);
    return set(newFeedbackRef, {
      rating,
      comment,
      timestamp: Date.now(),
      playerId: this.playerId,
      playerName: this.playerName || 'Anonymous'
    });
  }
}