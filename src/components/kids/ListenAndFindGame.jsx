import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, RefreshCw, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KIDS_ITEMS } from '../../data/kidsVocabulary';
import { kidAudio } from '../../utils/kidAudio';
import TobyBubble from './TobyBubble';

export default function ListenAndFindGame({ onEarnStar, kidSpeak, items }) {
  const [target, setTarget] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [shakingId, setShakingId] = useState(null);
  const [tobyMessage, setTobyMessage] = useState('');
  const [tobyMood, setTobyMood] = useState('happy');
  const speakTimerRef = useRef(null);
  const nextRoundTimerRef = useRef(null);

  const pool = items && items.length >= 4 ? items : KIDS_ITEMS;

  const startRound = useCallback((withIntro = false) => {
    if (speakTimerRef.current) {
      clearTimeout(speakTimerRef.current);
      speakTimerRef.current = null;
    }
    if (nextRoundTimerRef.current) {
      clearTimeout(nextRoundTimerRef.current);
      nextRoundTimerRef.current = null;
    }

    const randomTarget = pool[Math.floor(Math.random() * pool.length)];
    const others = pool
      .filter((i) => i.id !== randomTarget.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const choices = [randomTarget, ...others].sort(() => 0.5 - Math.random());

    setTarget(randomTarget);
    setOptions(choices);
    setFeedback(null);
    setShakingId(null);

    const promptText = kidSpeak?.phrases?.listenIntro
      ? kidSpeak.phrases.listenIntro(randomTarget.word)
      : `¡Guau guau! ¡Aventura! ¿Dónde se esconde [[ENGLISH: ${randomTarget.word}]]? ¡Toca rápido [[ENGLISH: ${randomTarget.word}]]!`;

    setTobyMessage(promptText);
    setTobyMood('happy');

    // Toby speaks the FULL dynamic sentence
    speakTimerRef.current = setTimeout(() => {
      if (kidSpeak?.speakToby) {
        kidSpeak.speakToby(promptText);
      } else {
        kidSpeak?.speakEnglish?.(randomTarget.word);
      }
    }, 320);
  }, [kidSpeak, items]);

  useEffect(() => {
    startRound(true);
    return () => {
      if (speakTimerRef.current) clearTimeout(speakTimerRef.current);
      if (nextRoundTimerRef.current) clearTimeout(nextRoundTimerRef.current);
    };
  }, [startRound]);

  const handlePick = (item) => {
    // Block clicks while feedback/speech is in progress
    if (feedback !== null) return;

    // Clear any pending start round timers
    if (speakTimerRef.current) clearTimeout(speakTimerRef.current);

    if (item.id === target.id) {
      setFeedback('correct');
      kidAudio.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
      });

      const winMsg = kidSpeak?.phrases?.listenCorrect
        ? kidSpeak.phrases.listenCorrect(target.word)
        : `¡Yuuupiii! ¡Excelente trabajo! ¡Se dice [[ENGLISH: ${target.word}]]! Repite fuerte conmigo: [[ENGLISH: ${target.word}]]!`;

      setTobyMessage(winMsg);
      setTobyMood('celebrate');

      setStreak((s) => s + 1);
      if (onEarnStar) onEarnStar(10);

      // Only advance to the next round AFTER Toby finishes saying the whole celebration!
      let transitioned = false;
      const proceedToNextRound = () => {
        if (transitioned) return;
        transitioned = true;
        // 800ms natural pause after speech ends before loading the next card
        nextRoundTimerRef.current = setTimeout(() => {
          startRound(false);
        }, 800);
      };

      // Failsafe timeout in case browser TTS event doesn't fire
      nextRoundTimerRef.current = setTimeout(proceedToNextRound, 5500);

      kidSpeak?.speakToby
        ? kidSpeak.speakToby(winMsg, { onEnd: proceedToNextRound })
        : kidSpeak?.speakSpanish('¡Excelente!');
    } else {
      setFeedback('wrong');
      setShakingId(item.id);
      kidAudio.playTryAgain();

      const tryAgainMsg = kidSpeak?.phrases?.listenWrong
        ? kidSpeak.phrases.listenWrong(target.word)
        : `¡Oh oh! ¡Casi casi! Escucha de nuevo: estamos buscando [[ENGLISH: ${target.word}]]. ¡Tú puedes, amiguito!`;

      setTobyMessage(tryAgainMsg);
      setTobyMood('thinking');

      // Unblock cards only after Toby finishes explaining the hint
      let unlocked = false;
      const unlockAfterSpeech = () => {
        if (unlocked) return;
        unlocked = true;
        setFeedback(null);
        setShakingId(null);
      };

      // Failsafe unlock after 4.5s
      setTimeout(unlockAfterSpeech, 4500);

      kidSpeak?.speakToby
        ? kidSpeak.speakToby(tryAgainMsg, { onEnd: unlockAfterSpeech })
        : kidSpeak?.speakSpanish('¡Intenta otra vez!');
    }
  };

  if (!target) return null;

  return (
    <div style={{
      background: 'linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)',
      border: '4px solid #06b6d4',
      borderRadius: '32px',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      boxShadow: '0 20px 30px -10px rgba(6, 182, 212, 0.2)',
      position: 'relative',
    }}>
      {/* Toby coach bubble */}
      <TobyBubble
        message={tobyMessage}
        mood={tobyMood}
        onRepeat={(style) => {
          kidSpeak?.speakToby
            ? kidSpeak.speakToby(tobyMessage, { style })
            : kidSpeak?.speakEnglish(target.word);
        }}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: '#fef08a',
          color: '#854d0e',
          padding: '0.5rem 1.25rem',
          borderRadius: '999px',
          fontWeight: 900,
          fontSize: '1.1rem',
          boxShadow: '0 4px 10px rgba(234, 179, 8, 0.25)',
        }}>
          <Star fill="#eab308" color="#eab308" size={22} />
          <span>Aciertos: {streak}</span>
        </div>

        <button
          onClick={() => startRound(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#ffffff',
            border: '2px solid #cbd5e1',
            borderRadius: '999px',
            padding: '0.45rem 1rem',
            fontWeight: 800,
            fontSize: '0.9rem',
            color: '#475569',
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={16} /> Cambiar
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <p style={{
          fontSize: '1.35rem',
          fontWeight: 900,
          color: '#0e7490',
          margin: '0 0 1rem',
        }}>
          ¡Vamos a jugar! ¿Dónde está? ¡Toca el dibujo! 👇
        </p>

        <button
          onClick={() => {
            kidAudio?.playPop?.();
            const promptMsg = `¿Dónde está? ¡Toca rápido [[ENGLISH: ${target?.word}]]!`;
            if (kidSpeak?.speakToby) {
              kidSpeak.speakToby(promptMsg);
            } else {
              kidSpeak?.speakEnglish?.(target?.word);
            }
          }}
          title="Toca para escuchar otra vez con Toby"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '999px',
            padding: '1rem 2.2rem',
            fontSize: '1.6rem',
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(6, 182, 212, 0.4)',
            transform: 'scale(1)',
            transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Volume2 size={32} />
          <span>"{target.word}"</span>
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '1.25rem',
        maxWidth: '720px',
        margin: '0 auto',
      }}>
        {options.map((item) => {
          const isSelectedTarget = feedback === 'correct' && item.id === target.id;
          const isShaking = shakingId === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handlePick(item)}
              style={{
                background: isSelectedTarget ? '#dcfce7' : '#ffffff',
                border: isSelectedTarget
                  ? '4px solid #22c55e'
                  : isShaking
                  ? '4px solid #ef4444'
                  : '3px solid #e2e8f0',
                borderRadius: '28px',
                padding: '1.75rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                boxShadow: isSelectedTarget
                  ? '0 15px 30px rgba(34, 197, 94, 0.35)'
                  : '0 8px 16px rgba(0, 0, 0, 0.06)',
                transform: isSelectedTarget
                  ? 'scale(1.1) translateY(-6px)'
                  : isShaking
                  ? 'rotate(-5deg) scale(0.95)'
                  : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (feedback !== 'correct') {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.05)';
                  e.currentTarget.style.borderColor = '#06b6d4';
                }
              }}
              onMouseLeave={(e) => {
                if (feedback !== 'correct' && !isShaking) {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }
              }}
            >
              <span style={{
                fontSize: '4.8rem',
                lineHeight: 1,
                filter: 'drop-shadow(0 6px 6px rgba(0,0,0,0.08))',
              }}>
                {item.emoji}
              </span>
              <span style={{
                fontSize: '1.15rem',
                fontWeight: 800,
                color: isSelectedTarget ? '#15803d' : '#334155',
                background: isSelectedTarget ? '#bbf7d0' : '#f1f5f9',
                padding: '0.3rem 0.9rem',
                borderRadius: '999px',
              }}>
                {item.word}
              </span>
            </button>
          );
        })}
      </div>

      {feedback === 'correct' && (
        <div style={{
          marginTop: '1.5rem',
          fontSize: '1.6rem',
          fontWeight: 900,
          color: '#15803d',
          animation: 'bounce 0.6s infinite alternate',
        }}>
          ¡Woof woof! ¡Es {target.word}! 🐶⭐
        </div>
      )}
    </div>
  );
}
