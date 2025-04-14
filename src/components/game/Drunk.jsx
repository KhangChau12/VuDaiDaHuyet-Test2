import React, { useEffect, useState } from 'react';
import { usePlayerContext } from '../../context/PlayerContext';
import '../../styles/events.css';
import { handleChiPheoWine } from '../../services/gameLogic';

// Import Rượu asset
import Ruou from "../../assets/shop/RuouDe.jpg";

function Drunk({ onComplete }) {
  const { players, setDrunk, unsetDrunk, increaseWine, changeTeam } = usePlayerContext();
  const [drunkPlayers, setDrunkPlayers] = useState([]);
  const [chiPheoEffect, setChiPheoEffect] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  
  // Xử lý các người chơi bị say rượu
  useEffect(() => {
    // Tìm những người đang bị say rượu
    const drunk = players.filter(player => player.drunk);
    setDrunkPlayers(drunk);
    
    // Tìm Chí Phèo
    const chiPheo = players.find(player => player.role === 'Chí Phèo' && player.alive);
    
    // Kiểm tra xem Chí Phèo có đủ 3 điểm rượu không
    if (chiPheo && chiPheo.wine >= 3 && chiPheo.team !== 'Quyền Thế') {
      // Chuyển Chí Phèo sang phe Quyền Thế
      changeTeam(chiPheo.id, 'Quyền Thế');
      setChiPheoEffect({
        message: `${chiPheo.name} (Chí Phèo) đã chuyển sang phe Quyền Thế do nhận đủ 3 thẻ Say Rượu!`,
        newTeam: 'Quyền Thế'
      });
    }
    
    // Đánh dấu xử lý hoàn tất
    setIsProcessing(false);
  }, []);
  
  // Hủy bỏ hiệu ứng say rượu cho toàn bộ người chơi đã bị say rượu
  const handleClearDrunkStatus = () => {
    drunkPlayers.forEach(player => {
      unsetDrunk(player.id);
    });
    
    const messages = [
      ...drunkPlayers.map(player => `${player.name} đã hết say rượu.`),
    ];
    
    if (chiPheoEffect) {
      messages.push(chiPheoEffect.message);
    }
    
    onComplete(messages);
  };
  
  return (
    <div className="event-overlay">
      <div className="event-container wine-party">
        <h2>Tình Trạng Say Rượu</h2>
        
        {isProcessing ? (
          <p>Đang xử lý trạng thái say rượu...</p>
        ) : (
          <>
            {drunkPlayers.length > 0 ? (
              <>
                <p>Những người đang say rượu:</p>
                <div className="drunk-players-list">
                  {drunkPlayers.map(player => (
                    <div key={player.id} className="drunk-player-item">
                      <img src={Ruou} alt="Say rượu" className="drunk-icon" />
                      <span>{player.name} ({player.role})</span>
                    </div>
                  ))}
                </div>
                <p>Những người này sẽ không thể thực hiện chức năng của mình vào đêm nay.</p>
              </>
            ) : (
              <p>Không có ai đang say rượu.</p>
            )}
            
            {chiPheoEffect && (
              <div className="chi-pheo-effect">
                <h3>Sự kiện đặc biệt!</h3>
                <p className="warning">{chiPheoEffect.message}</p>
              </div>
            )}
            
            <button 
              className="complete-button" 
              onClick={handleClearDrunkStatus}
            >
              Tiếp tục
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Drunk;