import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, Star, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { KIDS_ITEMS } from '../../data/kidsVocabulary';
import { kidAudio } from '../../utils/kidAudio';
import TobyBubble from './TobyBubble';

export default function VisualMemoryGame({ onEarnStar, kidSpeak, speak, items }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // indices of currently flipped cards
  const [matched, setMatched] = useState([]); // matched item ids
  const [isWon, setIsWon] = useState(false);
  const [tobyMessage, setTobyMessage] = useState('');
  const [tobyMood, setTobyMood] = useState('happy');
  const timerRef = useRef(null);

  const pool = items && items.length >= 2 ? items : KIDS_ITEMS;

  const initGame = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Select up to 4 distinct items
    const selected = [...pool]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(4, pool.length));

    // Create pairs (8 cards total)
    const deck = [];
    selected.forEach((item) => {
      deck.push({ ...item, cardKey: `${item.id}-1` });
      deck.push({ ...item, cardKey: `${item.id}-2` });
    });

    // Shuffle deck
    setCards(deck.sort(() => 0.5 - Math.random()));
    setFlipped([]);
    setMatched([]);
    setIsWon(false);

    const introMsg = kidSpeak?.phrases?.memoryIntro
      ? kidSpeak.phrases.memoryIntro()
      : `¡Vamos a jugar a las Parejas Mágicas! Toca una carta para descubrir el dibujo.`;

    setTobyMessage(introMsg);
    setTobyMood('happy');

    timerRef.current = setTimeout(() => {
      kidSpeak?.speakToby
        ? kidSpeak.speakToby(introMsg)
        : speak?.('Find the matching pairs!', 0.9);
    }, 350);
  }, [kidSpeak, speak, items]);

  useEffect(() => {
    initGame();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [initGame]);

  const handleCardClick = (idx) => {
    // Ignore if already matched, already flipped, or 2 cards are currently being shown
    if (flipped.includes(idx) || matched.includes(cards[idx].id) || flipped.length >= 2) {
      return;
    }

    const clickedCard = cards[idx];
    kidAudio.playFlip();

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 1) {
      const flipMsg = kidSpeak?.phrases?.memoryFlip
        ? kidSpeak.phrases.memoryFlip(clickedCard.word)
        : `¡Mira, es [[ENGLISH: ${clickedCard.word}]]! ¿Dónde está el otro [[ENGLISH: ${clickedCard.word}]]?`;

      setTobyMessage(flipMsg);
      setTobyMood('curious');
      kidSpeak?.speakToby ? kidSpeak.speakToby(flipMsg) : speak?.(clickedCard.word, 0.9);
    } else if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard.id === secondCard.id) {
        // MATCH!
        const nextMatched = [...matched, firstCard.id];
        setMatched(nextMatched);
        setFlipped([]);
        kidAudio.playSuccess();

        if (nextMatched.length === 4) {
          // Completed!
          setIsWon(true);
          kidAudio.playVictory();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });

          const winMsg = kidSpeak?.phrases?.memoryWin
            ? kidSpeak.phrases.memoryWin()
            : `¡Increíble! ¡Encontraste todas las parejas mágicas! ¡Eres un campeón!`;

          setTobyMessage(winMsg);
          setTobyMood('celebrate');
          kidSpeak?.speakToby ? kidSpeak.speakToby(winMsg) : speak?.('You won! Excellent!', 0.9);

          if (onEarnStar) onEarnStar(25);
        } else {
          const matchMsg = kidSpeak?.phrases?.memoryMatch
            ? kidSpeak.phrases.memoryMatch(firstCard.word)
            : `¡Woof woof! ¡Hiciste match con [[ENGLISH: ${firstCard.word}]]! ¡Súper bien!`;

          setTobyMessage(matchMsg);
          setTobyMood('celebrate');
          kidSpeak?.speakToby ? kidSpeak.speakToby(matchMsg) : speak?.(`Match! ${firstCard.word}!`, 0.9);
        }
      } else {
        // No match -> flip back after 1.1s
        const missMsg = kidSpeak?.phrases?.memoryMiss
          ? kidSpeak.phrases.memoryMiss(secondCard.word)
          : `Eran diferentes. ¡No te preocupes, sigue buscando!`;

        setTobyMessage(missMsg);
        setTobyMood('thinking');
        kidSpeak?.speakToby ? kidSpeak.speakToby(missMsg) : speak?.(secondCard.word, 0.9);

        setTimeout(() => {
          setFlipped([]);
        }, 1200);
      }
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(180deg, #fdf2f8 0%, #ffffff 100%)',
      border: '4px solid #ec4899',
      borderRadius: '32px',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      boxShadow: '0 20px 30px -10px rgba(236, 72, 153, 0.2)',
    }}>
      {/* Toby Coach */}
      <TobyBubble
        message={tobyMessage}
        mood={tobyMood}
        onRepeat={(style) => {
          kidSpeak?.speakToby
            ? kidSpeak.speakToby(tobyMessage, { style })
            : speak?.('Find the pairs!', 0.9);
        }}
      />

      {/* Top Bar */}
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
          <span>Parejas: {matched.length} / 4</span>
        </div>

        <button
          onClick={initGame}
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
          <RefreshCw size={16} /> Reiniciar juego
        </button>
      </div>

      <p style={{
        fontSize: '1.35rem',
        fontWeight: 900,
        color: '#be185d',
        margin: '0 0 1.5rem',
      }}>
        ¡Encuentra las parejas de dibujos iguales! 🃏✨
      </p>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        maxWidth: '560px',
        margin: '0 auto',
      }}>
        {cards.map((card, idx) => {
          const isFlipped = flipped.includes(idx) || matched.includes(card.id);
          const isCardMatched = matched.includes(card.id);

          return (
            <button
              key={card.cardKey}
              onClick={() => handleCardClick(idx)}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: '22px',
                border: isCardMatched
                  ? '4px solid #22c55e'
                  : isFlipped
                  ? '4px solid #ec4899'
                  : '3px solid #cbd5e1',
                background: isCardMatched
                  ? '#dcfce7'
                  : isFlipped
                  ? '#ffffff'
                  : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                color: isFlipped ? '#334155' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isCardMatched ? 'default' : 'pointer',
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isFlipped ? 'rotateY(0deg) scale(1)' : 'scale(0.98)',
                boxShadow: isFlipped
                  ? '0 10px 20px rgba(0,0,0,0.08)'
                  : '0 6px 12px rgba(236, 72, 153, 0.3)',
              }}
            >
              {isFlipped ? (
                <span style={{ fontSize: '3.5rem', lineHeight: 1 }}>{card.emoji}</span>
              ) : (
                <span style={{ fontSize: '2.4rem' }}>⭐</span>
              )}
            </button>
          );
        })}
      </div>

      {isWon && (
        <div style={{
          marginTop: '2rem',
          background: '#dcfce7',
          border: '3px solid #22c55e',
          borderRadius: '24px',
          padding: '1.5rem',
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🏆🎉</div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d', margin: '0 0 0.5rem' }}>
            ¡Ganaste! ¡Qué buena memoria!
          </h3>
          <p style={{ color: '#166534', fontWeight: 700, margin: '0 0 1rem' }}>
            ¡Descubriste todos los dibujos en inglés!
          </p>
          <button
            onClick={initGame}
            style={{
              padding: '0.8rem 1.8rem',
              borderRadius: '999px',
              border: 'none',
              background: '#15803d',
              color: '#ffffff',
              fontSize: '1.1rem',
              fontWeight: 900,
              cursor: 'pointer',
            }}
          >
            Jugar otra vez 🚀
          </button>
        </div>
      )}
    </div>
  );
}
