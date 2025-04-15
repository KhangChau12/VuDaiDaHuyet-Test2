// Quản lý thứ tự gọi nhân vật ban đêm

// Thứ tự gọi cố định các nhân vật
export const NIGHT_SEQUENCE = [
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

// Lấy danh sách nhân vật cần gọi dựa trên người chơi hiện tại
export const getActiveNightSequence = (players, currentDay) => {
  // Lọc ra những vai trò có trong game hiện tại
  return NIGHT_SEQUENCE.filter(role => {
    if (role === 'PowerTheme') {
      // Kiểm tra xem có thành viên phe Quyền Thế nào không
      return players.some(p => p.team === 'Quyền Thế' && p.alive && !p.drunk);
    }
    
    // Nếu là Binh Chức và không phải đêm đầu, bỏ qua
    if (role === 'Binh Chức' && currentDay > 0) {
      return false;
    }
    
    // Kiểm tra xem vai trò có tồn tại trong danh sách người chơi, còn sống và không say rượu không
    return players.some(p => p.role === role && p.alive && !p.drunk);
  });
};

// Lấy câu hỏi mà Hương Sư cần hỏi nhân vật
export const getNightActionPrompt = (role) => {
  const prompts = {
    'PowerTheme': 'Gọi tất cả phe Quyền Thế dậy. Đêm nay các bạn muốn đàn áp ai?',
    'Bá Kiến': 'Bá Kiến, bạn muốn đàn áp thêm ai?',
    'Lý Cường': 'Lý Cường, bạn muốn tống tiền những ai?',
    'Bà Ba': 'Bà Ba, bạn muốn kiểm tra ai là Chí Phèo?',
    'Đội Tảo': 'Đội Tảo, bạn muốn ép buộc ai? Hoặc bạn muốn thực hiện thanh trừng?',
    'Lão Hạc': 'Lão Hạc, bạn muốn bảo vệ ai khỏi đàn áp đêm nay?',
    'Thị Nở': 'Thị Nở, bạn muốn giúp ai giảm 1 điểm uất ức?',
    'Ông Giáo': 'Ông Giáo, bạn muốn kiểm tra hai người nào có thuộc cùng phe?',
    'Bà Cô của Thị Nở': 'Bà Cô, bạn muốn kiểm tra ai có thuộc phe Quyền Thế?',
    'Binh Chức': 'Binh Chức, hãy nhớ rằng nếu bạn bị loại, bạn sẽ kéo theo một thành viên phe Quyền Thế gần nhất bên phải.',
    'Chí Phèo': 'Chí Phèo, bạn muốn tấn công ai đêm nay?',
    'Năm Thọ': 'Năm Thọ, bạn muốn cướp tiền của ai đêm nay?',
    'Tự Lãng': 'Tự Lãng, bạn muốn bán rượu cho ai đêm nay?'
  };
  
  return prompts[role] || `${role}, bạn muốn thực hiện hành động gì?`;
};

// Kiểm tra xem người chơi có thể là mục tiêu của vai trò không
export const canBeTargetedBy = (targetPlayer, actingRole, actingPlayer, previousTargets) => {
  // Người chơi đã chết không thể là mục tiêu
  if (!targetPlayer.alive) return false;
  
  // Không thể nhắm mục tiêu vào chính mình (trừ một số trường hợp đặc biệt)
  if (targetPlayer.id === actingPlayer.id && actingRole !== 'Chí Phèo' && actingRole !== 'Lão Hạc') return false;
  
  switch (actingRole) {
    case 'PowerTheme':
      // Phe Quyền Thế không thể đàn áp thành viên của chính mình
      return targetPlayer.team !== 'Quyền Thế';
      
    case 'Bá Kiến':
      // Bá Kiến không thể đàn áp thành viên phe Quyền Thế
      return targetPlayer.team !== 'Quyền Thế';
      
    case 'Lý Cường':
      // Lý Cường có thể tống tiền bất kỳ ai trừ phe Quyền Thế
      return targetPlayer.team !== 'Quyền Thế';
      
    case 'Lão Hạc':
      // Lão Hạc không thể bảo vệ cùng một người hai đêm liên tiếp
      return !previousTargets || !previousTargets.LaoHac || previousTargets.LaoHac !== targetPlayer.id;
      
    case 'Đội Tảo':
      // Đội Tảo không thể ép buộc thành viên phe Quyền Thế
      return targetPlayer.team !== 'Quyền Thế' && targetPlayer.role !== 'Đội Tảo';
      
    default:
      return true;
  }
};