import { GameComponent } from "./features/game/GameComponent";
import { CodeEditor } from "./features/ui/CodeEditor";
import { CentralTerminal } from "./features/ui/CentralTerminal";
import { useGameStore } from "./stores/useGameStore";
import { TaskBoard } from "./features/ui/TaskBoard";
import { LevelManager } from "./features/game/LevelManager";
import { MeetingUI } from "./features/ui/MeetingUI";
import RoleSelection from "./features/ui/RoleSelection";
import { SchoolTerminal } from "./features/ui/SchoolTerminal";
import { VictoryScreen } from "./features/ui/VictoryScreen";
import "./index.css";

function App() {
  const { isTerminalOpen, terminalType, gameState } = useGameStore();

  if (gameState === 'MENU') {
    // Show Role Selection before Lobby if role is not set
    // Or just make RoleSelection the first screen?
    // Let's make RoleSelection the first screen.
    return <RoleSelection />;
  }

  if (gameState === 'LOBBY') {
    return (
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
        {/* Placeholder for Lobby Component if it doesn't exist yet, or use existing logic */}
        <div className="text-white">Lobby (Placeholder - functionality in GameComponent?)</div>
        {/* Wait, usually Lobby is part of the flow. Let's check if there is a Lobby component.
             If not, we might need to rely on GameComponent handling it or create one.
             Actually, let's just return the GameComponent if we are in LOBBY or GAME for now,
             assuming GameComponent handles the connection logic.

             BUT, RoleSelection sets gameState to 'LOBBY'.
             So let's route 'LOBBY' to the GameComponent (which seems to contain the lobby logic based on previous reads)
          */}
        <GameComponent />
      </div>
    );
  }

  // If gameState is not 'MENU' or 'LOBBY', assume it's 'GAME' or similar and render the main game components.
  return (
    <div className="w-full h-full relative bg-gray-900 text-white">
      {/* 3. GAME */}
      {gameState === 'GAME' && (
        <>
          <GameComponent />

          <TaskBoard /> {/* Always visible to user */}
          <LevelManager /> {/* <--- The Reset Button */}

          {/* Meeting Overlay (Handles its own visibility) */}
          <MeetingUI />

          {/* The 3 UI Types */}
          {isTerminalOpen && terminalType === 'editor' && (
            <CodeEditor />
          )}

          {isTerminalOpen && terminalType === 'school' && (
            <SchoolTerminal />
          )}    {isTerminalOpen && terminalType === 'hub' && <CentralTerminal />}

          {gameStatus === 'VICTORY' && <VictoryScreen />}
        </>
      )}
    </div>
  );
}
export default App;