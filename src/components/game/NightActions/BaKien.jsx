import React, { useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/night_actions.css';

function BaKien({ onAction }) {
  const { players } = usePlayerContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Lọc ra những người chơi có thể bị đàn áp (không phải phe Quyền Thế và còn sống)
  const targetablePlayers = players.filter(
    player => player.alive && player.team !== 'Quyền Thế'
  );
  
  const handleSelect = (playerId) => {
    setSelectedPlayer(playerId);
  };
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      onAction({
        type: 'oppress',
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
      <h3>Bá Kiến</h3>
      <p>Bá Kiến, bạn muốn đàn áp thêm ai?</p>
      
      <div className="player-selection">
        <h4>Chọn người để đàn áp:</h4>
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
      
      <div className="action-buttons">
        <button 
          className="submit-button" 
          onClick={handleSubmit}
        >
          {selectedPlayer ? 'Xác nhận' : 'Bỏ qua'}
        </button>
      </div>
    </div>
  );
}

export default BaKien;