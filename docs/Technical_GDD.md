# Technical Game Design Document: Syntax Error

**Role:** Senior Game Architect & Full-Stack Lead
**Project:** Syntax Error - A Social Deduction Coding Simulator
**Context:** "Among Us meets Coding Simulator" - Corporate Horror meets Spaghetti Code.

---

## 1. Data Schema (Firebase/NoSQL Structure)

The database structure relies on a root `GameState` object synchronized via Firebase Realtime Database or Firestore.

### 1.1 Root GameState Interface

```typescript
export interface GameState {
  version: string; // e.g., "1.0.0"
  roomId: string;
  hostId: string;
  status: 'LOBBY' | 'PLAYING' | 'MEETING' | 'VOTING' | 'ENDED';
  globalTimer: number; // Seconds remaining (starts at 600)
  sabotageActive: SabotageType | null; // NULL if no sabotage
  sabotageTimer: number | null; // Countdown for active sabotage
  gameEndReason?: 'TASK_COMPLETED' | 'IMPOSTER_VICTORY' | 'GLOBAL_TIMEOUT';
  
  // Sub-collections
  players: Record<string, Player>;
  files: Record<string, CodeFile>;
  terminals: Record<string, Terminal>;
  chat: ChatMessage[];
}

export type SabotageType = 'FIREWALL_LOCKDOWN' | 'ERROR_404_FOG' | 'SYNTAX_SCRAMBLE' | 'READ_ONLY_LOCK' | 'MEMORY_LEAK';

```

### 1.2 Players

Tracks player roles, status, and physical location.

```typescript
export interface Player {
  id: string;
  name: string;
  role: 'CREWMATE' | 'IMPOSTER';
  color: string;
  skin?: string;
  isAlive: boolean;
  
  // Physics & State
  position: { x: number; y: number; room: string };
  velocity: { x: number; y: number };
  
  // Status Effects
  isJailed: boolean;        // True if voted out/punished
  jailTimer: number;        // Seconds remaining in jail
  statusEffect: 'NORMAL' | 'STUNNED' | 'CONFUSED' | 'blinded'; // 'CONFUSED' for Syntax Scramble
  
  // Cooldowns (Imposter only)
  sabotageCooldown: number;
  killCooldown: number;
  
  // Connection
  isOnline: boolean;
  lastPing: number;
}
```

### 1.3 Files (The Codebase)

The core objective. Supports "Git Blame" via a history array.

```typescript
export interface CodeFile {
  id: string; // e.g., "auth_service.js"
  name: string;
  path: string; // Virtual path e.g., "/src/services/"
  language: 'javascript' | 'python' | 'cpp';
  
  // Content
  currentContent: string;
  originalContent: string; // For reference/reset
  
  // Status
  isCorrupted: boolean;   // True if logic error exists (Imposter sabotage)
  hasSyntaxError: boolean; // True if code fails compilation
  testStatus: 'PASS' | 'FAIL' | 'PENDING';
  
  // Operations
  locked: boolean; // For Read-Only sabotage
  
  // Git Blame / History
  lastModifiedBy: string; // PlayerID
  lastModifiedAt: number; // Timestamp
  history: FileCommit[];
}

export interface FileCommit {
  commitId: string;
  authorId: string;
  timestamp: number;
  diff: string; // Unified diff string or full snapshot
  wasTestsRun: boolean; // True for Crewmate generic save, False for Imposter save
}
```

### 1.4 Terminals

Physical interaction points in the world, linked to specific files.

```typescript
export interface Terminal {
  id: string;
  linkedFileId: string; // The file this terminal edits
  location: { x: number; y: number; room: string };
  
  // Visual Status (What Crew sees)
  visualStatus: 'RED' | 'YELLOW' | 'GREEN'; 
  // RED: Broken/Syntax Error
  // YELLOW: Edited but Untested
  // GREEN: "Fixed" (Can be deceptive!)
  
  // Functional Status (Internal Logic)
  functionalStatus: 'BROKEN' | 'WORKING' | 'CORRUPTED';
  // BROKEN: Failing tests or syntax error
  // WORKING: Tests pass, logic is clean
  // CORRUPTED: Tests skipped, logic might be broken (Imposter work)
  
  isSabotaged: boolean; // If specific terminal sabotage is active
}
```

---

## 2. Core Logic & State Management

### 2.1 handleCommit(playerId, fileId, newCode)

Executed when a player hits "Submit" or "Save" on a terminal.

