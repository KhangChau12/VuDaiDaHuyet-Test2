// Quản lý các sự kiện trong game

// Phân phối tiền dựa trên loại ngày
export const distributeMoneyByDay = (day, players, addCoinsFn) => {
    const event = getEventByDay(day);
    
    players.forEach(player => {
      if (player.alive) {
        if (event === 'harvest') {
          // Ngày Thu Hoạch
          if (player.team === 'Quyền Thế') {
            addCoinsFn(player.id, 1); // Phe Quyền Thế nhận 1 đồng
          } else {
            addCoinsFn(player.id, 2); // Phe khác nhận 2 đồng
          }
        } else {
          // Ngày thường
          addCoinsFn(player.id, 1); // Mọi người đều nhận 1 đồng
        }
      }
    });
    
    return {
      event,
      message: event === 'harvest' 
        ? 'Ngày Thu Hoạch: Phe Công Lý và Lang Thang nhận 2 đồng, phe Quyền Thế nhận 1 đồng.'
        : 'Mọi người nhận 1 đồng.'
    };
  };
  
  // Xác định sự kiện dựa vào ngày
  export const getEventByDay = (day) => {
    if (day % 3 === 0) {
      return 'market'; // Ngày 0, 3, 6, ... là Chợ Phiên
    } else if (day % 3 === 1) {
      return 'harvest'; // Ngày 1, 4, 7, ... là Thu Hoạch
    } else {
      return 'wine'; // Ngày 2, 5, 8, ... là Tiệc Rượu
    }
  };
  
  // Phát ngẫu nhiên thẻ Say Rượu trong ngày Tiệc Rượu
  export const distributeWineCards = (players, setDrunkFn, increaseWineFn) => {
    // Lọc ra những người còn sống
    const alivePlayers = players.filter(player => player.alive);
    
    // Nếu có ít hơn 3 người, tất cả đều say
    if (alivePlayers.length <= 3) {
      alivePlayers.forEach(player => {
        setDrunkFn(player.id);
        
        // Đặc biệt với Chí Phèo
        if (player.role === 'Chí Phèo') {
          increaseWineFn(player.id, 1);
        }
      });
      
      return {
        drunkPlayers: alivePlayers.map(p => p.id),
        message: 'Tiệc Rượu: Tất cả người chơi đều say rượu.'
      };
    }
    
    // Chọn ngẫu nhiên 3 người
    const drunkPlayers = [];
    const playersCopy = [...alivePlayers];
    
    for (let i = 0; i < 3; i++) {
      if (playersCopy.length === 0) break;
      
      const randomIndex = Math.floor(Math.random() * playersCopy.length);
      const selectedPlayer = playersCopy.splice(randomIndex, 1)[0];
      
      setDrunkFn(selectedPlayer.id);
      drunkPlayers.push(selectedPlayer);
      
      // Đặc biệt với Chí Phèo
      if (selectedPlayer.role === 'Chí Phèo') {
        increaseWineFn(selectedPlayer.id, 1);
      }
    }
    
    return {
      drunkPlayers: drunkPlayers.map(p => p.id),
      message: `Tiệc Rượu: ${drunkPlayers.map(p => p.name).join(', ')} say rượu.`
    };
  };
  
  // Tổng hợp các sự kiện trong đêm
  export const summarizeNightEvents = (nightActions, players) => {
    const summary = [];
    
    // Xử lý đàn áp từ phe Quyền Thế
    if (nightActions.PowerTheme) {
      const targetId = nightActions.PowerTheme.targetId;
      const targetPlayer = players.find(p => p.id === targetId);
      if (targetPlayer) {
        summary.push(`${targetPlayer.name} bị đàn áp bởi phe Quyền Thế.`);
      }
    }
    
    // Xử lý các hành động khác từ các vai trò
    // (Sẽ triển khai chi tiết tùy theo yêu cầu)
    
    return summary;
  };