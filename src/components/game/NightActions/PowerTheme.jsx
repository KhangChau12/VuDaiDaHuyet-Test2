import React, { useState, useEffect } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/night_actions.css';

function PowerTheme({ onAction }) {
  const { players } = usePlayerContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Lọc ra những người chơi có thể bị đàn áp (không phải phe Quyền Thế và còn sống)
  const targetablePlayers = players.filter(
    player => player.alive && player.team !== 'Quyền Thế'
  );
  
  // Hiển thị thành viên phe Quyền Thế
  const powerThemeMembers = players.filter(
    player => player.alive && player.team === 'Quyền Thế' && !player.drunk
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
    }
  };
  
  return (
    <div className="night-action-component">
      <h3>Phe Quyền Thế</h3>
      <p>Gọi tất cả phe Quyền Thế dậy. Đêm nay các bạn muốn đàn áp ai?</p>
      
      <div className="power-theme-members">
        <h4>Thành viên phe Quyền Thế:</h4>
        <ul>
          {powerThemeMembers.map(member => (
            <li key={member.id}>{member.name} ({member.role})</li>
          ))}
        </ul>
      </div>
      
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
      
      <button 
        className="submit-button" 
        onClick={handleSubmit}
        disabled={!selectedPlayer}
      >
        Xác nhận
      </button>
    </div>
  );
}

export default PowerTheme;