import React, { useEffect, useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/events.css';

function HarvestDay({ onComplete }) {
  const { players, addCoins } = usePlayerContext();
  const [distributionComplete, setDistributionComplete] = useState(false);
  const [distributionLog, setDistributionLog] = useState([]);
  useEffect(() => {
    // Tự động phân phối tiền
    const log = [];
    
    players.forEach(player => {
      if (player.alive) {
        if (player.team === 'Quyền Thế') {
          // Phe Quyền Thế nhận 1 đồng
          addCoins(player.id, 1);
          log.push(`${player.name} (Phe Quyền Thế) nhận được 1 đồng.`);
        } else {
          // Phe khác nhận 2 đồng
          addCoins(player.id, 2);
          log.push(`${player.name} (Phe ${player.team}) nhận được 2 đồng.`);
        }
      }
    });
    
    setDistributionLog(log);
    setDistributionComplete(true);
  }, []);

  const handleComplete = () => {
    onComplete(distributionLog);
  };

  return (
    <div className="event-overlay">
      <div className="event-container harvest-day">
        <h2>Ngày Thu Hoạch</h2>
        
        {distributionComplete ? (
          <>
            <p>Thu hoạch đã hoàn tất!</p>
            <div className="distribution-log">
              <h3>Kết quả Thu Hoạch:</h3>
              <ul>
                {distributionLog.map((entry, index) => (
                  <li key={index}>{entry}</li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <p>Đang phân phối tiền thu hoạch...</p>
        )}
        
        <button 
          className="complete-button" 
          onClick={handleComplete}
          disabled={!distributionComplete}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}

export default HarvestDay;