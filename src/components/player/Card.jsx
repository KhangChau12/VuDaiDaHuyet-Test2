import React from 'react';
import "../../styles/card.css";
import getPlayerImage from '../../assets/playerImages';
import EpBuoc from '../../assets/icons/EpBuoc.svg';
import SayRuou from '../../assets/icons/SayRuou.svg';
import Tien from '../../assets/icons/Tien.svg';
import UatUc1 from '../../assets/icons/UatUc1.svg';
import UatUc2 from '../../assets/icons/UatUc2.svg';

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

  // Đảm bảo sự kiện click được kích hoạt đúng
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.seeMenu && player.alive) {
      props.seeMenu();
    }
  };

  return (
    <div className={cardClasses} style={{position: 'relative'}} onClick={handleClick}>
      <div className='background-card'>
        <img src={cardImage} alt={player.role} />
        {/* Hiển thị thẻ Say Rượu nếu người chơi đang say */}
        {player.drunk && <div className="drunk-overlay"></div>}
        {!player.alive && <div className='dead-overlay'></div>}
      </div>
      <div className='player-info'>
        <div className='stat'>
          {/* Hiển thị số tiền */}
          <span className="coin-count"><img src={Tien} alt="Tien" /> {player.coins}</span>
          <span className="others">
            {/* Hiển thị điểm uất ức */}
            {player.frustration == 1 && (
              <span className="frustration-count"><img src={UatUc1} alt="UatUc1" /></span>
            )}
            {player.frustration == 2 && (
              <span className="frustration-count"><img src={UatUc1} alt="UatUc2" /></span>
            )}
            {player.drunk && (
              <span className="drunk">{player.wine} <img src={SayRuou} alt="SayRuou" /></span>
            )}
          </span>
        </div>
        <h3>{player.name}</h3>
        <p>{player.role}</p>
      </div>
    </div>
  );
}

export default Card;