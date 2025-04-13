import React, { useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/night_actions.css';

function OngGiao({ onAction }) {
  const { players } = usePlayerContext();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [result, setResult] = useState(null);
  
  // Lọc ra những người chơi có thể kiểm tra (còn sống)
  const targetablePlayers = players.filter(
    player => player.alive
  );
  
  const handleSelect = (playerId) => {
    // Nếu đã chọn người này rồi thì bỏ chọn
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
      setResult(null);
    } 
    // Nếu chưa chọn đủ 2 người thì thêm vào
    else if (selectedPlayers.length < 2) {
      setSelectedPlayers([...selectedPlayers, playerId]);
      setResult(null);
    }
  };
  
  const handleCheck = () => {
    if (selectedPlayers.length === 2) {
      const player1 = players.find(p => p.id === selectedPlayers[0]);
      const player2 = players.find(p => p.id === selectedPlayers[1]);
      
      const sameTeam = player1.team === player2.team;
      
      setResult({
        sameTeam,
        message: sameTeam ? 
          `${player1.name} và ${player2.name} thuộc cùng phe!` : 
          `${player1.name} và ${player2.name} KHÔNG thuộc cùng phe!`
      });
    }
  };
  
  const handleSubmit = () => {
    if (selectedPlayers.length === 2) {
      onAction({
        type: 'check',
        targetIds: selectedPlayers,
        sameTeam: result?.sameTeam || false
      });
    } else {
      // Nếu không chọn đủ, vẫn ghi nhận hành động bỏ qua
      onAction({
        type: 'skip'
      });
    }
  };
  
  return (
    <div className="night-action-component">
      <h3>Ông Giáo</h3>
      <p>Ông Giáo, bạn muốn kiểm tra xem hai người nào có thuộc cùng phe không?</p>
      
      <div className="player-selection">
        <h4>Chọn hai người để kiểm tra ({selectedPlayers.length}/2):</h4>
        <div className="player-list">
          {targetablePlayers.map(player => (
            <div 
              key={player.id}
              className={`player-option ${selectedPlayers.includes(player.id) ? 'selected' : ''}`}
              onClick={() => handleSelect(player.id)}
            >
              {player.name} ({player.role})
            </div>
          ))}
        </div>
      </div>
      
      {selectedPlayers.length === 2 && !result && (
        <button 
          className="submit-button" 
          onClick={handleCheck}
        >
          Kiểm tra
        </button>
      )}
      
      {result && (
        <div className="check-result">
          <p className={result.sameTeam ? 'success' : 'failure'}>
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
      
      {selectedPlayers.length !== 2 && !result && (
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

export default OngGiao;