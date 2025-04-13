import React, { useState } from 'react';
import { usePlayerContext } from '../../context/PlayerContext';
import '../../styles/events.css';
import { ITEM_PRICES } from '../../utils/gameHelpers';

// Import assets
import ChaoHanh from "../../assets/shop/ChaoHanh.png";
import HoiHuong from "../../assets/shop/GanhOanTroVe.png";
import GiaiAch from "../../assets/shop/GiaiAch.png";
import MinhOan from "../../assets/shop/MinhOan.png";
import Ruou from "../../assets/shop/RuouDe.png";

function BlackMarket({ onComplete }) {
  const { players, addItem, removeCoins } = usePlayerContext();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Danh sách các thẻ hành động có thể mua
  const items = [
    { id: 'Rượu Đế', name: 'Rượu Đế', price: ITEM_PRICES['Rượu Đế'], image: Ruou, description: 'Đặt một thẻ Say Rượu lên người khác.' },
    { id: 'Cháo Hành', name: 'Cháo Hành', price: ITEM_PRICES['Cháo Hành'], image: ChaoHanh, description: 'Loại bỏ một thẻ Say Rượu từ bất kỳ người chơi nào.' },
    { id: 'Giải Ách', name: 'Giải Ách', price: ITEM_PRICES['Giải Ách'], image: GiaiAch, description: 'Hóa giải ép buộc của Đội Tảo.' },
    { id: 'Hồi Hương', name: 'Hồi Hương', price: ITEM_PRICES['Hồi Hương'], image: HoiHuong, description: 'Gọi về một người đã rời bỏ làng do uất ức.' },
    { id: 'Minh Oan', name: 'Minh Oan', price: ITEM_PRICES['Minh Oan'], image: MinhOan, description: 'Một lần duy nhất, được miễn bị xử tử khi bị vote cao nhất.' },
  ];

  // Lọc chỉ hiển thị người chơi thuộc phe Quyền Thế
  const powerThemePlayers = players.filter(player => player.team === 'Quyền Thế' && player.alive);

  const handlePlayerSelect = (player) => {
    setSelectedPlayer(player);
    setSelectedItem(null);
  };

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };

  const handleBuy = () => {
    if (selectedPlayer && selectedItem) {
      // Kiểm tra xem người chơi có đủ tiền không
      if (selectedPlayer.coins >= selectedItem.price) {
        // Thực hiện giao dịch
        removeCoins(selectedPlayer.id, selectedItem.price);
        addItem(selectedPlayer.id, selectedItem.id);
        
        // Ghi lại giao dịch
        setTransactions([
          ...transactions,
          `${selectedPlayer.name} đã mua ${selectedItem.name} với giá ${selectedItem.price} đồng.`
        ]);
        
        // Reset selection
        setSelectedPlayer(null);
        setSelectedItem(null);
      } else {
        alert(`${selectedPlayer.name} không đủ tiền để mua ${selectedItem.name}.`);
      }
    }
  };

  const handleComplete = () => {
    onComplete(transactions);
  };

  return (
    <div className="event-overlay">
      <div className="event-container market-day">
        <h2>Chợ Đen</h2>
        <p>Phe Quyền Thế có thể mua thẻ Hành Động bí mật trước khi Chợ Phiên mở.</p>
        
        <div className="market-content">
          <div className="player-section">
            <h3>Chọn thành viên phe Quyền Thế:</h3>
            <div className="player-list">
              {powerThemePlayers.map(player => (
                <div 
                  key={player.id} 
                  className={`player-option ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                  onClick={() => handlePlayerSelect(player)}
                >
                  {player.name} ({player.role}) - {player.coins} đồng
                </div>
              ))}
            </div>
          </div>
          
          {selectedPlayer && (
            <div className="item-section">
              <h3>Chọn vật phẩm cho {selectedPlayer.name}:</h3>
              <div className="item-list">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    className={`item-option ${selectedItem?.id === item.id ? 'selected' : ''} ${selectedPlayer.coins < item.price ? 'disabled' : ''}`}
                    onClick={() => selectedPlayer.coins >= item.price && handleItemSelect(item)}
                  >
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name} - {item.price} đồng</h4>
                      <p>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button 
                className="buy-button"
                onClick={handleBuy}
                disabled={!selectedItem}
              >
                Mua
              </button>
            </div>
          )}
        </div>
        
        {transactions.length > 0 && (
          <div className="transaction-history">
            <h3>Giao dịch bí mật đã thực hiện:</h3>
            <ul>
              {transactions.map((transaction, index) => (
                <li key={index}>{transaction}</li>
              ))}
            </ul>
          </div>
        )}
        
        <button className="complete-button" onClick={handleComplete}>
          Kết thúc Chợ Đen
        </button>
      </div>
    </div>
  );
}

export default BlackMarket;