import React, { useState, useEffect } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/events.css';

// Thêm asset cho thẻ Say Rượu nếu có
import Ruou from "../../../assets/shop/RuouDe.png";

function WineParty({ onComplete }) {
  const { players, setDrunk, increaseWine } = usePlayerContext();
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [isRandom, setIsRandom] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Danh sách người chơi còn sống
  const alivePlayers = players.filter(player => player.alive);

  // Tự động chọn ngẫu nhiên 3 người khi component được mount
  useEffect(() => {
    if (isRandom) {
      randomizeWineDistribution();
    }
  }, []);

  // Chọn ngẫu nhiên 3 người
  const randomizeWineDistribution = () => {
    // Reset nếu đã chọn trước đó
    selectedPlayers.forEach(playerId => {
      // Do nothing - we'll set new ones
    });
    
    // Lấy danh sách người chơi còn sống
    const availablePlayers = [...alivePlayers];
    const selected = [];
    const log = [];
    
    // Chọn ngẫu nhiên 3 người hoặc tất cả nếu ít hơn 3
    const count = Math.min(3, availablePlayers.length);
    
    for (let i = 0; i < count; i++) {
      if (availablePlayers.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * availablePlayers.length);
      const player = availablePlayers.splice(randomIndex, 1)[0];
      
      selected.push(player.id);
      log.push(`${player.name} (${player.role}) nhận thẻ Say Rượu.`);
      
      // Đánh dấu người bị say
      setDrunk(player.id);
      
      // Nếu là Chí Phèo, tăng điểm rượu
      if (player.role === 'Chí Phèo') {
        increaseWine(player.id, 1);
        log.push(`${player.name} (Chí Phèo) tích lũy thêm 1 điểm rượu.`);
      }
    }
    
    setSelectedPlayers(selected);
    setDistribution(log);
    setIsComplete(true);
  };

  // Chọn thủ công
  const togglePlayerSelection = (playerId) => {
    if (!isRandom) {
      if (selectedPlayers.includes(playerId)) {
        setSelectedPlayers(selectedPlayers.filter(id => id !== playerId));
      } else if (selectedPlayers.length < 3) {
        setSelectedPlayers([...selectedPlayers, playerId]);
      }
    }
  };

  // Xác nhận chọn thủ công
  const confirmManualSelection = () => {
    const log = [];
    
    selectedPlayers.forEach(playerId => {
      const player = players.find(p => p.id === playerId);
      
      setDrunk(playerId);
      log.push(`${player.name} (${player.role}) nhận thẻ Say Rượu.`);
      
      // Nếu là Chí Phèo, tăng điểm rượu
      if (player.role === 'Chí Phèo') {
        increaseWine(playerId, 1);
        log.push(`${player.name} (Chí Phèo) tích lũy thêm 1 điểm rượu.`);
      }
    });
    
    setDistribution(log);
    setIsComplete(true);
  };

  // Kết thúc sự kiện
  const handleComplete = () => {
    onComplete(distribution);
  };

  // Chuyển đổi giữa chọn ngẫu nhiên và thủ công
  const toggleMode = () => {
    if (isComplete) return;
    
    setIsRandom(!isRandom);
    setSelectedPlayers([]);
  };

  return (
    <div className="event-overlay">
      <div className="event-container wine-party">
        <h2>Tiệc Rượu</h2>
        <p>Ba người ngẫu nhiên sẽ nhận thẻ Say Rượu.</p>
        
        {!isComplete && (
          <div className="selection-mode">
            <button 
              className={`mode-button ${isRandom ? 'active' : ''}`}
              onClick={() => toggleMode()}
            >
              Chọn ngẫu nhiên
            </button>
            <button 
              className={`mode-button ${!isRandom ? 'active' : ''}`}
              onClick={() => toggleMode()}
            >
              Chọn thủ công
            </button>
          </div>
        )}
        
        {!isComplete && isRandom && (
          <div className="random-selection">
            <button 
              className="randomize-button"
              onClick={randomizeWineDistribution}
            >
              Chọn ngẫu nhiên 3 người
            </button>
          </div>
        )}
        
        {!isComplete && !isRandom && (
          <div className="manual-selection">
            <p>Chọn tối đa 3 người để nhận thẻ Say Rượu:</p>
            <div className="player-list">
              {alivePlayers.map(player => (
                <div 
                  key={player.id}
                  className={`player-option ${selectedPlayers.includes(player.id) ? 'selected' : ''}`}
                  onClick={() => togglePlayerSelection(player.id)}
                >
                  {player.name} ({player.role})
                </div>
              ))}
            </div>
            <button 
              className="confirm-button"
              onClick={confirmManualSelection}
              disabled={selectedPlayers.length === 0}
            >
              Xác nhận
            </button>
          </div>
        )}
        
        {isComplete && (
          <div className="distribution-result">
            <h3>Kết quả phân phối:</h3>
            <ul>
              {distribution.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
          </div>
        )}
        
        <button 
          className="complete-button"
          onClick={handleComplete}
          disabled={!isComplete}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}

export default WineParty;