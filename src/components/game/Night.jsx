// File: src/components/game/Night.jsx - Sửa toàn bộ file

import React, { useEffect, useState } from 'react'
import "../../styles/home.css"

import background from "../../assets/image.png";
import { useGameContext } from '../../context/GameContext'
import { usePlayerContext } from '../../context/PlayerContext'
import { getNightActionPrompt } from '../../utils/nightSequence'
import { processDrunkEffects } from '../../utils/statusEffects'
import { checkAllVictoryConditions } from '../../services/victoryConditions'
import { getEventByDay } from '../../services/eventManager'
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
import Drunk from './Drunk'
import BlackMarket from './BlackMarket'

function Night({ date, onEnd }) {
  const { 
    currentEvent,
    nightPhase, 
    initNightSequence, 
    nextNightRole,
    recordNightAction,
    setGameOver 
  } = useGameContext();
  
  const { players, unsetDrunk } = usePlayerContext();
  
  const [showTitle, setShowTitle] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showDrunkEffects, setShowDrunkEffects] = useState(false);
  const [showBlackMarket, setShowBlackMarket] = useState(false);
  const [nightMessages, setNightMessages] = useState([]);
  
  // Kiểm tra điều kiện chiến thắng
  useEffect(() => {
    const victoryCheck = checkAllVictoryConditions(players);
    if (victoryCheck.victory) {
      setGameOver(victoryCheck.winner);
    }
  }, [players]);
  
  // Kiểm tra xem đêm hiện tại có phải là đêm trước ngày Chợ Phiên không
  useEffect(() => {
    // Lấy sự kiện của ngày tiếp theo
    const nextDayEvent = getEventByDay(date + 1);
    
    // Nếu ngày tiếp theo là ngày Chợ Phiên, hiện Chợ Đen
    if (nextDayEvent === 'market' && !showBlackMarket) {
      setShowBlackMarket(true);
      return;
    }
    
    // Xử lý trạng thái say rượu trước
    const alivePlayers = players.filter(p => p.alive);
    const drunkPlayerIds = processDrunkEffects(alivePlayers, unsetDrunk);
    if (drunkPlayerIds.length > 0 && !showDrunkEffects) {
      setShowDrunkEffects(true);
      return;
    }
    
    // Khởi tạo thứ tự gọi nhân vật
    initNightSequence(alivePlayers);
  }, [showBlackMarket, showDrunkEffects]);
  
  // Animation cho title
  useEffect(() => {
    setTimeout(() => {
      setShowTitle(false);
      setTimeout(() => {
        setAnimationComplete(true);
      }, 1000);
    }, 1000);
  }, []);
  
  // Xử lý hoàn thành Chợ Đen
  const handleBlackMarketComplete = (messages) => {
    setShowBlackMarket(false);
    if (messages && messages.length > 0) {
      setNightMessages([...nightMessages, ...messages]);
    }
  };
  
  // Xử lý hoàn thành Say Rượu
  const handleDrunkComplete = (messages) => {
    setShowDrunkEffects(false);
    if (messages && messages.length > 0) {
      setNightMessages([...nightMessages, ...messages]);
    }
  };
  
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
          
          {nightMessages.length > 0 && (
            <div className="night-messages">
              <h4>Tóm tắt sự kiện trong đêm:</h4>
              <ul>
                {nightMessages.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
          )}
          
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
      
      {/* Hiển thị Chợ Đen nếu đêm trước ngày Chợ Phiên */}
      {showBlackMarket && (
        <BlackMarket onComplete={handleBlackMarketComplete} />
      )}
      
      {/* Hiển thị xử lý Say Rượu */}
      {showDrunkEffects && !showBlackMarket && (
        <Drunk onComplete={handleDrunkComplete} />
      )}
      
      {animationComplete && !showBlackMarket && !showDrunkEffects && (
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