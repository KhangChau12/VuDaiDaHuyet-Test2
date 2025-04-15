import React, { useState, useEffect } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import { useGameContext } from '../../../context/GameContext';
import '../../../styles/night_actions.css';

function ThiNo({ onAction }) {
  const { players } = usePlayerContext();
  const { nightPhase } = useGameContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [previousTarget, setPreviousTarget] = useState(null);
  
  // Lấy người được Thị Nở giúp đỡ đêm trước (nếu có)
  useEffect(() => {
    const prevActions = nightPhase.actions;
    if (prevActions && prevActions['Thị Nở'] && prevActions['Thị Nở'].targetId) {
      setPreviousTarget(prevActions['Thị Nở'].targetId);
    }
  }, []);
  
  // Lọc ra những người chơi có thể được giúp đỡ (còn sống)
  const targetablePlayers = players.filter(
    player => player.alive
  );
  
  const handleSelect = (playerId) => {
    setSelectedPlayer(playerId);
  };
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      onAction({
        type: 'help',
        targetId: selectedPlayer,
        isSecondNight: selectedPlayer === previousTarget && players.find(p => p.id === selectedPlayer)?.role === 'Chí Phèo'
      });
    } else {
      // Nếu không chọn ai, vẫn ghi nhận hành động bỏ qua
      onAction({
        type: 'skip'
      });
    }
  };
  
  return (
    <div className="night-action-component">
      <h3>Thị Nở</h3>
      <p>Thị Nở, bạn muốn giúp ai giảm 1 điểm uất ức?</p>
      
      {previousTarget && (
        <div className="previous-action">
          <p>Đêm trước bạn đã giúp: {players.find(p => p.id === previousTarget)?.name}</p>
          {players.find(p => p.id === previousTarget)?.role === 'Chí Phèo' && (
            <p className="special-note">
              Nếu bạn chọn Chí Phèo 2 đêm liên tiếp, anh ta sẽ chuyển sang phe Công Lý.
            </p>
          )}
        </div>
      )}
      
      <div className="player-selection">
        <h4>Chọn người để giúp đỡ:</h4>
        <div className="player-list">
          {targetablePlayers.map(player => (
            <div 
              key={player.id}
              className={`player-option ${selectedPlayer === player.id ? 'selected' : ''} ${player.id === previousTarget && player.role === 'Chí Phèo' ? 'special' : ''}`}
              onClick={() => handleSelect(player.id)}
            >
              {player.name} ({player.role}) 
              {player.id === previousTarget && player.role === 'Chí Phèo' && ' - Chọn lần 2 sẽ chuyển phe'}
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="submit-button" 
        onClick={handleSubmit}
      >
        {selectedPlayer ? 'Xác nhận' : 'Bỏ qua'}
      </button>
    </div>
  );
}

export default ThiNo;