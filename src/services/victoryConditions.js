// Kiểm tra điều kiện chiến thắng cho các phe

// 1. Kiểm tra chiến thắng của phe Quyền Thế
export const checkPowerThemeVictory = (players) => {
    const alivePlayers = players.filter(p => p.alive);
    const alivePowerTheme = alivePlayers.filter(p => p.team === 'Quyền Thế');
    const aliveJustice = alivePlayers.filter(p => p.team === 'Công Lý');
    
    // Phe Quyền Thế thắng khi loại bỏ tất cả thành viên phe Công Lý
    if (alivePowerTheme.length > 0 && aliveJustice.length === 0) {
      return {
        victory: true,
        winner: 'Quyền Thế',
        message: 'Phe Quyền Thế chiến thắng! Toàn bộ phe Công Lý đã bị loại.'
      };
    }
    
    return { victory: false };
  };
  
  // 2. Kiểm tra chiến thắng của phe Công Lý
  export const checkJusticeVictory = (players) => {
    const alivePlayers = players.filter(p => p.alive);
    const alivePowerTheme = alivePlayers.filter(p => p.team === 'Quyền Thế');
    const aliveJustice = alivePlayers.filter(p => p.team === 'Công Lý');
    
    // Phe Công Lý thắng khi loại bỏ tất cả thành viên phe Quyền Thế
    if (aliveJustice.length > 0 && alivePowerTheme.length === 0) {
      return {
        victory: true,
        winner: 'Công Lý',
        message: 'Phe Công Lý chiến thắng! Toàn bộ phe Quyền Thế đã bị loại.'
      };
    }
    
    return { victory: false };
  };
  
  // 3. Kiểm tra chiến thắng của Đội Tảo
  export const checkDoiTaoVictory = (players) => {
    const alivePlayers = players.filter(p => p.alive);
    
    // Tìm Đội Tảo
    const doiTao = players.find(p => p.role === 'Đội Tảo' && p.alive);
    if (!doiTao) return { victory: false };
    
    // Tìm Bá Kiến
    const baKien = players.find(p => p.role === 'Bá Kiến');
    
    // Đội Tảo thắng khi ép buộc tất cả những người không thuộc phe Quyền Thế và Bá Kiến chết
    const nonPowerThemePlayers = alivePlayers.filter(p => p.team !== 'Quyền Thế');
    const allForcedOrDead = nonPowerThemePlayers.every(p => p.shutup || p.id === doiTao.id);
    
    if (allForcedOrDead && (!baKien || !baKien.alive)) {
      return {
        victory: true,
        winner: 'Đội Tảo',
        message: 'Đội Tảo chiến thắng! Tất cả người không thuộc phe Quyền Thế đã bị ép buộc và Bá Kiến đã chết.'
      };
    }
    
    return { victory: false };
  };
  
  // 4. Kiểm tra chiến thắng của Tự Lãng
  export const checkTuLangVictory = (players) => {
    const tuLang = players.find(p => p.role === 'Tự Lãng' && p.alive);
    
    // Tự Lãng thắng khi có 15 tiền và không bị ép buộc
    if (tuLang && tuLang.coins >= 15 && !tuLang.shutup) {
      return {
        victory: true,
        winner: 'Tự Lãng',
        message: `${tuLang.name} (Tự Lãng) chiến thắng! Đã tích lũy đủ 15 đồng.`
      };
    }
    
    return { victory: false };
  };
  
  // 5. Kiểm tra chiến thắng của Năm Thọ
  export const checkNamThoVictory = (players) => {
    const namTho = players.find(p => p.role === 'Năm Thọ' && p.alive);
    
    // Năm Thọ thắng khi có 30 tiền và không bị ép buộc
    if (namTho && namTho.coins >= 30 && !namTho.shutup) {
      return {
        victory: true,
        winner: 'Năm Thọ',
        message: `${namTho.name} (Năm Thọ) chiến thắng! Đã tích lũy đủ 30 đồng.`
      };
    }
    
    return { victory: false };
  };
  
  // 6. Kiểm tra chiến thắng của Chí Phèo
  export const checkChiPheoVictory = (players) => {
    const chiPheo = players.find(p => p.role === 'Chí Phèo' && p.alive);
    if (!chiPheo) return { victory: false };
    
    const alivePlayers = players.filter(p => p.alive);
    
    // Chí Phèo thắng nếu là người sống sót cuối cùng
    if (alivePlayers.length === 1 && alivePlayers[0].id === chiPheo.id) {
      return {
        victory: true,
        winner: 'Chí Phèo',
        message: `${chiPheo.name} (Chí Phèo) chiến thắng! Là người sống sót cuối cùng.`
      };
    }
    
    return { victory: false };
  };
  
  // Hàm kiểm tra tất cả điều kiện chiến thắng
  export const checkAllVictoryConditions = (players) => {
    // Kiểm tra theo thứ tự ưu tiên
    const checks = [
      checkPowerThemeVictory,
      checkJusticeVictory,
      checkDoiTaoVictory,
      checkTuLangVictory,
      checkNamThoVictory,
      checkChiPheoVictory
    ];
    
    for (const check of checks) {
      const result = check(players);
      if (result.victory) {
        return result;
      }
    }
    
    return { victory: false };
  };