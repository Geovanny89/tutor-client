import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// ─── Estado inicial del jugador ───────────────────────────────────────────────
const INITIAL_STATE = {
  xp: 0,
  level: 1,
  coins: 100,
  inventory: [],          // { id, name, emoji, rarity, acquiredAt }
  activeMission: null,    // ID de la misión activa
  completedMissions: [],  // IDs de misiones completadas
  adUnlocked: [],         // IDs de misiones desbloqueadas con anuncio
  streak: 0,
  lastPlayDate: null,
};

// ─── XP por nivel ─────────────────────────────────────────────────────────────
export const XP_PER_LEVEL = 500;
export const getLevel = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1;

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'EARN_XP': {
      const newXp = state.xp + action.payload;
      const newLevel = getLevel(newXp);
      const today = new Date().toISOString().split('T')[0];
      const streakAdd = state.lastPlayDate !== today ? 1 : 0;
      return {
        ...state,
        xp: newXp,
        level: newLevel,
        streak: state.streak + streakAdd,
        lastPlayDate: today,
      };
    }
    case 'EARN_COINS':
      return { ...state, coins: state.coins + action.payload };
    case 'SPEND_COINS':
      return { ...state, coins: Math.max(0, state.coins - action.payload) };
    case 'ADD_ITEM':
      if (state.inventory.find((i) => i.id === action.payload.id)) return state;
      return { ...state, inventory: [...state.inventory, { ...action.payload, acquiredAt: Date.now() }] };
    case 'SET_ACTIVE_MISSION':
      return { ...state, activeMission: action.payload };
    case 'COMPLETE_MISSION':
      if (state.completedMissions.includes(action.payload)) return state;
      return { ...state, completedMissions: [...state.completedMissions, action.payload] };
    case 'UNLOCK_MISSION_AD':
      if (state.adUnlocked.includes(action.payload)) return state;
      return { ...state, adUnlocked: [...state.adUnlocked, action.payload] };
    case 'RESET_MISSION_UNLOCK':
      return { ...state, adUnlocked: state.adUnlocked.filter((id) => id !== action.payload) };
    case 'LOAD_STATE':
      return { ...INITIAL_STATE, ...action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const TeensGameContext = createContext(null);
const STORAGE_KEY = 'kdice_teens_game_ctx';

export function TeensGameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) }); } catch (_) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const earnXp = useCallback((amount) => dispatch({ type: 'EARN_XP', payload: amount }), []);
  const earnCoins = useCallback((amount) => dispatch({ type: 'EARN_COINS', payload: amount }), []);
  const spendCoins = useCallback((amount) => dispatch({ type: 'SPEND_COINS', payload: amount }), []);
  const addItem = useCallback((item) => dispatch({ type: 'ADD_ITEM', payload: item }), []);
  const setActiveMission = useCallback((id) => dispatch({ type: 'SET_ACTIVE_MISSION', payload: id }), []);
  const completeMission = useCallback((id) => dispatch({ type: 'COMPLETE_MISSION', payload: id }), []);
  const unlockMissionAd = useCallback((id) => dispatch({ type: 'UNLOCK_MISSION_AD', payload: id }), []);
  const resetMissionUnlock = useCallback((id) => dispatch({ type: 'RESET_MISSION_UNLOCK', payload: id }), []);

  const isMissionUnlocked = useCallback(
    (id) => state.adUnlocked.includes(id) || state.completedMissions.includes(id),
    [state.adUnlocked, state.completedMissions]
  );
  const isMissionCompleted = useCallback(
    (id) => state.completedMissions.includes(id),
    [state.completedMissions]
  );

  const xpInLevel = state.xp % XP_PER_LEVEL;
  const xpProgress = Math.round((xpInLevel / XP_PER_LEVEL) * 100);

  return (
    <TeensGameContext.Provider value={{
      ...state, xpInLevel, xpProgress,
      earnXp, earnCoins, spendCoins, addItem,
      setActiveMission, completeMission, unlockMissionAd, resetMissionUnlock,
      isMissionUnlocked, isMissionCompleted,
    }}>
      {children}
    </TeensGameContext.Provider>
  );
}

export function useTeensGame() {
  const ctx = useContext(TeensGameContext);
  if (!ctx) throw new Error('useTeensGame must be used inside <TeensGameProvider>');
  return ctx;
}
