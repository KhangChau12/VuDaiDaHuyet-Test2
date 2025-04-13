import React, { useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/night_actions.css';

function TuLang({ onAction }) {
  const { players } = usePlayerContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Tìm Tự Lãng
  const tuLang = players.find(player => player.role === 'Tự Lãng' && player.alive);
  
  // Lọc ra những người chơi có thể bán rượu (còn sống và không phải Tự Lãng)
  const targetablePlayers = players.filter(
    player => player.alive && player.id !== tuLang?.id
  );
  
  const handleSelect = (playerId) => {
    setSelectedPlayer(playerId);
  };
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      onAction({
        type: 'sell',
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
      <h3>Tự Lãng</h3>
      <p>Tự Lãng, bạn muốn bán rượu cho ai đêm nay?</p>
      
      {tuLang && (
        <div className="coins-info">
          <p>Hiện tại bạn có: {tuLang.coins} đồng</p>
          <p className="goal">Mục tiêu: 15 đồng để chiến thắng</p>
        </div>
      )}
      
      <div className="player-selection">
        <h4>Chọn người để bán rượu và lấy 1 đồng:</h4>
        <div className="player-list">
          {targetablePlayers.map(player => (
            <div 
              key={player.id}
              className={`player-option ${selectedPlayer === player.id ? 'selected' : ''}`}
              onClick={() => handleSelect(player.id)}
            >
              {player.name} ({player.role}) - {player.coins} đồng
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

export default TuLang;