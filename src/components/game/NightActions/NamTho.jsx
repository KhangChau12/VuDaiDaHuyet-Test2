import React, { useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/night_actions.css';

function NamTho({ onAction }) {
  const { players } = usePlayerContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Tìm Năm Thọ
  const namTho = players.find(player => player.role === 'Năm Thọ' && player.alive);
  
  // Lọc ra những người chơi có thể bị cướp (còn sống và không phải Năm Thọ)
  const targetablePlayers = players.filter(
    player => player.alive && player.id !== namTho?.id
  );
  
  const handleSelect = (playerId) => {
    setSelectedPlayer(playerId);
  };
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      // Kiểm tra xem người bị chọn có phải Bá Kiến không
      const targetPlayer = players.find(p => p.id === selectedPlayer);
      const isBaKien = targetPlayer.role === 'Bá Kiến';
      
      onAction({
        type: 'rob',
        targetId: selectedPlayer,
        isBaKien
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
      <h3>Năm Thọ</h3>
      <p>Năm Thọ, bạn muốn cướp tiền của ai đêm nay?</p>
      <p className="warning">Cẩn thận: Nếu cướp nhầm nhà Bá Kiến, bạn sẽ phải rời khỏi làng ngay lập tức!</p>
      
      <div className="player-selection">
        <h4>Chọn người để cướp 3 đồng:</h4>
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

export default NamTho;