// Các hàm tiện ích để xử lý logic game

// 1. Xác định sự kiện theo ngày
export const determineEvent = (day) => {
    if (day % 3 === 0) return 'market'; // Ngày 0, 3, 6, ... là Chợ Phiên
    if (day % 3 === 1) return 'harvest'; // Ngày 1, 4, 7, ... là Thu Hoạch
    return 'wine'; // Ngày 2, 5, 8, ... là Tiệc Rượu
  };
  
  // 2. Kiểm tra và xử lý người có 2 điểm uất ức
  export const handleFrustration = (player, removePlayerFn, changeTeamFn) => {
    if (player.frustration >= 2) {
      if (player.role === 'Chí Phèo') {
        // Chí Phèo chuyển sang phe Công Lý khi có 2 điểm uất ức
        changeTeamFn(player.id, 'Công Lý');
        return { 
          handled: true, 
          message: `${player.name} (Chí Phèo) đã chuyển sang phe Công Lý do tích lũy 2 điểm uất ức!` 
        };
      } else {
        // Người chơi khác rời làng
        removePlayerFn(player.id);
        return { 
          handled: true, 
          message: `${player.name} (${player.role}) đã rời khỏi làng do tích lũy 2 điểm uất ức!` 
        };
      }
    }
    return { handled: false };
  };
  
  // 3. Xử lý Chí Phèo nhận đủ 3 thẻ Say Rượu
  export const handleChiPheoWine = (chiPheo, changeTeamFn) => {
    if (chiPheo && chiPheo.wine >= 3) {
      changeTeamFn(chiPheo.id, 'Quyền Thế');
      return {
        handled: true,
        message: `${chiPheo.name} (Chí Phèo) đã chuyển sang phe Quyền Thế do nhận đủ 3 thẻ Say Rượu!`
      };
    }
    return { handled: false };
  };
  
  // 4. Xử lý Chí Phèo được Thị Nở chọn 2 đêm liên tiếp
  export const handleChiPheoThiNo = (chiPheo, thiNoTarget, prevThiNoTarget, changeTeamFn) => {
    if (
      chiPheo && 
      thiNoTarget === chiPheo.id && 
      prevThiNoTarget === chiPheo.id &&
      chiPheo.team !== 'Công Lý'
    ) {
      changeTeamFn(chiPheo.id, 'Công Lý');
      return {
        handled: true,
        message: `${chiPheo.name} (Chí Phèo) đã chuyển sang phe Công Lý do được Thị Nở giúp đỡ 2 đêm liên tiếp!`
      };
    }
    return { handled: false };
  };
  
  // 5. Kiểm tra và phân phối tiền Thu Hoạch
  export const distributeHarvestMoney = (players, addCoinsFn) => {
    players.forEach(player => {
      if (player.alive) {
        if (player.team === 'Quyền Thế') {
          addCoinsFn(player.id, 1); // Phe Quyền Thế nhận 1 đồng
        } else {
          addCoinsFn(player.id, 2); // Phe khác nhận 2 đồng
        }
      }
    });
  };
  
  // 6. Xác định thứ tự gọi nhân vật vào ban đêm
  export const getNightSequence = (players, currentDay) => {
    const roleOrder = [
      'PowerTheme', // Phe Quyền Thế chung
      'Bá Kiến',
      'Lý Cường',
      'Bà Ba',
      'Đội Tảo',
      'Lão Hạc',
      'Thị Nở',
      'Ông Giáo',
      'Bà Cô của Thị Nở',
      'Binh Chức', // Chỉ đêm đầu tiên
      'Chí Phèo',
      'Năm Thọ',
      'Tự Lãng'
    ];
    
    // Lọc ra những vai trò có trong game hiện tại và không say rượu
    const activeRoles = roleOrder.filter(role => {
      if (role === 'PowerTheme') {
        // Kiểm tra xem có thành viên phe Quyền Thế không say rượu không
        return players.some(p => p.team === 'Quyền Thế' && p.alive && !p.drunk);
      }
      
      // Nếu là Binh Chức và không phải đêm đầu, bỏ qua
      if (role === 'Binh Chức' && currentDay > 0) {
        return false;
      }
      
      // Kiểm tra xem vai trò có tồn tại trong danh sách người chơi, còn sống và không say rượu không
      return players.some(p => p.role === role && p.alive && !p.drunk);
    });
    
    return activeRoles;
  };