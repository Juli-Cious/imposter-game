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
import { usePlayerProgress } from "./stores/usePlayerProgress";
import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const { isTerminalOpen, terminalType, gameState, setGameState } = useGameStore();
  const { shouldShowIntro, shouldShowTutorial, shouldShowVictory } = usePlayerProgress();
  const [showVictory, setShowVictory] = useState(false);

  // Check for victory condition
  useEffect(() => {
    if (shouldShowVictory() && !showVictory) {
      setShowVictory(true);
    }
  }, [shouldShowVictory, showVictory]);

  // Show intro on first load
  const handleIntroComplete = () => {
    // Intro will auto-progress to game
    if (gameState === 'MENU') {
      setGameState('LOBBY');
    }
  };

  return (
    <div className="w-full h-full relative bg-gray-900 text-white">

      {/* INTRO ANIMATION (First-time only) */}
      {shouldShowIntro() && <IntroAnimation onComplete={handleIntroComplete} />}

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
