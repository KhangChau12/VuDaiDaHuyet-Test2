import React, { createContext, useReducer, useContext } from 'react';

// Khởi tạo context
const PlayerContext = createContext();

// Trạng thái ban đầu
const initialState = {
  players: [],
  selectedPlayer: null,
  selectedTarget: null
};

// Action types
const ACTIONS = {
  SET_PLAYERS: 'set_players',
  SELECT_PLAYER: 'select_player',
  SELECT_TARGET: 'select_target',
  ADD_COINS: 'add_coins',
  REMOVE_COINS: 'remove_coins',
  ADD_ITEM: 'add_item',
  REMOVE_ITEM: 'remove_item',
  INCREASE_FRUSTRATION: 'increase_frustration',
  DECREASE_FRUSTRATION: 'decrease_frustration',
  SET_DRUNK: 'set_drunk',
  UNSET_DRUNK: 'unset_drunk',
  INCREASE_WINE: 'increase_wine',
  REMOVE_PLAYER: 'remove_player',
  CHANGE_TEAM: 'change_team',
  SET_MUTED: 'set_muted',
  UNSET_MUTED: 'unset_muted'
};

// Reducer function
function playerReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PLAYERS:
      return { ...state, players: action.payload };
    
    case ACTIONS.SELECT_PLAYER:
      return { ...state, selectedPlayer: action.payload };
    
    case ACTIONS.SELECT_TARGET:
      return { ...state, selectedTarget: action.payload };
    
    case ACTIONS.ADD_COINS:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.playerId 
            ? { ...player, coins: player.coins + action.payload.amount }
            : player
        )
      };
    
    case ACTIONS.REMOVE_COINS:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.playerId 
            ? { ...player, coins: Math.max(0, player.coins - action.payload.amount) }
            : player
        )
      };
    
    case ACTIONS.ADD_ITEM:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.playerId 
            ? { 
                ...player, 
                items: { 
                  ...player.items, 
                  [action.payload.item]: (player.items[action.payload.item] || 0) + 1 
                } 
              }
            : player
        )
      };
    
    case ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.playerId 
            ? { 
                ...player, 
                items: { 
                  ...player.items, 
                  [action.payload.item]: Math.max(0, (player.items[action.payload.item] || 0) - 1)
                } 
              }
            : player
        )
      };
    
    case ACTIONS.INCREASE_FRUSTRATION:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.playerId 
            ? { ...player, frustration: player.frustration + action.payload.amount }
            : player
        )
      };
    
    case ACTIONS.DECREASE_FRUSTRATION:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.playerId 
            ? { ...player, frustration: Math.max(0, player.frustration - action.payload.amount) }
            : player
        )
      };
    
    case ACTIONS.SET_DRUNK:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload 
            ? { ...player, drunk: true }
            : player
        )
      };
    
    case ACTIONS.UNSET_DRUNK:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload 
            ? { ...player, drunk: false }
            : player
        )
      };
    
    case ACTIONS.INCREASE_WINE:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.playerId 
            ? { ...player, wine: player.wine + action.payload.amount }
            : player
        )
      };
    
    case ACTIONS.REMOVE_PLAYER:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload 
            ? { ...player, alive: false }
            : player
        )
      };
    
    case ACTIONS.CHANGE_TEAM:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.playerId 
            ? { ...player, team: action.payload.team }
            : player
        )
      };
    
    case ACTIONS.SET_MUTED:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload 
            ? { ...player, shutup: true }
            : player
        )
      };
    
    case ACTIONS.UNSET_MUTED:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload 
            ? { ...player, shutup: false }
            : player
        )
      };
    
    default:
      return state;
  }
}

// Provider component
export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  
  // Helper functions to dispatch actions
  const setPlayers = (players) => {
    dispatch({ type: ACTIONS.SET_PLAYERS, payload: players });
  };
  
  const selectPlayer = (playerId) => {
    dispatch({ type: ACTIONS.SELECT_PLAYER, payload: playerId });
  };
  
  const selectTarget = (playerId) => {
    dispatch({ type: ACTIONS.SELECT_TARGET, payload: playerId });
  };
  
  const addCoins = (playerId, amount) => {
    dispatch({ 
      type: ACTIONS.ADD_COINS, 
      payload: { playerId, amount } 
    });
  };
  
  const removeCoins = (playerId, amount) => {
    dispatch({ 
      type: ACTIONS.REMOVE_COINS, 
      payload: { playerId, amount } 
    });
  };
  
  const addItem = (playerId, item) => {
    dispatch({ 
      type: ACTIONS.ADD_ITEM, 
      payload: { playerId, item } 
    });
  };
  
  const removeItem = (playerId, item) => {
    dispatch({ 
      type: ACTIONS.REMOVE_ITEM, 
      payload: { playerId, item } 
    });
  };
  
  const increaseFrustration = (playerId, amount = 1) => {
    dispatch({ 
      type: ACTIONS.INCREASE_FRUSTRATION, 
      payload: { playerId, amount } 
    });
  };
  
  const decreaseFrustration = (playerId, amount = 1) => {
    dispatch({ 
      type: ACTIONS.DECREASE_FRUSTRATION, 
      payload: { playerId, amount } 
    });
  };
  
  const setDrunk = (playerId) => {
    dispatch({ type: ACTIONS.SET_DRUNK, payload: playerId });
  };
  
  const unsetDrunk = (playerId) => {
    dispatch({ type: ACTIONS.UNSET_DRUNK, payload: playerId });
  };
  
  const increaseWine = (playerId, amount = 1) => {
    dispatch({ 
      type: ACTIONS.INCREASE_WINE, 
      payload: { playerId, amount } 
    });
  };
  
  const removePlayer = (playerId) => {
    dispatch({ type: ACTIONS.REMOVE_PLAYER, payload: playerId });
  };
  
  const changeTeam = (playerId, team) => {
    dispatch({ 
      type: ACTIONS.CHANGE_TEAM, 
      payload: { playerId, team } 
    });
  };
  
  const setMuted = (playerId) => {
    dispatch({ type: ACTIONS.SET_MUTED, payload: playerId });
  };
  
  const unsetMuted = (playerId) => {
    dispatch({ type: ACTIONS.UNSET_MUTED, payload: playerId });
  };
  
  // Lọc người chơi theo phe, trạng thái
  const getPlayersByTeam = (team) => {
    return state.players.filter(player => player.team === team);
  };
  
  const getAlivePlayers = () => {
    return state.players.filter(player => player.alive);
  };
  
  // Value object to be provided to consumers
  const value = {
    players: state.players,
    selectedPlayer: state.selectedPlayer,
    selectedTarget: state.selectedTarget,
    setPlayers,
    selectPlayer,
    selectTarget,
    addCoins,
    removeCoins,
    addItem,
    removeItem,
    increaseFrustration,
    decreaseFrustration,
    setDrunk,
    unsetDrunk,
    increaseWine,
    removePlayer,
    changeTeam,
    setMuted,
    unsetMuted,
    getPlayersByTeam,
    getAlivePlayers
  };
  
  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

// Custom hook for using the PlayerContext
export function usePlayerContext() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayerContext must be used within a PlayerProvider');
  }
  return context;
}