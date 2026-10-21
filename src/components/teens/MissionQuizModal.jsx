import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Zap, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TEEN_QUIZ_QUESTIONS } from '../../data/teensMissions';
import { kidAudio } from '../../utils/kidAudio';

export default function MissionQuizModal({ onClose, onComplete }) {
  const [questions] = useState(() => {
    return [...TEEN_QUIZ_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 3);
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correct;
    if (isCorrect) {
      kidAudio.playSuccess();
      setCorrectCount((c) => c + 1);
    } else {
      kidAudio.playTryAgain();
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setFinished(true);
      kidAudio.playVictory();
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      if (onComplete) onComplete(60);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      background: 'rgba(2, 6, 23, 0.8)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '3px solid var(--primary)',
        borderRadius: '28px',
        padding: '2rem',
        maxWidth: '540px',
        width: '100%',
        position: 'relative',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--bg-base)',
            border: 'none',
            borderRadius: '50%',
            padding: '0.5rem',
            cursor: 'pointer',
            color: 'var(--text-subtle)',
            display: 'flex',
          }}
        >
          <X size={20} />
        </button>

        {!finished ? (
          <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⚡</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-display)' }}>
                  Reto Relámpago Diario
                </h3>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', fontWeight: 700 }}>
                  Pregunta {currentIndex + 1} de {questions.length} · Recompensa: +60 XP
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ height: '8px', background: 'var(--bg-muted)', borderRadius: '999px', overflow: 'hidden', marginBottom: '1.5rem' }}>
              <div style={{
                height: '100%',
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
                background: 'linear-gradient(90deg, #f59e0b 0%, #10b981 100%)',
                transition: 'width 0.3s ease',
              }} />
            </div>

            {/* Question Text */}
            <div style={{
              background: 'var(--bg-base)',
              border: '1px solid var(--border)',
              borderRadius: '18px',
              padding: '1.25rem',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
              lineHeight: 1.4,
            }}>
              {currentQ.question}
            </div>

            {/* Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {currentQ.options.map((opt, idx) => {
                let border = '2px solid var(--border)';
                let bg = 'var(--bg-surface)';
                let color = 'var(--text-primary)';

                if (isAnswered) {
                  if (idx === currentQ.correct) {
                    border = '2px solid var(--success)';
                    bg = 'var(--success-bg)';
                    color = 'var(--success)';
                  } else if (idx === selectedOption) {
                    border = '2px solid var(--error)';
                    bg = 'var(--error-bg)';
                    color = 'var(--error)';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.9rem 1.15rem',
                      borderRadius: '16px',
                      border,
                      background: bg,
                      color,
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: isAnswered ? 'default' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correct && <CheckCircle size={18} color="var(--success)" />}
                    {isAnswered && idx === selectedOption && idx !== currentQ.correct && <AlertCircle size={18} color="var(--error)" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation and Next button */}
            {isAnswered && (
              <div>
                <p style={{
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: selectedOption === currentQ.correct ? 'var(--success)' : 'var(--text-secondary)',
                  marginBottom: '1rem',
                }}>
                  💡 {currentQ.explanation}
                </p>
                <button
                  onClick={handleNext}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                  }}
                >
                  {currentIndex + 1 < questions.length ? 'Siguiente pregunta ➔' : 'Ver resultado 🏆'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div style={{ fontSize: '4.5rem', marginBottom: '0.5rem' }}>🏆⚡</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-primary)', margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>
              ¡Misión Completada!
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 700, margin: '0 0 1.25rem' }}>
              Acertaste {correctCount} de {questions.length} preguntas.
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fef3c7',
              color: '#d97706',
              border: '2px solid #f59e0b',
              padding: '0.6rem 1.5rem',
              borderRadius: '999px',
              fontSize: '1.25rem',
              fontWeight: 900,
              marginBottom: '1.75rem',
            }}>
              <Zap fill="#f59e0b" color="#f59e0b" size={24} />
              <span>+60 XP Ganados</span>
            </div>

            <div>
              <button
                onClick={onClose}
                style={{
                  padding: '0.85rem 2rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: 'var(--primary)',
                  color: '#ffffff',
                  fontSize: '1rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                }}
              >
                Reclamar y Volver a Misiones 🚀
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
