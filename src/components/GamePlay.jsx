import { useEffect } from 'react'
import "../styles/home.css"
import Character from './game/Characters'
import Day from './game/Day'
import Night from './game/Night'
import EndGame from './game/EndGame'
import { useGameContext } from '../context/GameContext'
import { usePlayerContext } from '../context/PlayerContext'

function GamePlay() {
  const { 
    currentPhase, 
    currentDay, 
    gameOver, 
    winner, 
    setPhase,
    nextDay
  } = useGameContext();
  
  const { players, setPlayers } = usePlayerContext();

  // Xử lý khi người chơi được thiết lập
  const handleSetupComplete = (playerArray) => {
    setPlayers(playerArray);
    setPhase('day');
  };

  // Xử lý chuyển từ ngày sang đêm
  const handleDayEnd = () => {
    setPhase('night');
  };

  // Xử lý chuyển từ đêm sang ngày
  const handleNightEnd = () => {
    nextDay();
    setPhase('day');
  };

  return (
    <div className='home'>
      {currentPhase === 'setup' && (
        <Character setPlayers={handleSetupComplete} />
      )}
      
      {currentPhase === 'day' && !gameOver && (
        <Day date={currentDay} onEnd={handleDayEnd} />
      )}
      
      {currentPhase === 'night' && !gameOver && (
        <Night date={currentDay} onEnd={handleNightEnd} />
      )}
      
      {gameOver && (
        <EndGame winner={winner} />
      )}
    </div>
  );
}

export default GamePlay;