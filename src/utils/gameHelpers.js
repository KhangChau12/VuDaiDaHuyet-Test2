// Các hàm tiện ích khác cho game

// 1. Lấy thành viên của một phe
export const getTeamMembers = (players, team) => {
    return players.filter(player => player.team === team && player.alive);
  };
  
  // 2. Kiểm tra xem có thể mua thẻ hay không
  export const canBuyItem = (player, itemName, itemPrices) => {
    return player.coins >= itemPrices[itemName];
  };
  
  // 3. Giao dịch mua thẻ
  export const buyItem = (playerId, itemName, itemPrices, removeCoinsFunc, addItemFunc) => {
    const price = itemPrices[itemName];
    
    removeCoinsFunc(playerId, price);
    addItemFunc(playerId, itemName);
    
    return {
      success: true,
      message: `Đã mua thẻ ${itemName} với giá ${price} đồng.`
    };
  };
  
  // 4. Sử dụng thẻ Say Rượu
  export const useWineCard = (activePlayerId, targetPlayerId, players, setDrunkFn, increaseWineFn, removeItemFn) => {
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    
    if (targetPlayer && targetPlayer.alive) {
      setDrunkFn(targetPlayerId);
      removeItemFn(activePlayerId, 'Rượu Đế');
      
      // Đặc biệt với Chí Phèo
      if (targetPlayer.role === 'Chí Phèo') {
        increaseWineFn(targetPlayerId, 1);
      }
      
      return {
        success: true,
        message: `${targetPlayer.name} đã bị đặt thẻ Say Rượu!`
      };
    }
    
    return {
      success: false,
      message: 'Không thể đặt thẻ Say Rượu lên người chơi này.'
    };
  };
  
  // 5. Sử dụng thẻ Cháo Hành
  export const useSoupCard = (activePlayerId, targetPlayerId, players, unsetDrunkFn, removeItemFn) => {
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    
    if (targetPlayer && targetPlayer.alive && targetPlayer.drunk) {
      unsetDrunkFn(targetPlayerId);
      removeItemFn(activePlayerId, 'Cháo Hành');
      
      return {
        success: true,
        message: `Đã loại bỏ thẻ Say Rượu khỏi ${targetPlayer.name}!`
      };
    }
    
    return {
      success: false,
      message: 'Không thể loại bỏ thẻ Say Rượu của người chơi này.'
    };
  };
  
  // 6. Sử dụng thẻ Hồi Hương
  export const useReturnCard = (activePlayerId, targetPlayerId, players, revivePlayerFn, removeItemFn) => {
    const targetPlayer = players.find(p => p.id === targetPlayerId);
    
    if (targetPlayer && !targetPlayer.alive) {
      revivePlayerFn(targetPlayerId);
      removeItemFn(activePlayerId, 'Hồi Hương');
      
      return {
        success: true,
        message: `${targetPlayer.name} đã được gọi trở về làng!`
      };
    }
    
    return {
      success: false,
      message: 'Không thể gọi người chơi này trở về làng.'
    };
  };
  
  // 7. Kiểm tra việc sử dụng thẻ Minh Oan trong trường hợp bị vote cao nhất
  export const checkMinhOanUsage = (playerId, players) => {
    const player = players.find(p => p.id === playerId);
    
    if (player && player.items['Minh Oan'] > 0) {
      return true;
    }
    
    return false;
  };
  
  // 8. Xác định giá các thẻ hành động
  export const ITEM_PRICES = {
    'Rượu Đế': 3,
    'Cháo Hành': 2,
    'Giải Ách': 15,
    'Hồi Hương': 10,
    'Minh Oan': 10
  };