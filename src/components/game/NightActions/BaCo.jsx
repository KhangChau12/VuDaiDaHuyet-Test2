import React, { useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/night_actions.css';

function BaCo({ onAction }) {
  const { players } = usePlayerContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [result, setResult] = useState(null);
  
  // Lọc ra những người chơi có thể kiểm tra (còn sống)
  const targetablePlayers = players.filter(
    player => player.alive
  );
  
  // Tìm Thị Nở
  const thiNo = players.find(player => player.role === 'Thị Nở');
  
  const handleSelect = (playerId) => {
    setSelectedPlayer(playerId);
    setResult(null);
  };
  
  const handleCheck = () => {
    if (selectedPlayer) {
      const targetPlayer = players.find(p => p.id === selectedPlayer);
      const isPowerTheme = targetPlayer.team === 'Quyền Thế';
      
      setResult({
        isPowerTheme,
        message: isPowerTheme ? 
          `${targetPlayer.name} thuộc phe Quyền Thế!` : 
          `${targetPlayer.name} KHÔNG thuộc phe Quyền Thế.`
      });
    }
  };
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      onAction({
        type: 'check',
        targetId: selectedPlayer,
        isPowerTheme: result?.isPowerTheme || false
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
      <h3>Bà Cô của Thị Nở</h3>
      <p>Bà Cô, bạn muốn kiểm tra ai có thuộc phe Quyền Thế không?</p>
      
      {thiNo && (
        <div className="thi-no-info">
          <p>Thị Nở trong ván này là: {thiNo.name}</p>
        </div>
      )}
      
      <div className="player-selection">
        <h4>Chọn người để kiểm tra:</h4>
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
      
      {selectedPlayer && !result && (
        <button 
          className="submit-button" 
          onClick={handleCheck}
        >
          Kiểm tra
        </button>
      )}
      
      {result && (
        <div className="check-result">
          <p className={result.isPowerTheme ? 'warning' : 'success'}>
            {result.message}
          </p>
          <button 
            className="submit-button" 
            onClick={handleSubmit}
          >
            Tiếp tục
          </button>
        </div>
      )}
      
      {!selectedPlayer && (
        <button 
          className="submit-button" 
          onClick={handleSubmit}
        >
          Bỏ qua
        </button>
      )}
    </div>
  );
}

export default BaCo;