import React from 'react';
import "../../styles/home.css";
import background from "../../assets/image.jpg";

function EndGame({ winner }) {
  // Map các phe với thông điệp chiến thắng
  const victoryMessages = {
    'Quyền Thế': 'Phe Quyền Thế đã chiến thắng! Toàn bộ phe Công Lý đã bị loại.',
    'Công Lý': 'Phe Công Lý đã chiến thắng! Toàn bộ phe Quyền Thế đã bị loại.',
    'Đội Tảo': 'Đội Tảo đã chiến thắng! Tất cả người không thuộc phe Quyền Thế đã bị ép buộc và Bá Kiến đã chết.',
    'Tự Lãng': 'Tự Lãng đã chiến thắng! Đã tích lũy đủ 15 đồng.',
    'Năm Thọ': 'Năm Thọ đã chiến thắng! Đã tích lũy đủ 30 đồng.',
    'Chí Phèo': 'Chí Phèo đã chiến thắng! Là người sống sót cuối cùng.'
  };

  const message = victoryMessages[winner] || 'Trò chơi kết thúc!';

  const handleRestart = () => {
    // Tải lại trang để bắt đầu game mới
    window.location.reload();
  };

  return (
    <div className='game'>
      <div className='background'>
        <img src={background} alt="Background" />
      </div>

      <div className="endgame-container">
        <h1>Kết thúc trò chơi</h1>
        <div className="victory-message">
          <h2>{message}</h2>
        </div>

        <div className="endgame-buttons">
          <button className="restart-button" onClick={handleRestart}>
            Chơi lại
          </button>
        </div>
      </div>
    </div>
  );
}

export default EndGame;