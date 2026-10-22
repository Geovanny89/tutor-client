import React, { useState, useMemo } from 'react';
import { useVoice } from '../../hooks/useVoice';
import { createKidSpeak } from '../../utils/kidSpeak';
import { CORE_GAME_TYPES, getKidGameById, extractLessonItems } from '../kids/kidsConstants';
import KidsHeroBanner from '../kids/KidsHeroBanner';
import KidsMissionMap from '../kids/KidsMissionMap';
import KidsMissionView from '../kids/KidsMissionView';
import KidsFreePlay from '../kids/KidsFreePlay';

export default function KidsStudyPanel({ user, modules = [], loading = false }) {
  const [stars, setStars] = useState(() => {
    const saved = localStorage.getItem('kdice_kids_stars');
    return saved ? parseInt(saved, 10) : 50;
  });
  const [starBounce, setStarBounce] = useState(false);
  const [activeLessonGame, setActiveLessonGame] = useState(null);
  const [freeGame, setFreeGame] = useState('listen');

  const { speak, speakBilingual } = useVoice({ lang: 'en-US', rate: 0.9, pitch: 1.1 });
  const kidSpeak = useMemo(() => createKidSpeak({ speak, speakBilingual }), [speak, speakBilingual]);

  // Aplana módulos → lecciones individuales:
  // Si el profesor configuró un juego con IA específico, usa ese;
  // de lo contrario, rota entre los 4 juegos globales principales.
  const lessonMissions = useMemo(() => {
    const missions = [];
    modules.forEach((mod) => {
      const lessons = mod.lessons || [];
      lessons.forEach((lesson, idx) => {
        const chosenGameId = lesson.content?.kids_game || lesson.kids_game;
        const gameType = chosenGameId && chosenGameId !== 'default'
          ? getKidGameById(chosenGameId)
          : CORE_GAME_TYPES[missions.length % CORE_GAME_TYPES.length];

        missions.push({
          key: `${mod.id}-${lesson.id || idx}`,
          lesson,
          module: mod,
          gameType,
          items: extractLessonItems(lesson),
          missionNumber: missions.length + 1,
        });
      });
    });
    return missions;
  }, [modules]);

  const handleEarnStar = (amount = 10) => {
    setStars((prev) => {
      const next = prev + amount;
      localStorage.setItem('kdice_kids_stars', next.toString());
      return next;
    });
    setStarBounce(true);
    setTimeout(() => setStarBounce(false), 600);
  };

  const handleStartMission = (mission) => {
    setActiveLessonGame(mission);
    kidSpeak.speakToby(
      `¡Guau guau! ¡Misión número ${mission.missionNumber}: ${mission.lesson.title || mission.module.name}! ` +
        `¡Vamos a jugar y ganar estrellitas! ¡Tú puedes!`
    );
  };

  const handleBackToHome = () => {
    setActiveLessonGame(null);
    kidSpeak.speakToby('¡Muy bien! ¡Volvimos al mapa de misiones! Elige otra misión para seguir aprendiendo.');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-subtle)' }}>
        <span style={{ fontSize: '3rem', display: 'block', animation: 'bounce 1s infinite' }}>🐶</span>
        <p style={{ fontWeight: 800, marginTop: '1rem' }}>Toby está preparando tus juegos...</p>
      </div>
    );
  }

  // Vista activa de una misión específica
  if (activeLessonGame) {
    return (
      <KidsMissionView
        mission={activeLessonGame}
        stars={stars}
        starBounce={starBounce}
        kidSpeak={kidSpeak}
        onBack={handleBackToHome}
        onEarnStar={handleEarnStar}
      />
    );
  }

  // Vista principal: Banner Toby + Mapa de Misiones + Juegos Libres
  return (
    <div style={{ color: 'var(--text-primary)', maxWidth: '1000px', margin: '0 auto', paddingBottom: '3rem' }}>
      <KidsHeroBanner
        user={user}
        missionsCount={lessonMissions.length}
        stars={stars}
        starBounce={starBounce}
        kidSpeak={kidSpeak}
      />

      <KidsMissionMap
        missions={lessonMissions}
        onStartMission={handleStartMission}
      />

      <KidsFreePlay
        freeGame={freeGame}
        onSelectGame={setFreeGame}
        onEarnStar={handleEarnStar}
        kidSpeak={kidSpeak}
        hasMissions={lessonMissions.length > 0}
      />
    </div>
  );
}
