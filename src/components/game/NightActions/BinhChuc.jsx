import React from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import '../../../styles/night_actions.css';

function BinhChuc({ onAction }) {
  const { players } = usePlayerContext();
  
  // Tìm các thành viên phe Quyền Thế
  const powerThemeMembers = players.filter(
    player => player.alive && player.team === 'Quyền Thế'
  );
  
  const handleSubmit = () => {
    onAction({
      type: 'info'
    });
  };
  
  return (
    <div className="night-action-component">
      <h3>Binh Chức</h3>
      <p>Binh Chức, hãy nhớ rằng nếu bạn bị loại, bạn sẽ kéo theo một thành viên phe Quyền Thế gần nhất bên phải.</p>
      
      <div className="binh-chuc-info">
        <h4>Thành viên phe Quyền Thế:</h4>
        <div className="player-list">
          {powerThemeMembers.map(player => (
            <div 
              key={player.id}
              className="player-option"
            >
              {player.name} ({player.role})
            </div>
          ))}
        </div>
      </div>
      
      <button 
        className="submit-button" 
        onClick={handleSubmit}
      >
        Tiếp tục
      </button>
    </div>
  );
}

export default BinhChuc;