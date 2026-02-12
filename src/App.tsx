import { GameComponent } from "./features/game/GameComponent";
import { CodeEditor } from "./features/ui/CodeEditor";
import { CentralTerminal } from "./features/ui/CentralTerminal";
import { useGameStore } from "./stores/useGameStore";
import { TaskBoard } from "./features/ui/TaskBoard";
import { LevelManager } from "./features/game/LevelManager";
import { MeetingUI } from "./features/ui/MeetingUI";
import { MainMenu } from "./features/ui/MainMenu";
import { LobbyScreen } from "./features/ui/LobbyScreen";
import { AcademyUI } from "./features/ui/AcademyUI";
import { IntroAnimation } from "./features/ui/IntroAnimation";
import { TutorialOverlay } from "./features/ui/TutorialOverlay";
import { VictoryAnimation } from "./features/ui/VictoryAnimation";
import { LoginScreen } from "./features/ui/LoginScreen";
import { RedemptionScreen } from "./features/ui/RedemptionScreen";
import { AIImposterService } from "./services/AIImposterService";
import { usePlayerProgress } from "./stores/usePlayerProgress";
import { useAuthStore } from "./stores/useAuthStore";
import { useState, useEffect } from "react";
import "./index.css";
import { DEMO_MODE } from "./config/demoMode";

function App() {
  const { isTerminalOpen, terminalType, gameState } = useGameStore();
  const { shouldShowIntro, shouldShowTutorial, shouldShowVictory, completedChallenges, hasSeenVictory } = usePlayerProgress();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();
  const [showVictory, setShowVictory] = useState(false);

  // AI Imposter Lifecycle
  useEffect(() => {
    if (gameState === 'GAME' && useGameStore.getState().gameMode === 'SINGLE_PLAYER') {
      AIImposterService.getInstance().start();
    } else {
      AIImposterService.getInstance().stop();
    }

    return () => {
      AIImposterService.getInstance().stop();
    }
  }, [gameState]);

  // Initialize Firebase auth on mount (skip if demo mode)
  useEffect(() => {
    if (!DEMO_MODE) {
      initialize();
    }
  }, [initialize]);

  // Check for victory condition
  useEffect(() => {
    const shouldShow = shouldShowVictory();
    if (shouldShow && !showVictory) {
      console.log('Victory condition met! Showing victory animation...');
      setShowVictory(true);
    }
  }, [completedChallenges, shouldShowVictory, showVictory, hasSeenVictory]);

  // Loading state (skip if demo mode)
  if (!DEMO_MODE && isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-spin mb-4">🌍</div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Login screen if not authenticated (skip if demo mode)
  if (!DEMO_MODE && !isAuthenticated) {
    return <LoginScreen />;
  }

  // Main game (authenticated or demo mode)
  return (
    <div className="w-full h-full relative bg-gray-900 text-white">

      {/* INTRO ANIMATION (First-time only) */}
      {shouldShowIntro() && <IntroAnimation onComplete={() => { }} />}

      {/* VICTORY ANIMATION (When all challenges complete) */}
      {showVictory && <VictoryAnimation onClose={() => setShowVictory(false)} />}

      {/* 1. MAIN MENU */}
      {gameState === 'MENU' && <MainMenu />}

      {/* 2. LOBBY */}
      {gameState === 'LOBBY' && (
        <>
          <LobbyScreen />
          {/* TUTORIAL OVERLAY (First-time in lobby) */}
          {shouldShowTutorial() && <TutorialOverlay />}
        </>
      )}

      {/* 3. GAME */}
      {gameState === 'GAME' && (
        <>
          <GameComponent />

          <TaskBoard /> {/* Always visible to user */}
          <LevelManager /> {/* <--- The Reset Button */}

          {/* Meeting Overlay (Handles its own visibility) */}
          <MeetingUI />
          <RedemptionScreen />

          {/* The 4 UI Types */}
          {isTerminalOpen && terminalType === 'editor' && <CodeEditor />}
          {isTerminalOpen && terminalType === 'hub' && <CentralTerminal />}
          {isTerminalOpen && terminalType === 'academy' && <AcademyUI />}
        </>
      )}
    </div>
  );
}
export default App;
