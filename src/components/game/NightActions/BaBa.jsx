import React, { useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/night_actions.css';

function BaBa({ onAction }) {
  const { players } = usePlayerContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [result, setResult] = useState(null);
  
  // Lọc ra những người chơi có thể kiểm tra (còn sống)
  const targetablePlayers = players.filter(
    player => player.alive
  );
  
  const handleSelect = (playerId) => {
    setSelectedPlayer(playerId);
    setResult(null);
  };
  
  const handleCheck = () => {
    if (selectedPlayer) {
      const targetPlayer = players.find(p => p.id === selectedPlayer);
      const isChiPheo = targetPlayer.role === 'Chí Phèo';
      
      setResult({
        isChiPheo,
        message: isChiPheo ? 
          `${targetPlayer.name} là Chí Phèo!` : 
          `${targetPlayer.name} không phải là Chí Phèo.`
      });
    }
  };
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      onAction({
        type: 'check',
        targetId: selectedPlayer,
        isChiPheo: result?.isChiPheo || false
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
      <h3>Bà Ba</h3>
      <p>Bà Ba, bạn muốn kiểm tra ai là Chí Phèo?</p>
      
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
          <p className={result.isChiPheo ? 'success' : 'failure'}>
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

export default BaBa;