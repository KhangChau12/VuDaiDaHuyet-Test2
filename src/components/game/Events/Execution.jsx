import React, { useState } from 'react';
import { usePlayerContext } from '../../../context/PlayerContext';
import { useGameContext } from '../../../context/GameContext';
import '../../../styles/events.css';
import { findRightmostPowerThemeMember } from '../../../utils/statusEffects';

function Execution({ onComplete }) {
  const { players, removePlayer, removeItem } = usePlayerContext();
  const { setVoteResult, useMinhOan } = useGameContext();
  
  const [votes, setVotes] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [binhChucEffect, setBinhChucEffect] = useState(null);
  
  // Danh sách người chơi còn sống
  const alivePlayers = players.filter(player => player.alive);
  
  // Cập nhật số phiếu cho người chơi
  const updateVote = (playerId, voteCount) => {
    setVotes({
      ...votes,
      [playerId]: Math.max(0, parseInt(voteCount) || 0)
    });
  };
  
  // Tính tổng số phiếu
  const getTotalVotes = () => {
    return Object.values(votes).reduce((sum, count) => sum + count, 0);
  };
  
  // Xác định người bị vote cao nhất
  const findMostVoted = () => {
    let maxVotes = 0;
    let maxPlayer = null;
    
    Object.entries(votes).forEach(([playerId, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        maxPlayer = players.find(p => p.id === playerId);
      }
    });
    
    return maxPlayer;
  };
  
  // Xử lý biểu quyết
  const handleVoteResults = () => {
    const mostVoted = findMostVoted();
    
    if (!mostVoted) {
      setExecutionResult({
        message: 'Không có ai bị vote đủ để xử tử.',
        executed: false
      });
      setShowResults(true);
      return;
    }
    
    // Kiểm tra xem người bị vote có thẻ Minh Oan không
    if (mostVoted.items['Minh Oan'] > 0) {
      removeItem(mostVoted.id, 'Minh Oan');
      useMinhOan();
      
      setExecutionResult({
        message: `${mostVoted.name} đã sử dụng thẻ Minh Oan và không bị xử tử.`,
        executed: false
      });
      setShowResults(true);
      return;
    }
    
    // Thực hiện xử tử
    removePlayer(mostVoted.id);
    setVoteResult(mostVoted.id);
    
    let resultMessage = `${mostVoted.name} (${mostVoted.role}) đã bị xử tử.`;
    
    // Kiểm tra hiệu ứng đặc biệt của Binh Chức
    if (mostVoted.role === 'Binh Chức') {
      const powerThemeMember = findRightmostPowerThemeMember(players, mostVoted.id);
      
      if (powerThemeMember) {
        removePlayer(powerThemeMember.id);
        setBinhChucEffect({
          message: `${powerThemeMember.name} (${powerThemeMember.role}) cũng bị loại do hiệu ứng của Binh Chức.`,
          playerId: powerThemeMember.id
        });
        
        resultMessage += ` ${powerThemeMember.name} (${powerThemeMember.role}) cũng bị loại do hiệu ứng của Binh Chức.`;
      }
    }
    
    setExecutionResult({
      message: resultMessage,
      executed: true,
      executedPlayer: mostVoted
    });
    
    setShowResults(true);
  };
  
  // Kết thúc sự kiện
  const handleComplete = () => {
    const messages = [];
    
    if (executionResult) {
      messages.push(executionResult.message);
    }
    
    onComplete(messages);
  };
  
  return (
    <div className="event-overlay">
      <div className="event-container execution">
        <h2>Xét Xử</h2>
        <p>Dân làng bỏ phiếu chọn ra người nghi ngờ để xét xử.</p>
        
        {!showResults ? (
          <div className="voting-section">
            <div className="player-votes">
              {alivePlayers.map(player => (
                <div key={player.id} className="player-vote-entry">
                  <span className="player-name">{player.name}</span>
                  <input
                    type="number"
                    className="vote-input"
                    min="0"
                    value={votes[player.id] || 0}
                    onChange={(e) => updateVote(player.id, e.target.value)}
                  />
                </div>
              ))}
            </div>
            
            <div className="vote-summary">
              <p>Tổng số phiếu: {getTotalVotes()}</p>
            </div>
            
            <button 
              className="confirm-button"
              onClick={handleVoteResults}
              disabled={getTotalVotes() === 0}
            >
              Xác nhận kết quả
            </button>
          </div>
        ) : (
          <div className="execution-result">
            <div className="result-message">
              <p>{executionResult.message}</p>
            </div>
            
            <button 
              className="complete-button"
              onClick={handleComplete}
            >
              Tiếp tục
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Execution;