```typescript
function handleCommit(playerId: string, fileId: string, newCode: string) {
    const player = GameState.players[playerId];
    const file = GameState.files[fileId];
    
    // update history
    const commitEntry = {
        commitId: generateUUID(),
        authorId: playerId,
        timestamp: Date.now(),
        diff: computeDiff(file.currentContent, newCode),
        wasTestsRun: false // Default
    };

    if (player.role === 'IMPOSTER') {
        // IMPOSTER MECHANIC: Bypass Tests
        updateFile(fileId, {
            currentContent: newCode,
            isCorrupted: true, // Mark as potentially corrupted logic
            testStatus: 'PENDING', // UI might show "Passing" if faked
            lastModifiedBy: playerId,
            history: [...file.history, commitEntry]
        });
        
        // Visual Deception: Force Terminal Green usually, or keep specific state
        updateTerminal(fileId, { 
            visualStatus: 'GREEN', // Fake success
            functionalStatus: 'CORRUPTED' 
        });

    } else {
        // CREWMATE MECHANIC: Run Tests
        const testResult = runUnitTests(newCode, file.language); // Mock function returning bool
        
        commitEntry.wasTestsRun = true;
        
        updateFile(fileId, {
            currentContent: newCode,
            isCorrupted: !testResult.passed,
            testStatus: testResult.passed ? 'PASS' : 'FAIL',
            lastModifiedBy: playerId,
            history: [...file.history, commitEntry]
        });

        updateTerminal(fileId, {
            visualStatus: testResult.passed ? 'GREEN' : 'RED',
            functionalStatus: testResult.passed ? 'WORKING' : 'BROKEN'
        });
    }
}
```

### 2.2 triggerSabotage(type, target)

Imposter triggers a disruption.

```typescript
function triggerSabotage(type: SabotageType, target?: string) {
    if (GameState.sabotageActive) return; // Cooldown or existing sabotage
    
    updateGameState({
        sabotageActive: type,
        sabotageTimer: getDuration(type) // e.g., 45s for Memory Leak
    });

    switch (type) {
        case 'SYNTAX_SCRAMBLE':
            // Logic: Notify all clients to switch fonts
            broadcastEvent("SABOTAGE_START", { type: 'SYNTAX_SCRAMBLE' });
            // Apply status effect to all crewmates
            Object.keys(GameState.players).forEach(pid => {
                 if (GameState.players[pid].role === 'CREWMATE') {
                     updatePlayer(pid, { statusEffect: 'CONFUSED' });
                 }
            });
            break;

        case 'MEMORY_LEAK':
            // Logic: Critical Countdown
            startServerCountdown(45, () => {
                endGame('IMPOSTER_VICTORY', "Server Crashed due to Memory Leak");
            });
            break;
            
        case 'READ_ONLY_LOCK':
             // Lock all files
             Object.keys(GameState.files).forEach(fid => {
                 updateFile(fid, { locked: true });
             });
             break;
    }
}
```

### 2.3 attemptDepart() (The Integration Test)

Triggered at the Spawn point to try and win the game.

```typescript
async function attemptDepart() {
    // 1. Lock functionality (Atomic Operation)
    setGameStatus('VALIDATING');
    
    let allTestsPassed = true;
    const failingFiles = [];

    // 2. Integration Test: Scanned all files
    for (const fileId in GameState.files) {
        const file = GameState.files[fileId];
        // Check actual logic status, not just visual
        // In a real scenario, we might re-run tests here to catch "Corrupted" files 
        // that were saved by Imposters bypassing tests.
        
        const realTestResult = runUnitTests(file.currentContent, file.language);
        
        if (!realTestResult.passed) {
            allTestsPassed = false;
            failingFiles.push(file.name);
            // Visual Update: Reveal the broken terminal
            updateTerminal(fileId, { visualStatus: 'RED' });
        }
    }

    if (allTestsPassed) {
        endGame('TASK_COMPLETED', "Deployment Successful!");
    } else {
        // Failure Penalty
        triggerGlobalAlert(`Deployment Failed! Errors in: ${failingFiles.join(', ')}`);
        
        updateGameState({
            globalTimer: Math.max(0, GameState.globalTimer - 30), // deduct 30s
            status: 'PLAYING' // Resume game
        });
        
        // Trigger "Crash" animation
        broadcastEvent("DEPLOY_FAILURE");
    }
}
```

---

## 3. Anti-Griefing / Anti-Cheat Measures

### 3.1 The "Delete All" Prevention

**Problem:** Imposter deletes all code (`Ctrl+A` -> `Del`) to make the game unplayable.

**Solution: Semantic Stability Check**

When `handleCommit` is called, before accepting the input:

1.  **Min-Length Check**: 
    If `newCode.length < originalContent.length * 0.1`, reject commit. 
    *Error: "Codebase integrity compromised. Cannot commit empty file."*
    
2.  **Edit Distance Rate Limiting**:
    If a player changes > 50% of the lines in a single commit:
    *Soft Lock*: "Large refactor detected. Deploying... (10s delay applied)."
    This slows down destructive behavior without banning valid extensive rewrites.

3.  **Essential Symbols Check**:
    If the file is a specific type (e.g., React Component) and missing key imports or exports that existed previously, warn the user. 

### 3.2 Spam Prevention

**Problem:** Crewmate repeatedly hits "Submit" to spam tests.

**Solution:**
- **Test Cooldown**: Running unit tests takes time (simulation).
- Add a 3-5 second "Compiling..." delay during which the terminal cannot be used.
