import React, { useState } from 'react';
import { useGameContext } from '../../context/GameContext';
import { usePlayerContext } from '../../context/PlayerContext';
import '../../styles/events.css';

function Event({ onComplete }) {
  const { setEvent } = useGameContext();
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Danh sách các sự kiện có thể kích hoạt
  const availableEvents = [
    { id: 'market', name: 'Chợ Phiên', description: 'Mọi người có thể mua thẻ Hành Động từ Hương Sư.' },
    { id: 'harvest', name: 'Thu Hoạch', description: 'Phe Công Lý và Lang Thang nhận 2 đồng, phe Quyền Thế nhận 1 đồng.' },
    { id: 'wine', name: 'Tiệc Rượu', description: 'Ba người ngẫu nhiên sẽ nhận thẻ Say Rượu.' },
    { id: 'execution', name: 'Xét Xử', description: 'Dân làng bỏ phiếu để đưa một người ra xét xử.' }
  ];

  const handleEventSelect = (eventId) => {
    setSelectedEvent(eventId);
  };

  const handleActivateEvent = () => {
    if (selectedEvent) {
      setEvent(selectedEvent);
      onComplete(`Đã kích hoạt sự kiện ${availableEvents.find(e => e.id === selectedEvent).name}`);
    }
  };

  return (
    <div className="event-overlay">
      <div className="event-container">
        <h2>Kích Hoạt Sự Kiện</h2>
        <p>Chọn sự kiện muốn kích hoạt:</p>
        
        <div className="event-selection">
          {availableEvents.map(event => (
            <div 
              key={event.id}
              className={`event-option ${selectedEvent === event.id ? 'selected' : ''}`}
              onClick={() => handleEventSelect(event.id)}
            >
              <h3>{event.name}</h3>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
        
        <button 
          className="activate-button"
          onClick={handleActivateEvent}
          disabled={!selectedEvent}
        >
          Kích hoạt sự kiện
        </button>
        
        <button 
          className="cancel-button"
          onClick={() => onComplete(null)}
        >
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}

export default Event;