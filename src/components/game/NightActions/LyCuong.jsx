import React, { useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import { useGameContext } from '../../../context/GameContext';
import '../../../styles/night_actions.css';

function LyCuong({ onAction }) {
  const { players } = usePlayerContext();
  const { nightPhase } = useGameContext();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  
  // Lọc ra những người chơi có thể bị tống tiền (không phải phe Quyền Thế và còn sống)
  const targetablePlayers = players.filter(
    player => player.alive && player.team !== 'Quyền Thế'
  );
  
  // Tính số người có thể tống tiền (bằng số thành viên phe Quyền Thế còn sống)
  const powerThemeCount = players.filter(
    player => player.alive && player.team === 'Quyền Thế'
  ).length;
  
  const handleSelect = (playerId) => {
    if (selectedPlayers.includes(playerId)) {
      // Nếu đã chọn thì bỏ chọn
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
    } else {
      // Nếu chưa chọn và chưa đủ số lượng thì thêm vào
      if (selectedPlayers.length < powerThemeCount) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    }
  };
  
  const handleSubmit = () => {
    onAction({
      type: 'extort',
      targetIds: selectedPlayers
    });
  };
  
  return (
    <div className="night-action-component">
      <h3>Lý Cường</h3>
      <p>Lý Cường, bạn muốn tống tiền những ai?</p>
      <p>Bạn có thể chọn tối đa {powerThemeCount} người.</p>
      
      <div className="player-selection">
        <h4>Chọn người để tống tiền:</h4>
        <div className="player-list">
          {targetablePlayers.map(player => (
            <div 
              key={player.id}
              className={`player-option ${selectedPlayers.includes(player.id) ? 'selected' : ''}`}
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
        {selectedPlayers.length > 0 ? 'Xác nhận' : 'Bỏ qua'}
      </button>
    </div>
  );
}

export default LyCuong;