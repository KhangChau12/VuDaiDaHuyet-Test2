import React from 'react';
import "../../styles/card.css";
import getPlayerImage from '../../assets/playerImages';

function Card(props) {
  const { player } = props;
  const cardImage = getPlayerImage(player.role);

  // Xác định các class CSS dựa trên trạng thái
  const cardClasses = [
    'card',
    player.drunk ? 'drunk' : '',
    player.shutup ? 'muted' : '',
    player.frustration > 0 ? 'frustrated' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={props.seeMenu}>
      <div className='background-card'>
        <img src={cardImage} alt={player.role} />
        {/* Hiển thị thẻ Say Rượu nếu người chơi đang say */}
        {player.drunk && <div className="drunk-overlay">Say rượu</div>}
        {/* Hiển thị thẻ Ép buộc nếu người chơi đang bị ép buộc */}
        {player.shutup && <div className="muted-overlay">Bị ép buộc</div>}
      </div>
      <div className='player-info'>
        <div className='stat'>
          {/* Hiển thị số tiền */}
          <span className="coin-count">{player.coins} đồng</span>
          {/* Hiển thị điểm uất ức */}
          {player.frustration > 0 && (
            <span className="frustration-count">{player.frustration} uất ức</span>
          )}
        </div>
        <h3>{player.name}</h3>
        <p>{player.role}</p>
      </div>
    </div>
  );
}

export default Card;