// File: src/components/game/Night.jsx

import React, { useEffect, useState } from 'react'
import "../../styles/home.css"

import background from "../../assets/image.jpg";
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
    setMuted,
    changeTeam
  } = usePlayerContext();
  
  const [showTitle, setShowTitle] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showDrunkEffects, setShowDrunkEffects] = useState(false);
  const [showBlackMarket, setShowBlackMarket] = useState(false);
  const [blackMarketCompleted, setBlackMarketCompleted] = useState(false);
  const [nightMessages, setNightMessages] = useState([]);
  const [protectedPlayerId, setProtectedPlayerId] = useState(null);
  const [playersToRemove, setPlayersToRemove] = useState([]);
  const [nightEnded, setNightEnded] = useState(false);
  
  // Thêm state để theo dõi người bị đàn áp trong đêm hiện tại và số lần bị đàn áp
  const [oppressedInNight, setOppressedInNight] = useState({});
  
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
    
    // Nếu ngày tiếp theo là ngày Chợ Phiên, hiện Chợ Đen (chỉ khi chưa hoàn thành)
    if (nextDayEvent === 'market' && !showBlackMarket && !blackMarketCompleted) {
      setShowBlackMarket(true);
      return;
    }
    
    // Xử lý trạng thái say rượu trước
    const alivePlayers = players.filter(p => p.alive);
    const drunkPlayerIds = processDrunkEffects(alivePlayers);
    if (drunkPlayerIds.length > 0 && !showDrunkEffects) {
      setShowDrunkEffects(true);
      return;
    }
    
    // Khởi tạo thứ tự gọi nhân vật
    initNightSequence(alivePlayers);
    
    // Reset state theo dõi người bị đàn áp khi đêm mới bắt đầu
    setOppressedInNight({});
  }, [showBlackMarket, showDrunkEffects, blackMarketCompleted]);

  // Xử lý các tác động của điểm uất ức khi đêm kết thúc
  useEffect(() => {
    if (nightEnded && !nightPhase.currentRole) {
      processEndOfNightEffects();
    }
  }, [nightEnded]);

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
    setBlackMarketCompleted(true);
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
  
  // Xử lý hiệu ứng cuối đêm
  const processEndOfNightEffects = () => {
    const newMessages = [];
    
    // Tạo bản sao của danh sách người chơi để kiểm tra
    const allPlayers = [...players];
    
    // Xử lý từng người trong danh sách có nguy cơ bị loại
    playersToRemove.forEach(playerId => {
      const player = allPlayers.find(p => p.id === playerId);
      
      // Kiểm tra lại xem người này có còn đủ điều kiện bị loại không
      if (player && player.alive && player.frustration >= 2) {
        if (player.role === 'Chí Phèo') {
          // Chí Phèo chuyển sang phe Công Lý thay vì bị loại
          changeTeam(playerId, 'Công Lý');
          newMessages.push(`${player.name} (Chí Phèo) đã chuyển sang phe Công Lý do tích lũy 2 điểm uất ức!`);
        } else if (player.role === 'Binh Chức') {
          // Binh Chức kéo theo 1 thành viên phe Quyền Thế bên phải
          removePlayer(playerId);
          newMessages.push(`${player.name} (Binh Chức) đã rời khỏi làng do tích lũy 2 điểm uất ức.`);
          
          // Tìm thành viên phe Quyền Thế gần nhất bên phải
          const powerThemeMembers = allPlayers.filter(p => p.team === 'Quyền Thế' && p.alive);
          if (powerThemeMembers.length > 0) {
            // TODO: Tìm thành viên phe Quyền Thế gần nhất bên phải
            // (Giản lược ở đây, sẽ lấy thành viên đầu tiên)
            const targetId = powerThemeMembers[0].id;
            removePlayer(targetId);
            newMessages.push(`${powerThemeMembers[0].name} (${powerThemeMembers[0].role}) cũng bị loại do hiệu ứng của Binh Chức.`);
          }
        } else {
          // Người chơi thông thường rời làng
          removePlayer(playerId);
          newMessages.push(`${player.name} (${player.role}) đã rời khỏi làng do tích lũy 2 điểm uất ức.`);
        }
      }
    });
    
    // Cập nhật messages
    if (newMessages.length > 0) {
      setNightMessages(prev => [...prev, ...newMessages]);
    }
    
    // Reset danh sách
    setPlayersToRemove([]);
  };
  
  // Kiểm tra và cập nhật danh sách người chơi có thể bị loại
  const checkAndUpdateRemovalList = (playerId) => {
    const player = players.find(p => p.id === playerId);
    
    if (player && player.frustration >= 2) {
      // Nếu người chơi đã có trong danh sách thì không thêm lại
      if (!playersToRemove.includes(playerId)) {
        setPlayersToRemove(prev => [...prev, playerId]);
      }
    } else {
      // Nếu điểm uất ức đã giảm dưới 2, loại khỏi danh sách
      setPlayersToRemove(prev => prev.filter(id => id !== playerId));
    }
  };
  
  // Cập nhật danh sách người bị đàn áp trong đêm
  const addOppressionToNight = (playerId) => {
    setOppressedInNight(prev => {
      const newOppressed = {...prev};
      newOppressed[playerId] = (newOppressed[playerId] || 0) + 1;
      return newOppressed;
    });
  };
  
  // Xử lý hành động của nhân vật ngay khi nó xảy ra
  const handleRoleAction = (action) => {
    const currentRole = nightPhase.currentRole;
    let messages = [];
    
    // Nếu đây là lượt cuối, đánh dấu đêm kết thúc
    if (nightPhase.currentIndex === nightPhase.sequence.length - 1) {
      setNightEnded(true);
    }
    
    // Xử lý hành động dựa vào vai trò
    switch (currentRole) {
      case 'Lão Hạc':
        if (action.type === 'protect' && action.targetId) {
          const targetPlayer = players.find(p => p.id === action.targetId);
          setProtectedPlayerId(action.targetId);
          
          // Kiểm tra xem người này đã bị đàn áp trong đêm chưa
          if (oppressedInNight[action.targetId] && oppressedInNight[action.targetId] > 0) {
            // Số lần bị đàn áp
            const oppressedTimes = oppressedInNight[action.targetId];
            
            // Hoàn tác toàn bộ điểm uất ức từ đàn áp trong đêm
            decreaseFrustration(action.targetId, oppressedTimes);
            
            // Xóa người này khỏi danh sách bị đàn áp
            setOppressedInNight(prev => {
              const newOppressed = {...prev};
              delete newOppressed[action.targetId];
              return newOppressed;
            });
            
            messages.push(`${targetPlayer.name} được Lão Hạc bảo vệ, đã tránh khỏi ${oppressedTimes} lần đàn áp đêm nay.`);
            
            // Kiểm tra lại xem người này có còn nằm trong danh sách cần xử lý không
            checkAndUpdateRemovalList(action.targetId);
          } else {
            messages.push(`Lão Hạc đã bảo vệ ${targetPlayer?.name} khỏi bị đàn áp.`);
          }
        }
        break;
      
      case 'PowerTheme':
        if (action.type === 'oppress' && action.targetId) {
          const targetPlayer = players.find(p => p.id === action.targetId);
          
          if (targetPlayer) {
            // Tăng điểm uất ức
            increaseFrustration(action.targetId, 1);
            
            // Thêm vào danh sách bị đàn áp đêm nay
            addOppressionToNight(action.targetId);
            
            messages.push(`${targetPlayer.name} bị đàn áp bởi phe Quyền Thế và tăng 1 điểm uất ức.`);
            
            // Kiểm tra nếu người này đã tích lũy đủ 2 điểm uất ức
            checkAndUpdateRemovalList(action.targetId);
          }
        }
        break;
      
      case 'Bá Kiến':
        if (action.type === 'oppress' && action.targetId) {
          const targetPlayer = players.find(p => p.id === action.targetId);
          
          if (targetPlayer) {
            // Tăng điểm uất ức
            increaseFrustration(action.targetId, 1);
            
            // Thêm vào danh sách bị đàn áp đêm nay
            addOppressionToNight(action.targetId);
            
            messages.push(`${targetPlayer.name} bị đàn áp bởi Bá Kiến và tăng 1 điểm uất ức.`);
            
            // Kiểm tra nếu người này đã tích lũy đủ 2 điểm uất ức
            checkAndUpdateRemovalList(action.targetId);
          }
        }
        break;
      
      case 'Lý Cường':
        if (action.type === 'extort') {
          const targetIds = action.targetIds || [];
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
        break;
      
      case 'Thị Nở':
        if (action.type === 'help' && action.targetId) {
          const targetPlayer = players.find(p => p.id === action.targetId);
          
          if (targetPlayer && targetPlayer.frustration > 0) {
            decreaseFrustration(action.targetId, 1);
            messages.push(`${targetPlayer.name} được Thị Nở giúp đỡ giảm 1 điểm uất ức.`);
            
            // Kiểm tra lại xem người này có còn đủ điểm uất ức để bị loại không
            checkAndUpdateRemovalList(action.targetId);
          }
          
          // Xử lý trường hợp Chí Phèo được Thị Nở giúp đỡ 2 lần liên tiếp
          if (action.isSecondNight && targetPlayer && targetPlayer.role === 'Chí Phèo' && targetPlayer.team !== 'Công Lý') {
            changeTeam(action.targetId, 'Công Lý');
            messages.push(`${targetPlayer.name} (Chí Phèo) đã chuyển sang phe Công Lý do được Thị Nở giúp đỡ 2 đêm liên tiếp!`);
          }
        }
        break;
      
      case 'Đội Tảo':
        if (action.type === 'force' && action.targetId) {
          const targetPlayer = players.find(p => p.id === action.targetId);
          
          if (targetPlayer && !targetPlayer.shutup) {
            setMuted(action.targetId);
            messages.push(`${targetPlayer.name} bị Đội Tảo ép buộc.`);
          }
        } else if (action.type === 'kill' && action.targetId) {
          const targetPlayer = players.find(p => p.id === action.targetId);
          
          if (targetPlayer) {
            // Giết người là hành động trực tiếp, luôn được thực hiện ngay lập tức
            removePlayer(action.targetId);
            messages.push(`${targetPlayer.name} bị Đội Tảo thanh trừng và rời khỏi làng.`);
          }
        }
        break;
      
      case 'Chí Phèo':
        if (action.type === 'attack' && action.targetId) {
          const targetPlayer = players.find(p => p.id === action.targetId);
          
          if (targetPlayer) {
            // Giết người là hành động trực tiếp, luôn được thực hiện ngay lập tức
            removePlayer(action.targetId);
            messages.push(`${targetPlayer.name} bị Chí Phèo tấn công và rời khỏi làng.`);
          }
        }
        break;
      
      case 'Năm Thọ':
        if (action.type === 'rob' && action.targetId) {
          const targetPlayer = players.find(p => p.id === action.targetId);
          const namTho = players.find(p => p.role === 'Năm Thọ');
          
          if (targetPlayer && targetPlayer.role === 'Bá Kiến') {
            // Nếu cướp nhầm Bá Kiến
            if (namTho) {
              // Năm Thọ bị loại ngay lập tức vì đây là hành động trực tiếp
              removePlayer(namTho.id);
              messages.push(`Năm Thọ cướp nhầm nhà Bá Kiến và phải rời khỏi làng.`);
            }
          } else if (targetPlayer) {
            // Cướp thành công
            const amountToRob = Math.min(targetPlayer.coins, 3);
            if (amountToRob > 0) {
              removeCoins(action.targetId, amountToRob);
              if (namTho) {
                addCoins(namTho.id, amountToRob);
              }
              messages.push(`${targetPlayer.name} bị Năm Thọ cướp ${amountToRob} đồng.`);
            }
          }
        }
        break;
      
      case 'Tự Lãng':
        if (action.type === 'sell' && action.targetId) {
          const targetPlayer = players.find(p => p.id === action.targetId);
          const tuLang = players.find(p => p.role === 'Tự Lãng');
          
          if (targetPlayer && targetPlayer.coins > 0) {
            removeCoins(action.targetId, 1);
            if (tuLang) {
              addCoins(tuLang.id, 1);
            }
            messages.push(`${targetPlayer.name} mua rượu từ Tự Lãng.`);
          }
        }
        break;
    }
    
    // Lưu lại thông báo các hành động xảy ra trong đêm
    if (messages.length > 0) {
      setNightMessages(prev => [...prev, ...messages]);
    }
    
    // Ghi lại hành động để hiển thị ở cuối đêm
    recordNightAction(currentRole, action);
    
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
          <h2>ĐÊM {date + 1}</h2>
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