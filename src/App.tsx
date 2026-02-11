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
import "./index.css";

function App() {
  const { isTerminalOpen, terminalType, gameState } = useGameStore();

  return (
    <div className="w-full h-full relative bg-gray-900 text-white">

      {/* 1. MAIN MENU */}
      {gameState === 'MENU' && <MainMenu />}

      {/* 2. LOBBY */}
      {gameState === 'LOBBY' && <LobbyScreen />}

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