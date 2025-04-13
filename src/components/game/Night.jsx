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
  
  const { 
    players, 
    unsetDrunk, 
    increaseFrustration, 
    decreaseFrustration,
    removeCoins,
    addCoins,
    removePlayer,
    setMuted
  } = usePlayerContext();
  
  const [showTitle, setShowTitle] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showDrunkEffects, setShowDrunkEffects] = useState(false);
  const [showBlackMarket, setShowBlackMarket] = useState(false);
  const [nightMessages, setNightMessages] = useState([]);
  const [actionsProcessed, setActionsProcessed] = useState(false);
  
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

  // Xử lý các hành động đêm khi kết thúc tất cả các lượt
  useEffect(() => {
    // Chỉ xử lý khi tất cả nhân vật đã hành động và chưa xử lý các hành động
    if (!nightPhase.currentRole && nightPhase.actions && Object.keys(nightPhase.actions).length > 0 && !actionsProcessed) {
      processNightActions();
      setActionsProcessed(true);
    }
  }, [nightPhase.currentRole, nightPhase.actions]);
  
  // Animation cho title
  useEffect(() => {
    setTimeout(() => {
      setShowTitle(false);
      setTimeout(() => {
        setAnimationComplete(true);
      }, 1000);
    }, 1000);
  }, []);
  
  // Xử lý các hành động đêm
  const processNightActions = () => {
    const { actions } = nightPhase;
    const messages = [];
    
    // Tìm người được Lão Hạc bảo vệ
    const protectedPlayerId = actions['Lão Hạc']?.targetId;
    
    // Xử lý đàn áp từ phe Quyền Thế
    if (actions['PowerTheme']?.type === 'oppress') {
      const targetId = actions['PowerTheme'].targetId;
      const targetPlayer = players.find(p => p.id === targetId);
      
      if (targetPlayer && targetId !== protectedPlayerId) {
        increaseFrustration(targetId, 1);
        messages.push(`${targetPlayer.name} bị đàn áp bởi phe Quyền Thế và tăng 1 điểm uất ức.`);
      } else if (targetPlayer && targetId === protectedPlayerId) {
        messages.push(`${targetPlayer.name} được Lão Hạc bảo vệ khỏi đàn áp.`);
      }
    }
    
    // Xử lý đàn áp từ Bá Kiến
    if (actions['Bá Kiến']?.type === 'oppress') {
      const targetId = actions['Bá Kiến'].targetId;
      const targetPlayer = players.find(p => p.id === targetId);
      
      if (targetPlayer && targetId !== protectedPlayerId) {
        increaseFrustration(targetId, 1);
        messages.push(`${targetPlayer.name} bị đàn áp bởi Bá Kiến và tăng 1 điểm uất ức.`);
      } else if (targetPlayer && targetId === protectedPlayerId) {
        messages.push(`${targetPlayer.name} được Lão Hạc bảo vệ khỏi đàn áp.`);
      }
    }
    
    // Xử lý tống tiền từ Lý Cường
    if (actions['Lý Cường']?.type === 'extort') {
      const targetIds = actions['Lý Cường'].targetIds || [];
      let totalExtortedMoney = 0;
      
      targetIds.forEach(targetId => {
        const targetPlayer = players.find(p => p.id === targetId);
        if (targetPlayer && targetPlayer.coins > 0) {
          removeCoins(targetId, 1);
          totalExtortedMoney += 1;
          messages.push(`${targetPlayer.name} bị Lý Cường tống tiền 1 đồng.`);
        }
      });
      
      // Phân chia tiền cho phe Quyền Thế
      if (totalExtortedMoney > 0) {
        const powerThemeMembers = players.filter(p => p.team === 'Quyền Thế' && p.alive);
        const sharePerMember = Math.floor(totalExtortedMoney / powerThemeMembers.length);
        const remainder = totalExtortedMoney % powerThemeMembers.length;
        
        powerThemeMembers.forEach((member, index) => {
          const share = index < remainder ? sharePerMember + 1 : sharePerMember;
          if (share > 0) {
            addCoins(member.id, share);
          }
        });
        
        messages.push(`Phe Quyền Thế nhận được ${totalExtortedMoney} đồng từ tống tiền.`);
      }
    }
    
    // Xử lý giúp đỡ từ Thị Nở
    if (actions['Thị Nở']?.type === 'help') {
      const targetId = actions['Thị Nở'].targetId;
      const targetPlayer = players.find(p => p.id === targetId);
      
      if (targetPlayer && targetPlayer.frustration > 0) {
        decreaseFrustration(targetId, 1);
        messages.push(`${targetPlayer.name} được Thị Nở giúp đỡ giảm 1 điểm uất ức.`);
      }
    }
    
    // Xử lý ép buộc từ Đội Tảo
    if (actions['Đội Tảo']?.type === 'force') {
      const targetId = actions['Đội Tảo'].targetId;
      const targetPlayer = players.find(p => p.id === targetId);
      
      if (targetPlayer && !targetPlayer.shutup) {
        setMuted(targetId);
        messages.push(`${targetPlayer.name} bị Đội Tảo ép buộc.`);
      }
    }
    
    // Xử lý thanh trừng từ Đội Tảo
    if (actions['Đội Tảo']?.type === 'kill') {
      const targetId = actions['Đội Tảo'].targetId;
      const targetPlayer = players.find(p => p.id === targetId);
      
      if (targetPlayer) {
        removePlayer(targetId);
        messages.push(`${targetPlayer.name} bị Đội Tảo thanh trừng và rời khỏi làng.`);
      }
    }
    
    // Xử lý tấn công từ Chí Phèo
    if (actions['Chí Phèo']?.type === 'attack') {
      const targetId = actions['Chí Phèo'].targetId;
      const targetPlayer = players.find(p => p.id === targetId);
      
      if (targetPlayer) {
        removePlayer(targetId);
        messages.push(`${targetPlayer.name} bị Chí Phèo tấn công và rời khỏi làng.`);
      }
    }
    
    // Xử lý cướp tiền từ Năm Thọ
    if (actions['Năm Thọ']?.type === 'rob') {
      const targetId = actions['Năm Thọ'].targetId;
      const targetPlayer = players.find(p => p.id === targetId);
      const namTho = players.find(p => p.role === 'Năm Thọ');
      
      if (targetPlayer && targetPlayer.role === 'Bá Kiến') {
        // Nếu cướp nhầm Bá Kiến
        if (namTho) {
          removePlayer(namTho.id);
          messages.push(`Năm Thọ cướp nhầm nhà Bá Kiến và phải rời khỏi làng.`);
        }
      } else if (targetPlayer) {
        // Cướp thành công
        const amountToRob = Math.min(targetPlayer.coins, 3);
        if (amountToRob > 0) {
          removeCoins(targetId, amountToRob);
          if (namTho) {
            addCoins(namTho.id, amountToRob);
          }
          messages.push(`${targetPlayer.name} bị Năm Thọ cướp ${amountToRob} đồng.`);
        }
      }
    }
    
    // Xử lý bán rượu từ Tự Lãng
    if (actions['Tự Lãng']?.type === 'sell') {
      const targetId = actions['Tự Lãng'].targetId;
      const targetPlayer = players.find(p => p.id === targetId);
      const tuLang = players.find(p => p.role === 'Tự Lãng');
      
      if (targetPlayer && targetPlayer.coins > 0) {
        removeCoins(targetId, 1);
        if (tuLang) {
          addCoins(tuLang.id, 1);
        }
        messages.push(`${targetPlayer.name} mua rượu từ Tự Lãng.`);
      }
    }
    
    // Cập nhật tin nhắn đêm
    if (messages.length > 0) {
      setNightMessages(prev => [...prev, ...messages]);
    }
  };
  
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