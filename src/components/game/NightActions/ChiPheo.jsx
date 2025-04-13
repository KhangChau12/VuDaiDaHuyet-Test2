import React, { useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/night_actions.css';

function ChiPheo({ onAction }) {
  const { players } = usePlayerContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  // Tìm Chí Phèo
  const chiPheo = players.find(player => player.role === 'Chí Phèo' && player.alive);
  
  // Nếu Chí Phèo không tồn tại hoặc không còn sống, bỏ qua
  if (!chiPheo) {
    return (
      <div className="night-action-component">
        <h3>Chí Phèo</h3>
        <p>Chí Phèo không còn trong trò chơi.</p>
        <button 
          className="submit-button" 
          onClick={() => onAction({ type: 'skip' })}
        >
          Tiếp tục
        </button>
      </div>
    );
  }
  
  // Dựa vào phe của Chí Phèo để hiển thị các lựa chọn phù hợp
  const isJusticeTeam = chiPheo.team === 'Công Lý';
  const isPowerTeam = chiPheo.team === 'Quyền Thế';
  
  // Nếu chưa thuộc phe nào
  const isNeutral = !isJusticeTeam && !isPowerTeam;
  
  // Lọc ra những người chơi có thể bị tấn công (còn sống và không phải Chí Phèo)
  const targetablePlayers = players.filter(
    player => player.alive && player.id !== chiPheo.id
  );
  
  // Nếu thuộc phe Công Lý, chỉ có thể tấn công phe Quyền Thế
  const justiceTargets = isJusticeTeam ? 
    targetablePlayers.filter(player => player.team === 'Quyền Thế') : 
    targetablePlayers;
  
  const handleSelect = (playerId) => {
    setSelectedPlayer(playerId);
  };
  
  const handleSubmit = () => {
    if (selectedPlayer) {
      onAction({
        type: 'attack',
        targetId: selectedPlayer,
        team: chiPheo.team
      });
    } else {
      // Nếu không chọn ai, vẫn ghi nhận hành động bỏ qua
      onAction({
        type: 'skip',
        team: chiPheo.team
      });
    }
  };
  
  return (
    <div className="night-action-component">
      <h3>Chí Phèo</h3>
      
      {isNeutral && (
        <p>Chí Phèo, bạn chưa thuộc phe nào. Bạn có thể trở thành thành viên của phe Quyền Thế hoặc Công Lý dựa trên diễn biến của trò chơi.</p>
      )}
      
      {isJusticeTeam && (
        <>
          <p>Chí Phèo, bạn đang thuộc phe Công Lý. Bạn có thể tấn công một thành viên phe Quyền Thế.</p>
          <p className="warning">Nếu chọn đúng, bạn có thể tiếp tục tấn công đêm tiếp theo. Nếu chọn sai, bạn sẽ mất khả năng này.</p>
        </>
      )}
      
      {isPowerTeam && (
        <p>Chí Phèo, bạn đang thuộc phe Quyền Thế. Bạn có thể tấn công một người chơi bất kỳ.</p>
      )}
      
      {(isPowerTeam || isJusticeTeam) && (
        <div className="player-selection">
          <h4>Chọn người để tấn công:</h4>
          <div className="player-list">
            {(isJusticeTeam ? justiceTargets : targetablePlayers).map(player => (
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
      )}
      
      <button 
        className="submit-button" 
        onClick={handleSubmit}
      >
        {(isPowerTeam || isJusticeTeam) && selectedPlayer ? 'Xác nhận' : 'Tiếp tục'}
      </button>
    </div>
  );
}

export default ChiPheo;