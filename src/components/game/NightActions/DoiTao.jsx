import React, { useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import { useGameContext } from '../../../context/GameContext';
import '../../../styles/night_actions.css';

function DoiTao({ onAction }) {
  const { players } = usePlayerContext();
  const { nightPhase } = useGameContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [actionType, setActionType] = useState('force'); // 'force' or 'kill'
  const [hasUsedKill, setHasUsedKill] = useState(false);
  
  // Kiểm tra xem đã sử dụng thanh trừng chưa (từ nightPhase)
  useState(() => {
    const prevActions = nightPhase.actions;
    // Nếu đã có hành động giết người trước đó
    if (prevActions && prevActions['Đội Tảo'] && prevActions['Đội Tảo'].hasUsedKill) {
      setHasUsedKill(true);
    }
  }, []);
  
  // Lọc ra những người chơi có thể bị ép buộc (không phải phe Quyền Thế và còn sống)
  const targetablePlayers = players.filter(
    player => player.alive && player.team !== 'Quyền Thế' && player.role !== 'Đội Tảo'
  );
  
  const handleSelect = (playerId) => {
    setSelectedPlayer(playerId);
  };
  
  const handleActionTypeChange = (type) => {
    setActionType(type);
    setSelectedPlayer(null);
  };
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      onAction({
        type: actionType,
        targetId: selectedPlayer,
        hasUsedKill: actionType === 'kill' || hasUsedKill
      });
    } else {
      // Nếu không chọn ai, vẫn ghi nhận hành động bỏ qua
      onAction({
        type: 'skip',
        hasUsedKill
      });
    }
  };
  
  return (
    <div className="night-action-component">
      <h3>Đội Tảo</h3>
      
      <div className="action-type-selection">
        <button 
          className={`action-type-button ${actionType === 'force' ? 'selected' : ''}`}
          onClick={() => handleActionTypeChange('force')}
        >
          Ép buộc
        </button>
        
        <button 
          className={`action-type-button ${actionType === 'kill' ? 'selected' : ''}`}
          onClick={() => handleActionTypeChange('kill')}
          disabled={hasUsedKill}
        >
          Thanh trừng {hasUsedKill && '(Đã sử dụng)'}
        </button>
      </div>
      
      {actionType === 'force' && (
        <>
          <p>Đội Tảo, bạn muốn ép buộc ai về phe mình?</p>
          <div className="player-selection">
            <h4>Chọn người để ép buộc:</h4>
            <div className="player-list">
              {targetablePlayers.map(player => (
                <div 
                  key={player.id}
                  className={`player-option ${selectedPlayer === player.id ? 'selected' : ''}`}
                  onClick={() => handleSelect(player.id)}
                >
                  {player.name} ({player.role}) 
                  {player.shutup && ' - Đã bị ép buộc'}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      {actionType === 'kill' && !hasUsedKill && (
        <>
          <p>Đội Tảo, bạn muốn thanh trừng ai?</p>
          <p className="warning">Lưu ý: Bạn chỉ có thể sử dụng thanh trừng một lần duy nhất trong trò chơi!</p>
          <div className="player-selection">
            <h4>Chọn người để thanh trừng:</h4>
            <div className="player-list">
              {players.filter(p => p.alive && p.id !== players.find(pl => pl.role === 'Đội Tảo')?.id).map(player => (
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
        </>
      )}
      
      {actionType === 'kill' && hasUsedKill && (
        <p>Bạn đã sử dụng khả năng thanh trừng. Không thể sử dụng lại.</p>
      )}
      
      <button 
        className="submit-button" 
        onClick={handleSubmit}
        disabled={actionType === 'kill' && hasUsedKill}
      >
        {selectedPlayer ? 'Xác nhận' : 'Bỏ qua'}
      </button>
    </div>
  );
}

export default DoiTao;