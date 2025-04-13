import React, { useEffect, useState } from 'react'
import "../../styles/home.css"

import background from "../../assets/image.png";
import { useGameContext } from '../../context/GameContext'
import { usePlayerContext } from '../../context/PlayerContext'
import { getNightActionPrompt } from '../../utils/nightSequence'
import PowerTheme from './NightActions/PowerTheme'
import BaKien from './NightActions/BaKien'
import LyCuong from './NightActions/LyCuong'
import BaBa from './NightActions/BaBa'
import DoiTao from './NightActions/DoiTao'
import LaoHac from './NightActions/LaoHac'
import ThiNo from './NightActions/ThiNo'
import OngGiao from './NightActions/OngGiao'
import BaCo from './NightActions/BaCo'
import BinhChuc from './NightActions/BinhChuc'
import ChiPheo from './NightActions/ChiPheo'
import NamTho from './NightActions/NamTho'
import TuLang from './NightActions/TuLang'

function Night({ date, onEnd }) {
  const { 
    nightPhase, 
    initNightSequence, 
    nextNightRole,
    recordNightAction 
  } = useGameContext();
  
  const { players } = usePlayerContext();
  
  const [showTitle, setShowTitle] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  
  // Khởi tạo thứ tự gọi nhân vật ban đêm
  useEffect(() => {
    const alivePlayers = players.filter(p => p.alive);
    initNightSequence(alivePlayers);
  }, []);
  
  // Animation cho title
  useEffect(() => {
    setTimeout(() => {
      setShowTitle(false);
      setTimeout(() => {
        setAnimationComplete(true);
      }, 1000);
    }, 1000);
  }, []);
  
  // Xử lý hành động của nhân vật hiện tại
  const handleRoleAction = (action) => {
    // Ghi lại hành động
    recordNightAction(nightPhase.currentRole, action);
    
    // Chuyển sang nhân vật tiếp theo
    nextNightRole();
  };
  
  // Hiển thị component tương ứng với vai trò hiện tại
  const renderRoleComponent = () => {
    const { currentRole } = nightPhase;
    
    if (!currentRole) {
      return (
        <div className="night-summary">
          <h3>Kết thúc đêm</h3>
          <p>Tất cả nhân vật đã thực hiện hành động trong đêm.</p>
          <button 
            className="submit-button" 
            onClick={onEnd}
          >
            Bắt đầu ngày mới
          </button>
        </div>
      );
    }
    
    // Map vai trò với component tương ứng
    const roleComponents = {
      'PowerTheme': PowerTheme,
      'Bá Kiến': BaKien,
      'Lý Cường': LyCuong,
      'Bà Ba': BaBa,
      'Đội Tảo': DoiTao,
      'Lão Hạc': LaoHac,
      'Thị Nở': ThiNo,
      'Ông Giáo': OngGiao,
      'Bà Cô của Thị Nở': BaCo,
      'Binh Chức': BinhChuc,
      'Chí Phèo': ChiPheo,
      'Năm Thọ': NamTho,
      'Tự Lãng': TuLang,
    };
    
    const RoleComponent = roleComponents[currentRole];
    
    if (RoleComponent) {
      return <RoleComponent onAction={handleRoleAction} />;
    }
    
    // Fallback cho vai trò không có component riêng
    return (
      <div className="night-role">
        <h3>{currentRole}</h3>
        <p>{getNightActionPrompt(currentRole)}</p>
        <button 
          className="submit-button" 
          onClick={() => handleRoleAction({ type: 'skip' })}
        >
          Tiếp tục
        </button>
      </div>
    );
  };
  
  return (
    <div className='game'>
      <div className='background'>
        <img src={background} alt="Background" />
      </div>
      
      {showTitle && (
        <div id='title' style={{ opacity: showTitle ? 1 : 0, transition: 'opacity 1s' }}>
          <h2>ĐÊM {date}</h2>
        </div>
      )}
      
      {animationComplete && (
        <div className="night-container">
          <div id='game_title' style={{ opacity: 1 }}>
            <h2>Đêm đến, mọi người đi ngủ</h2>
          </div>
          
          <div className="night-actions-container">
            {renderRoleComponent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default Night;