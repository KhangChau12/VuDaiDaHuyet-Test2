// File: src/components/game/Day.jsx

import React, { useEffect, useState, useRef } from 'react'
import "../../styles/home.css"
import "../../styles/form.css"

import QuyenThe from "../../assets/team/Logo phe Quyền Thế.svg";
import CongLy from "../../assets/team/Logo phe Công Lý.svg";
import DoiTao from "../../assets/team/Logo phe Đội Tảo.svg";
import LangThang from "../../assets/team/Logo phe Lang Thang.svg";

import background from "../../assets/background_day.jpg";
import Card from '../player/Card';
import PlayerMenu from '../player/PlayerMenu';
import { useGameContext } from '../../context/GameContext';
import { usePlayerContext } from '../../context/PlayerContext';
import Execution from './Events/Execution';
import { checkAllVictoryConditions } from '../../services/victoryConditions';
import { getEventByDay } from '../../services/eventManager';

function Day({ date, onEnd }) {
  const titleRef = useRef(null);
  const gameRef = useRef(null);
  const filterRef = useRef(null);
  const playerContRef = useRef(null);
  const dayRef = useRef(null);
  const eventRef = useRef(null);
  const moneyDistributedRef = useRef(false);

  const { currentEvent, executionPhase, setGameOver } = useGameContext();
  const { players, addCoins } = usePlayerContext();

  const [filterTeam, setFilterTeam] = useState('all');
  const [playerToSee, setPlayerToSee] = useState(null);
  const [showExecution, setShowExecution] = useState(false);
  const [eventMessages, setEventMessages] = useState([]);

  const teamImage = {
    'Quyền Thế': QuyenThe,
    'Công Lý': CongLy,
    'Đội Tảo': DoiTao,
    'Lang Thang': LangThang
  }

  // Kiểm tra điều kiện chiến thắng
  useEffect(() => {
    const victoryCheck = checkAllVictoryConditions(players);
    if (victoryCheck.victory) {
      setGameOver(victoryCheck.winner);
    }
  }, [players]);

  // Animation effect
  useEffect(() => {
    const title = titleRef.current;
    const game_title = gameRef.current;
    const filter = filterRef.current;
    const playerCont = playerContRef.current;
    const dayControl = dayRef.current;

    setTimeout(() => {
      title.style.marginTop = '-50%';
      title.style.opacity = '0';
      const event = eventRef.current;

      setTimeout(() => {
        title.style.display = 'none';
        game_title.style.opacity = '1';
        filter.style.opacity = '1';
        playerCont.style.opacity = '1';
        dayControl.style.opacity = '1';
        event.style.opacity = '1';
      }, 1000);
    }, 1000);
  }, []);

  // Phân phối tiền và thiết lập thông báo khi component mount
  useEffect(() => {
    // Nếu đã phân phối tiền hoặc là ngày 0, không làm gì cả
    if (moneyDistributedRef.current || date === 0) {
      return;
    }

    // Ngày 0 chỉ hiển thị thông báo
    if (date === 0) {
      if (currentEvent === 'market') {
        setEventMessages(['Ngày Chợ Phiên: Mọi người có thể mua thẻ Hành Động từ Menu của nhân vật.']);
      }
      moneyDistributedRef.current = true;
      return;
    }

    // Từ ngày 1 trở đi, phân phối tiền theo sự kiện
    const eventType = getEventByDay(date);
    const messages = [];

    // Phân phối tiền dựa trên sự kiện
    if (eventType === 'harvest') {
      // Ngày Thu Hoạch: Phe Công Lý và Lang Thang nhận 2 đồng, phe Quyền Thế nhận 1 đồng
      players.forEach(player => {
        if (player.alive) {
          if (player.team === 'Quyền Thế') {
            addCoins(player.id, 1);
          } else {
            addCoins(player.id, 2);
          }
        }
      });
      messages.push('Ngày Thu Hoạch: Phe Công Lý và Lang Thang nhận 2 đồng, phe Quyền Thế nhận 1 đồng.');
    } else {
      // Ngày thường: Mọi người nhận 1 đồng
      players.forEach(player => {
        if (player.alive) {
          addCoins(player.id, 1);
        }
      });
      messages.push('Mọi người nhận 1 đồng.');
    }

    // Thêm thông báo về loại ngày
    if (currentEvent === 'market') {
      messages.push('Ngày Chợ Phiên: Mọi người có thể mua thẻ Hành Động từ Menu của nhân vật.');
    } else if (currentEvent === 'wine') {
      messages.push('Tiệc Rượu: 3 người ngẫu nhiên sẽ nhận thẻ Say Rượu.');
    }

    // Cập nhật thông báo
    setEventMessages(messages);
    
    // Đánh dấu đã phân phối tiền
    moneyDistributedRef.current = true;
  }, [date, currentEvent, players]);

  // Hiển thị execution phase sau khi component mount nếu cần
  useEffect(() => {
    if (executionPhase.canExecute) {
      setTimeout(() => {
        setShowExecution(true);
      }, 3000);
    }
  }, [executionPhase.canExecute]);

  // Function to filter players by team
  const getFilteredPlayers = () => {
    if (filterTeam === 'all') return players.filter(p => p.alive);
    return players.filter(player => player.team === filterTeam && player.alive);
  };

  // Group players by team for better organization
  const getPlayersByTeam = () => {
    const teams = {
      'Quyền Thế': [],
      'Công Lý': [],
      'Đội Tảo': [],
      'Lang Thang': []
    };

    players.forEach(player => {
      if (player.alive && teams[player.team]) {
        teams[player.team].push(player);
      }
    });

    return teams;
  };

  const groupedPlayers = getPlayersByTeam();

  // Function to handle event completion
  const handleEventComplete = (messages) => {
    setShowExecution(false);
    if (messages) {
      setEventMessages(prev => [...prev, ...messages]);
    }
  };

  // Hàm xử lý menu nhân vật
  const handlePlayerCardClick = (player) => {
    setPlayerToSee(player);
  };

  // Hàm đóng menu
  const closePlayerMenu = () => {
    setPlayerToSee(null);
  };

  return (
    <div className='game'>
      <div className='background'>
        <img src={background} alt="Background" />
      </div>

      <div id='title' ref={titleRef}>
        <h2>NGÀY {date}</h2>
      </div>

      <div id='game_title' ref={gameRef}>
        <h2>
          Ngày {date} - {
            currentEvent === 'market' ? 'Chợ Phiên' : 
            currentEvent === 'harvest' ? 'Thu Hoạch' : 
            currentEvent === 'wine' ? 'Tiệc Rượu' : 'Ngày thường'
          }
        </h2>
      </div>

      {/* Event messages */}
      <div className="event-messages" ref={eventRef} style={{opacity: eventMessages.length > 0 ? 1 : 0}}>
        {eventMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>

      {/* Filter buttons */}
      <div className="player-filters" ref={filterRef}>
        <button
          className={filterTeam === 'all' ? 'active' : ''}
          onClick={() => setFilterTeam('all')}
        >
          Tất cả
        </button>
        <button
          className={filterTeam === 'Quyền Thế' ? 'active' : ''}
          onClick={() => setFilterTeam('Quyền Thế')}
        >
          Phe Quyền Thế
        </button>
        <button
          className={filterTeam === 'Công Lý' ? 'active' : ''}
          onClick={() => setFilterTeam('Công Lý')}
        >
          Phe Công Lý
        </button>
        <button
          className={filterTeam === 'Đội Tảo' ? 'active' : ''}
          onClick={() => setFilterTeam('Đội Tảo')}
        >
          Phe Đội Tảo
        </button>
        <button
          className={filterTeam === 'Lang Thang' ? 'active' : ''}
          onClick={() => setFilterTeam('Lang Thang')}
        >
          Những kẻ Lang Thang
        </button>
      </div>

      {/* Player list container */}
      <div id='player_cont' ref={playerContRef}>
        {filterTeam === 'all' ? (
          // Display by team groups
          Object.entries(groupedPlayers).map(([team, teamPlayers]) => (
            teamPlayers.length > 0 && (
              <div key={team} className="team-section">
                <h3 className="team-title"><img src={teamImage[team]} alt={team} />{team}</h3>
                <div id="player_list">
                  {teamPlayers.map((player) => (
                    <Card
                      key={player.id}
                      player={player}
                      seeMenu={() => handlePlayerCardClick(player)}
                    />
                  ))}
                </div>
              </div>
            )
          ))
        ) : (
          // Display filtered players
          <div id="player_list">
            {getFilteredPlayers().map((player) => (
              <Card
                key={player.id}
                player={player}
                seeMenu={() => handlePlayerCardClick(player)}
              />
            ))}
          </div>
        )}

        {/* Show message if no players in selected filter */}
        {filterTeam !== 'all' && getFilteredPlayers().length === 0 && (
          <div className="no-players">
            <p>Không có người chơi nào thuộc phe {filterTeam}</p>
          </div>
        )}
      </div>

      {playerToSee && 
        <div id='menu_cont'>
          <PlayerMenu player={playerToSee} back={closePlayerMenu} />
        </div>
      }

      {/* Execution component */}
      {showExecution && <Execution onComplete={handleEventComplete} />}

      {/* Game controls */}
      <div className="day-controls" ref={dayRef}>
        <button
          className="next-phase-btn"
          onClick={() => {
            // Reset trạng thái phân phối tiền khi chuyển sang đêm
            moneyDistributedRef.current = false;
            onEnd();
          }}
          disabled={showExecution}
        >
          Bắt đầu đêm {date + 1}
        </button>
      </div>
    </div>
  );
}

export default Day;