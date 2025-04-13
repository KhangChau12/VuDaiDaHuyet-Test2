import React, { useState } from 'react';
import "../../styles/menu.css";
import { usePlayerContext } from '../../context/PlayerContext';

function Trade({ player, back }) {
  const { players, addCoins, removeCoins, addItem, removeItem } = usePlayerContext();
  const [tradeType, setTradeType] = useState('money'); // 'money' or 'item'
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [amount, setAmount] = useState(1);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Lọc ra những người chơi khác còn sống
  const otherPlayers = players.filter(
    p => p.alive && p.id !== player.id
  );
  
  // Lấy danh sách vật phẩm đã sở hữu
  const ownedItems = Object.entries(player.items).filter(([_, count]) => count > 0);
  
  // Xử lý trao tiền
  const handleTradeMoney = () => {
    if (!selectedPlayer || amount <= 0 || amount > player.coins) return;
    
    // Trừ tiền người gửi
    removeCoins(player.id, amount);
    
    // Cộng tiền người nhận
    addCoins(selectedPlayer.id, amount);
    
    // Reset form
    setSelectedPlayer(null);
    setAmount(1);
    
    // Thông báo
    alert(`Đã trao ${amount} đồng cho ${selectedPlayer.name}.`);
  };
  
  // Xử lý trao vật phẩm
  const handleTradeItem = () => {
    if (!selectedPlayer || !selectedItem) return;
    
    // Trừ vật phẩm người gửi
    removeItem(player.id, selectedItem);
    
    // Cộng vật phẩm người nhận
    addItem(selectedPlayer.id, selectedItem);
    
    // Reset form
    setSelectedPlayer(null);
    setSelectedItem(null);
    
    // Thông báo
    alert(`Đã trao thẻ ${selectedItem} cho ${selectedPlayer.name}.`);
  };
  
  return (
    <div className="trade-container">
      <h2>Trao đổi với người chơi khác</h2>
      
      <div className="trade-type-selection">
        <button 
          className={`trade-type-button ${tradeType === 'money' ? 'active' : ''}`}
          onClick={() => setTradeType('money')}
        >
          Trao tiền
        </button>
        <button 
          className={`trade-type-button ${tradeType === 'item' ? 'active' : ''}`}
          onClick={() => setTradeType('item')}
        >
          Trao vật phẩm
        </button>
      </div>
      
      <div className="player-selection">
        <h3>Chọn người nhận:</h3>
        <div className="player-list trade">
          {otherPlayers.map(p => (
            <div 
              key={p.id}
              className={`player-option ${selectedPlayer?.id === p.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlayer(p)}
            >
              {p.name} ({p.role})
            </div>
          ))}
        </div>
      </div>
      
      {tradeType === 'money' && (
        <div className="money-trade">
          <h3>Trao tiền:</h3>
          <p>Số dư hiện tại: {player.coins} đồng</p>
          <div className="amount-control">
            <label style={{color: 'var(--brown-text)'}}>Số tiền muốn trao:</label>
            <input 
              type="number" 
              min="1" 
              max={player.coins} 
              value={amount}
              onChange={(e) => setAmount(Math.min(player.coins, Math.max(1, parseInt(e.target.value) || 0)))}
            />
          </div>
          
          <button 
            className="trade-button"
            onClick={handleTradeMoney}
            disabled={!selectedPlayer || amount <= 0 || amount > player.coins}
          >
            Trao tiền
          </button>
        </div>
      )}
      
      {tradeType === 'item' && (
        <div className="item-trade">
          <h3>Trao vật phẩm:</h3>
          
          {ownedItems.length > 0 ? (
            <>
              <div className="item-selection">
                {ownedItems.map(([item, count]) => (
                  <div 
                    key={item}
                    className={`item-option ${selectedItem === item ? 'selected' : ''}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    {item} (sở hữu: {count})
                  </div>
                ))}
              </div>
              
              <button 
                className="trade-button"
                onClick={handleTradeItem}
                disabled={!selectedPlayer || !selectedItem}
              >
                Trao vật phẩm
              </button>
            </>
          ) : (
            <p>Bạn không có vật phẩm nào để trao.</p>
          )}
        </div>
      )}
      
      <button className="back-button" onClick={back}>Quay lại</button>
    </div>
  );
}

export default Trade;