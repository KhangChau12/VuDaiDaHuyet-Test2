// File: src/components/player/PlayerMenu.jsx - Phần liên quan đến shop

import React, { useEffect, useState } from 'react'
import "../../styles/menu.css"
import CardMenu from './CardMenu';
import { usePlayerContext } from '../../context/PlayerContext';
import { useGameContext } from '../../context/GameContext';
import { ITEM_PRICES } from '../../utils/gameHelpers';
import Trade from './Trade';

// Import assets
import background from "../../assets/background_day.png";
import ChaoHanh from "../../assets/shop/ChaoHanh.png";
import HoiHuong from "../../assets/shop/GanhOanTroVe.png";
import GiaiAch from "../../assets/shop/GiaiAch.png";
import MinhOan from "../../assets/shop/MinhOan.png";
import Ruou from "../../assets/shop/RuouDe.png";

function PlayerMenu(props) {
  const { players, addItem, removeCoins, removeItem, setDrunk, unsetDrunk, unsetMuted, revivePlayer } = usePlayerContext();
  const { currentEvent } = useGameContext();

  const [activeTab, setActiveTab] = useState('info');
  const [itemToUse, setItemToUse] = useState(null);
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [useResult, setUseResult] = useState(null);
  const [buySuccess, setBuySuccess] = useState(null);

  // State để lưu thông tin người chơi hiện tại (và cập nhật khi mua đồ)
  const [currentPlayer, setCurrentPlayer] = useState(props.player);

  // Effect để cập nhật currentPlayer khi props.player thay đổi
  useEffect(() => {
    setCurrentPlayer(props.player);
  }, [props.player]);

  // Tìm thông tin người chơi hiện tại từ players array (luôn cập nhật)
  const updatedPlayer = players.find(p => p.id === props.player.id);

  // Lấy thông tin giá các thẻ
  const price = ITEM_PRICES;

  // Lấy danh sách vật phẩm đã sở hữu
  const itemOwned = updatedPlayer.items;

  // Kiểm tra xem có thể mua hàng không (chỉ trong ngày Chợ Phiên)
  const canBuy = currentEvent === 'market';

  // Danh sách các thẻ hành động
  const items = [
    { id: 'Rượu Đế', name: 'Rượu Đế', price: price['Rượu Đế'], image: Ruou, description: 'Đặt một thẻ Say Rượu lên người khác.' },
    { id: 'Cháo Hành', name: 'Cháo Hành', price: price['Cháo Hành'], image: ChaoHanh, description: 'Loại bỏ một thẻ Say Rượu từ bất kỳ người chơi nào.' },
    { id: 'Giải Ách', name: 'Giải Ách', price: price['Giải Ách'], image: GiaiAch, description: 'Hóa giải ép buộc của Đội Tảo.' },
    { id: 'Hồi Hương', name: 'Hồi Hương', price: price['Hồi Hương'], image: HoiHuong, description: 'Gọi về một người đã rời bỏ làng do uất ức.' },
    { id: 'Minh Oan', name: 'Minh Oan', price: price['Minh Oan'], image: MinhOan, description: 'Một lần duy nhất, được miễn bị xử tử khi bị vote cao nhất.' },
  ];

  // Hàm mua thẻ
  const buy = (item) => {
    if (updatedPlayer.coins >= price[item]) {
      removeCoins(updatedPlayer.id, price[item]);
      addItem(updatedPlayer.id, item);

      // Hiển thị thông báo thành công
      setBuySuccess({
        success: true,
        item: item,
        price: price[item]
      });

      // Tự động ẩn thông báo sau 2 giây
      setTimeout(() => {
        setBuySuccess(null);
      }, 2000);
    } else {
      // Hiển thị thông báo thất bại
      setBuySuccess({
        success: false,
        item: item,
        price: price[item]
      });

      // Tự động ẩn thông báo sau 2 giây
      setTimeout(() => {
        setBuySuccess(null);
      }, 2000);
    }
  };

  // Hàm sử dụng thẻ
  const useItem = (item) => {
    setItemToUse(item);
    setTargetPlayer(null);
    setUseResult(null);
  };

  // Hàm chọn mục tiêu cho thẻ
  const selectTarget = (player) => {
    setTargetPlayer(player);
  };

  // Hàm xác nhận sử dụng thẻ
  const confirmUseItem = () => {
    if (!itemToUse || !targetPlayer) return;

    switch (itemToUse) {
      case 'Rượu Đế':
        // Đặt thẻ Say Rượu
        if (targetPlayer.alive && !targetPlayer.drunk) {
          setDrunk(targetPlayer.id);
          removeItem(updatedPlayer.id, 'Rượu Đế');
          setUseResult({ success: true, message: `Đã đặt thẻ Say Rượu lên ${targetPlayer.name}.` });
        } else {
          setUseResult({ success: false, message: 'Không thể đặt thẻ Say Rượu lên người này.' });
        }
        break;

      case 'Cháo Hành':
        // Loại bỏ thẻ Say Rượu
        if (targetPlayer.alive && targetPlayer.drunk) {
          unsetDrunk(targetPlayer.id);
          removeItem(updatedPlayer.id, 'Cháo Hành');
          setUseResult({ success: true, message: `Đã loại bỏ thẻ Say Rượu khỏi ${targetPlayer.name}.` });
        } else {
          setUseResult({ success: false, message: 'Không thể loại bỏ thẻ Say Rượu của người này.' });
        }
        break;

      case 'Giải Ách':
        // Hóa giải ép buộc
        if (targetPlayer.alive && targetPlayer.shutup) {
          unsetMuted(targetPlayer.id);
          removeItem(updatedPlayer.id, 'Giải Ách');
          setUseResult({ success: true, message: `Đã giải thoát ${targetPlayer.name} khỏi ép buộc.` });
        } else {
          setUseResult({ success: false, message: 'Không thể giải ách cho người này.' });
        }
        break;

      case 'Hồi Hương':
        // Gọi người đã chết trở về làng
        if (!targetPlayer.alive) {
          revivePlayer(targetPlayer.id);
          removeItem(updatedPlayer.id, 'Hồi Hương');
          setUseResult({ success: true, message: `Đã gọi ${targetPlayer.name} trở về làng.` });
        } else {
          setUseResult({ success: false, message: 'Không thể gọi người này trở về làng.' });
        }
        break;

      default:
        setUseResult({ success: false, message: 'Chức năng chưa được triển khai.' });
    }
  };

  // Hàm quay lại trang chính
  const resetItemUse = () => {
    setItemToUse(null);
    setTargetPlayer(null);
    setUseResult(null);
  };

  // Lọc ra những người chơi phù hợp với thẻ đang sử dụng
  const getValidTargets = () => {
    switch (itemToUse) {
      case 'Rượu Đế':
        // Chỉ những người còn sống và không say
        return players.filter(p => p.alive && !p.drunk);

      case 'Cháo Hành':
        // Chỉ những người còn sống và đang say
        return players.filter(p => p.alive && p.drunk);

      case 'Giải Ách':
        // Chỉ những người còn sống và đang bị ép buộc
        return players.filter(p => p.alive && p.shutup);

      case 'Hồi Hương':
        // Chỉ những người đã chết do uất ức
        return players.filter(p => !p.alive);

      default:
        return players.filter(p => p.alive);
    }
  };

  return (
    <div className='menu'>
      <div className='background'>
        <img src={background} alt="Background" />
      </div>

      {/* Tabs */}
      <div className='menu-tabs'>
        <div
          className={`menu-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Thông tin
        </div>
        <div
          className={`menu-tab ${activeTab === 'items' ? 'active' : ''}`}
          onClick={() => setActiveTab('items')}
        >
          Vật phẩm
        </div>
        <div
          className={`menu-tab ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          Cửa hàng
        </div>
        <div
          className={`menu-tab ${activeTab === 'trade' ? 'active' : ''}`}
          onClick={() => setActiveTab('trade')}
        >
          Trao đổi
        </div>
      </div>

      <div className='info'>
        <CardMenu player={updatedPlayer}></CardMenu>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        height: '60%',
        overflowY: 'scroll',
        width: '90%',
      }}>
        {/* Tab nội dung */}
        {activeTab === 'info' && (
          <div className='player-details'>
            <h3 className="thong-tin-chi-tiet">Thông tin chi tiết</h3>
            <p><strong>Tên:</strong> {updatedPlayer.name}</p>
            <p><strong>Vai trò:</strong> {updatedPlayer.role}</p>
            <p><strong>Phe:</strong> {updatedPlayer.team}</p>
            <p><strong>Tiền:</strong> {updatedPlayer.coins} đồng</p>
            <p><strong>Điểm uất ức:</strong> {updatedPlayer.frustration}</p>
            <p><strong>Điểm rượu:</strong> {updatedPlayer.wine}</p>
            <p><strong>Trạng thái:</strong>
              {updatedPlayer.drunk && updatedPlayer.shutup && 'Đang say rượu và bị ép buộc'}
              {updatedPlayer.drunk && !updatedPlayer.shutup && 'Đang say rượu'}
              {updatedPlayer.shutup && !updatedPlayer.drunk && 'Đang bị ép buộc'}
              {!updatedPlayer.drunk && !updatedPlayer.shutup && 'Bình thường'}
            </p>
          </div>
        )}

        {activeTab === 'items' && !itemToUse && (
          <div className='player-items'>
            <h3>Vật phẩm đã sở hữu</h3>
            <div className='item-list'>
              {Object.entries(itemOwned).map(([item, count]) => (
                count > 0 && (
                  <div className='item' key={item}>
                    <img src={items.find(i => i.id === item)?.image} alt={item} />
                    <h3>{item}</h3>
                    <p>{items.find(i => i.id === item)?.description}</p>
                    <h4 className="count">Số lượng: {count}</h4>
                    <div className='use' onClick={() => useItem(item)}>
                      <a>Sử dụng</a>
                    </div>
                  </div>
                )
              ))}

              {Object.values(itemOwned).every(count => count === 0) && (
                <p>Chưa sở hữu vật phẩm nào.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'items' && itemToUse && !useResult && (
          <div className='use-item'>
            <h3>Sử dụng {itemToUse}</h3>
            <p>Chọn người để sử dụng:</p>

            <div className='target-list'>
              {getValidTargets().map(player => (
                <div
                  key={player.id}
                  className={`target-option ${targetPlayer?.id === player.id ? 'selected' : ''}`}
                  onClick={() => selectTarget(player)}
                >
                  {player.name} ({player.role})
                </div>
              ))}

              {getValidTargets().length === 0 && <p>Không có mục tiêu phù hợp.</p>}
            </div>

            <div className='action-buttons'>
              <button onClick={resetItemUse}>Hủy</button>
              <button
                onClick={confirmUseItem}
                disabled={!targetPlayer}
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}

        {activeTab === 'items' && useResult && (
          <div className='use-result'>
            <h3>{useResult.success ? 'Thành công' : 'Thất bại'}</h3>
            <p>{useResult.message}</p>
            <button onClick={resetItemUse}>Quay lại</button>
          </div>
        )}

        {activeTab === 'shop' && (
          <>
            {canBuy ? (
              <div className='shop-container'>
                <h3>Cửa hàng</h3>

                <div className="current-coins-display">
                  <p>Số tiền hiện có: <strong>{updatedPlayer.coins} đồng</strong></p>
                </div>

                {buySuccess && (
                  <div className={`buy-message ${buySuccess.success ? 'success' : 'error'}`}>
                    {buySuccess.success
                      ? `Đã mua ${buySuccess.item} với giá ${buySuccess.price} đồng.`
                      : `Không đủ tiền để mua ${buySuccess.item} (cần ${buySuccess.price} đồng).`}
                  </div>
                )}

                <div style={{
                  width: '100%',
                  overflowX: 'scroll',
                  height: 'fit-content',
                }}>
                  <div className='shop-grid'>
                    {items.map(item => (
                      <div
                        className={`shop-item ${updatedPlayer.coins < item.price ? 'disabled' : ''}`}
                        key={item.id}
                        onClick={() => updatedPlayer.coins >= item.price && buy(item.id)}
                      >
                        <div className="shop-item-image">
                          <img src={item.image} alt={item.name} />
                        </div>
                        <h4>{item.name}</h4>
                        <p className="price">{item.price} đồng</p>
                        <p className="description">{item.description}</p>
                        <div className="item-count">Đang sở hữu: {itemOwned[item.id] || 0}</div>
                        <button
                          className="buy-button"
                          disabled={updatedPlayer.coins < item.price}
                        >
                          Mua
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className='shop-closed'>
                <h3>Cửa hàng chỉ mở vào ngày Chợ Phiên</h3>
                <p>Hãy quay lại vào ngày 3, 6, ...</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'trade' && (
          <Trade player={updatedPlayer} back={() => setActiveTab('info')} />
        )}
      </div>

      {/* Nút quay lại */}
      <button className="back-button" onClick={props.back}>
        Quay lại
      </button>
    </div>
  );
}

export default PlayerMenu;