import React, { createContext, useReducer, useContext } from 'react';
import { getEventByDay } from '../services/eventManager';
import { getNightSequence } from '../services/gameLogic';

// Khởi tạo context
const GameContext = createContext();

// Trạng thái ban đầu của game
const initialState = {
  currentPhase: 'setup', // setup, day, night
  currentDay: 0,
  currentEvent: null, // market, harvest, wine, execution
  nightPhase: {
    currentRole: null,
    sequence: [],
    currentIndex: 0,
    actions: {},
  },
  executionPhase: {
    canExecute: false, // Chỉ true từ ngày 4 trở đi
    voteResult: null,
    usedMinhOan: false,
  },
  gameOver: false,
  winner: null,
};

// Action types
const ACTIONS = {
  SET_PHASE: 'set_phase',
  NEXT_DAY: 'next_day',
  SET_EVENT: 'set_event',
  SET_NIGHT_ROLE: 'set_night_role',
  RECORD_NIGHT_ACTION: 'record_night_action',
  NEXT_NIGHT_ROLE: 'next_night_role',
  INIT_NIGHT_SEQUENCE: 'init_night_sequence',
  SET_VOTE_RESULT: 'set_vote_result',
  USE_MINH_OAN: 'use_minh_oan',
  SET_GAME_OVER: 'set_game_over',
  RESET_GAME: 'reset_game',
};

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PHASE:
      return { ...state, currentPhase: action.payload };
    
    case ACTIONS.NEXT_DAY:
      const nextDay = state.currentDay + 1;
      // Xác định sự kiện dựa vào ngày
      const nextEvent = getEventByDay(nextDay);
      
      // Xét xử chỉ bắt đầu từ ngày 4
      const canExecute = nextDay >= 4;
      
      return { 
        ...state, 
        currentDay: nextDay, 
        currentEvent: nextEvent,
        executionPhase: {
          ...state.executionPhase,
          canExecute,
          voteResult: null, // Reset kết quả vote cũ
          usedMinhOan: false // Reset việc sử dụng Minh Oan
        }
      };
    
    case ACTIONS.SET_EVENT:
      return { ...state, currentEvent: action.payload };
    
    case ACTIONS.INIT_NIGHT_SEQUENCE:
      // Sử dụng hàm từ gameLogic để lấy thứ tự gọi
      const sequence = getNightSequence(action.payload, state.currentDay);
      
      return {
        ...state,
        nightPhase: {
          sequence,
          currentIndex: 0,
          currentRole: sequence[0] || null,
          actions: {},
        }
      };
    
    case ACTIONS.NEXT_NIGHT_ROLE:
      const nextIndex = state.nightPhase.currentIndex + 1;
      const nextRole = state.nightPhase.sequence[nextIndex] || null;
      
      return {
        ...state,
        nightPhase: {
          ...state.nightPhase,
          currentIndex: nextIndex,
          currentRole: nextRole,
        }
      };
    
    case ACTIONS.RECORD_NIGHT_ACTION:
      return {
        ...state,
        nightPhase: {
          ...state.nightPhase,
          actions: {
            ...state.nightPhase.actions,
            [action.payload.role]: action.payload.action
          }
        }
      };
    
    case ACTIONS.SET_VOTE_RESULT:
      return {
        ...state,
        executionPhase: {
          ...state.executionPhase,
          voteResult: action.payload
        }
      };
    
    case ACTIONS.USE_MINH_OAN:
      return {
        ...state,
        executionPhase: {
          ...state.executionPhase,
          usedMinhOan: true
        }
      };
    
    case ACTIONS.SET_GAME_OVER:
      return {
        ...state,
        gameOver: true,
        winner: action.payload
      };
    
    case ACTIONS.RESET_GAME:
      return initialState;
    
    default:
      return state;
  }
}

// Provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Helper functions to dispatch actions
  const setPhase = (phase) => dispatch({ type: ACTIONS.SET_PHASE, payload: phase });
  const nextDay = () => dispatch({ type: ACTIONS.NEXT_DAY });
  const setEvent = (event) => dispatch({ type: ACTIONS.SET_EVENT, payload: event });
  
  const initNightSequence = (playersArray) => {
    dispatch({ type: ACTIONS.INIT_NIGHT_SEQUENCE, payload: playersArray });
  };
  
  const nextNightRole = () => dispatch({ type: ACTIONS.NEXT_NIGHT_ROLE });
  
  const recordNightAction = (role, action) => {
    dispatch({ 
      type: ACTIONS.RECORD_NIGHT_ACTION, 
      payload: { role, action } 
    });
  };
  
  const setVoteResult = (playerId) => {
    dispatch({ type: ACTIONS.SET_VOTE_RESULT, payload: playerId });
  };
  
  const useMinhOan = () => dispatch({ type: ACTIONS.USE_MINH_OAN });
  
  const setGameOver = (winner) => {
    dispatch({ type: ACTIONS.SET_GAME_OVER, payload: winner });
  };
  
  const resetGame = () => dispatch({ type: ACTIONS.RESET_GAME });
  
  // Value object to be provided to consumers
  const value = {
    ...state,
    setPhase,
    nextDay,
    setEvent,
    initNightSequence,
    nextNightRole,
    recordNightAction,
    setVoteResult,
    useMinhOan,
    setGameOver,
    resetGame
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// Custom hook for using the GameContext
export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}