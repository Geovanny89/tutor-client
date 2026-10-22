import React, { lazy, Suspense } from 'react';

// Importaciones de juegos
import BossBattleGame from './games/BossBattleGame';
import WordShooterGame from './games/WordShooterGame';
import EscapeRoomGame from './games/EscapeRoomGame';
import DetectiveLiesGame from './games/DetectiveLiesGame';
import RoleplayShopGame from './games/RoleplayShopGame';
import SpeedTyperGame from './games/SpeedTyperGame';
import WordRunnerGame from './games/WordRunnerGame';
import {
  CrosswordProGame,
  RpgAdventureGame,
  CyberMissionGame,
  TowerDefenseGame,
  DebateArenaGame,
  NewsAnchorGame,
  CipherChallengeGame,
  GrammarChessGame,
} from './games/MiscTeenGames';

/**
 * TeensGameDispatcher — Recibe un missionId y un array de items de vocabulario.
 * Renderiza el componente de juego correspondiente.
 */
export default function TeensGameDispatcher({ missionId, items = [], onWin, onLose }) {
  const props = { items, onWin, onLose };

  switch (missionId) {
    // ── Misterio ──────────────────────────────────────────────────────────────
    case 'escape_room':      return <EscapeRoomGame {...props} />;
    case 'detective_lies':   return <DetectiveLiesGame {...props} />;
    case 'rpg_adventure':    return <RpgAdventureGame onWin={onWin} onLose={onLose} />;
    case 'cyber_mission':    return <CyberMissionGame onWin={onWin} onLose={onLose} />;

    // ── Combate ───────────────────────────────────────────────────────────────
    case 'boss_battle':      return <BossBattleGame {...props} />;
    case 'word_shooter':     return <WordShooterGame {...props} />;
    case 'tower_defense':    return <TowerDefenseGame {...props} />;

    // ── Lógica ────────────────────────────────────────────────────────────────
    case 'crossword_pro':    return <CrosswordProGame {...props} />;
    case 'cipher_challenge': return <CipherChallengeGame {...props} />;
    case 'grammar_chess':    return <GrammarChessGame onWin={onWin} onLose={onLose} />;

    // ── Comunicación ──────────────────────────────────────────────────────────
    case 'debate_arena':     return <DebateArenaGame onWin={onWin} onLose={onLose} />;
    case 'roleplay_shop':    return <RoleplayShopGame onWin={onWin} onLose={onLose} />;
    case 'news_anchor':      return <NewsAnchorGame onWin={onWin} onLose={onLose} />;

    // ── Arcade ────────────────────────────────────────────────────────────────
    case 'speed_typer':      return <SpeedTyperGame {...props} />;
    case 'word_runner':      return <WordRunnerGame {...props} />;

    default:
      return (
        <div style={{
          background: 'linear-gradient(145deg, #0f0c22 0%, #0f172a 100%)',
          borderRadius: '20px', padding: '3rem', textAlign: 'center', color: '#fff',
        }}>
          <p style={{ fontSize: '3rem' }}>🎮</p>
          <p style={{ fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>
            Juego "{missionId}" no encontrado.
          </p>
        </div>
      );
  }
}
