import { useEffect } from 'react'
import "../styles/home.css"
import Character from './game/Characters'
import Day from './game/Day'
import Night from './game/Night'
import EndGame from './game/EndGame'
import { useGameContext } from '../context/GameContext'
import { usePlayerContext } from '../context/PlayerContext'
import { processFrustrationEffects } from '../utils/statusEffects'
import { checkAllVictoryConditions } from '../services/victoryConditions'

function GamePlay() {
  const { 
    currentPhase, 
    currentDay, 
    gameOver, 
    winner, 
    setPhase,
    nextDay,
    setGameOver
  } = useGameContext();
  
  const { 
    players, 
    setPlayers, 
    removePlayer, 
    changeTeam 
  } = usePlayerContext();

  // Kiểm tra các điều kiện chiến thắng và trạng thái người chơi
  useEffect(() => {
    if (players.length > 0 && !gameOver) {
      // Xử lý người chơi có 2 điểm uất ức
      const frustrationResults = processFrustrationEffects(players, removePlayer, changeTeam);
      
      // Kiểm tra chiến thắng sau các thay đổi
      const victoryResults = checkAllVictoryConditions(players);
      if (victoryResults.victory) {
        setGameOver(victoryResults.winner);
      }
    }
  }, [players, currentPhase]);

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