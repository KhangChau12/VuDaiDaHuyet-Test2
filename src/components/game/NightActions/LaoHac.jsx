import React, { useState, useEffect } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import { useGameContext } from '../../../context/GameContext';
import '../../../styles/night_actions.css';

function LaoHac({ onAction }) {
  const { players } = usePlayerContext();
  const { nightPhase } = useGameContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [previousTarget, setPreviousTarget] = useState(null);
  
  // Lấy người được bảo vệ đêm trước (nếu có)
  useEffect(() => {
    const prevActions = nightPhase.actions;
    if (prevActions && prevActions['Lão Hạc'] && prevActions['Lão Hạc'].targetId) {
      setPreviousTarget(prevActions['Lão Hạc'].targetId);
    }
  }, []);
  
  // Lọc ra những người chơi có thể được bảo vệ (còn sống và không phải người được bảo vệ đêm trước)
  const targetablePlayers = players.filter(
    player => player.alive && player.id !== previousTarget
  );
  
  const handleSelect = (playerId) => {
    setSelectedPlayer(playerId);
  };
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      onAction({
        type: 'protect',
        targetId: selectedPlayer
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
      <h3>Lão Hạc</h3>
      <p>Lão Hạc, bạn muốn bảo vệ ai khỏi đàn áp đêm nay?</p>
      
      {previousTarget && (
        <div className="previous-action">
          <p>Đêm trước bạn đã bảo vệ: {players.find(p => p.id === previousTarget)?.name}</p>
          <p>Bạn không thể bảo vệ cùng một người hai đêm liên tiếp.</p>
        </div>
      )}
      
      <div className="player-selection">
        <h4>Chọn người để bảo vệ:</h4>
        <div className="player-list">
          {targetablePlayers.map(player => (
            <div 
              key={player.id}
              className={`player-option ${selectedPlayer === player.id ? 'selected' : ''}`}
              onClick={() => handleSelect(player.id)}
            >
              {player.name} ({player.role})
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

export default LaoHac;