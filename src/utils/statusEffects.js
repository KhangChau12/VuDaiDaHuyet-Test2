// Quản lý các hiệu ứng trạng thái người chơi

// 1. Kiểm tra và xử lý Say Rượu vào đầu đêm
export const processDrunkEffects = (players) => {
  const drunkPlayers = players.filter(p => p.drunk);
  // Chỉ trả về danh sách người say, không tự động unsetDrunk nữa
  return drunkPlayers.map(p => p.id);
};

// 2. Kiểm tra và xử lý Uất Ức khi tích lũy đủ 2 điểm
export const processFrustrationEffects = (players, removePlayerFn, changeTeamFn) => {
  const results = [];
  
  players.forEach(player => {
    if (player.alive && player.frustration >= 2) {
      if (player.role === 'Chí Phèo') {
        // Chí Phèo chuyển sang phe Công Lý khi có 2 điểm uất ức
        if (player.team !== 'Công Lý') {
          changeTeamFn(player.id, 'Công Lý');
          // Reset điểm uất ức về 0 sau khi chuyển phe
          player.frustration = 0;
          results.push({
            playerId: player.id,
            action: 'change_team',
            message: `${player.name} (Chí Phèo) đã chuyển sang phe Công Lý do tích lũy 2 điểm uất ức!`
          });
        } else {
          // Nếu Chí Phèo đã thuộc phe Công Lý và bị uất ức 2 lần, sẽ bị đuổi như người chơi thường
          removePlayerFn(player.id);
          results.push({
            playerId: player.id,
            action: 'remove',
            message: `${player.name} (Chí Phèo) đã rời khỏi làng do tích lũy 2 điểm uất ức!`
          });
        }
      } else if (player.role === 'Binh Chức') {
        // Binh Chức kéo theo 1 thành viên phe Quyền Thế bên phải
        results.push({
          playerId: player.id,
          action: 'remove_with_effect',
          message: `${player.name} (Binh Chức) đã rời khỏi làng do tích lũy 2 điểm uất ức và sẽ kéo theo 1 thành viên phe Quyền Thế!`
        });
        // Logic kéo theo thành viên phe Quyền Thế sẽ được xử lý riêng
      } else {
        // Người chơi khác rời làng
        removePlayerFn(player.id);
        results.push({
          playerId: player.id,
          action: 'remove',
          message: `${player.name} (${player.role}) đã rời khỏi làng do tích lũy 2 điểm uất ức!`
        });
      }
    }
  });
  
  return results;
};

// 3. Chọn người bị kéo theo khi Binh Chức rời làng
export const findRightmostPowerThemeMember = (players, binhChucId) => {
  // Tìm vị trí của Binh Chức trong danh sách
  const playerIds = players.map(p => p.id);
  const binhChucIndex = playerIds.indexOf(binhChucId);
  
  if (binhChucIndex === -1) return null;
  
  // Lấy danh sách người chơi còn sống thuộc phe Quyền Thế
  const alivePowerTheme = players.filter(p => p.team === 'Quyền Thế' && p.alive);
  
  // Sắp xếp theo vị trí trong danh sách, ưu tiên những người bên phải Binh Chức
  const sortedPowerTheme = alivePowerTheme.sort((a, b) => {
    const aIndex = playerIds.indexOf(a.id);
    const bIndex = playerIds.indexOf(b.id);
    
    // Tính khoảng cách theo chiều bên phải (vòng tròn)
    const aDist = (aIndex > binhChucIndex) ? (aIndex - binhChucIndex) : (playerIds.length + aIndex - binhChucIndex);
    const bDist = (bIndex > binhChucIndex) ? (bIndex - binhChucIndex) : (playerIds.length + bIndex - binhChucIndex);
    
    return aDist - bDist;
  });
  
  return sortedPowerTheme.length > 0 ? sortedPowerTheme[0] : null;
};

// 4. Xử lý ép buộc của Đội Tảo
export const processForceJoin = (playerId, players, setMutedFn) => {
  const targetPlayer = players.find(p => p.id === playerId);
  
  if (targetPlayer && targetPlayer.alive && !targetPlayer.shutup && targetPlayer.team !== 'Quyền Thế') {
    setMutedFn(playerId);
    return {
      success: true,
      message: `${targetPlayer.name} đã bị ép buộc bởi Đội Tảo!`
    };
  }
  
  return {
    success: false,
    message: 'Không thể ép buộc người chơi này.'
  };
};

// 5. Xử lý giải ách
export const processCancelForce = (playerId, players, unsetMutedFn, removeItemFn) => {
  const targetPlayer = players.find(p => p.id === playerId);
  
  if (targetPlayer && targetPlayer.alive && targetPlayer.shutup) {
    unsetMutedFn(playerId);
    // Trừ thẻ Giải Ách
    removeItemFn(playerId, 'Giải Ách');
    return {
      success: true,
      message: `${targetPlayer.name} đã được giải thoát khỏi ép buộc!`
    };
  }
  
  return {
    success: false,
    message: 'Không thể giải ách cho người chơi này.'
  };
};