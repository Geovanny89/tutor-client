import React, { useState, useEffect, useMemo } from 'react';
import { Check, RotateCcw } from 'lucide-react';
import { KIDS_ITEMS } from '../../../data/kidsVocabulary';

export default function WordSearchGame({ onEarnStar, kidSpeak, items }) {
  const pool = useMemo(() => {
    const list = items && items.length > 0 ? items : KIDS_ITEMS;
    return [...list].sort(() => 0.5 - Math.random()).slice(0, 2);
  }, [items]);

  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  const initGrid = () => {
    const size = 5;
    const newGrid = Array(size).fill(null).map(() => Array(size).fill(''));
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    // Colocar las 2 palabras horizontalmente en filas distintas
    const wordList = pool.map((p) => p.word.toUpperCase().slice(0, 5));

    wordList.forEach((w, wordIdx) => {
      const row = wordIdx * 2 + 1; // Fila 1 y Fila 3
      const maxCol = size - w.length;
      const startCol = Math.max(0, Math.floor(Math.random() * (maxCol + 1)));

      for (let i = 0; i < w.length; i++) {
        if (row < size && startCol + i < size) {
          newGrid[row][startCol + i] = w[i];
        }
      }
    });

    // Rellenar vacíos con letras aleatorias
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (!newGrid[r][c]) {
          newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    setGrid(newGrid);
    setSelectedCells([]);
    setFoundWords([]);
    setTimeout(() => {
      kidSpeak?.speakToby?.('¡Sopa de letras! Encuentra las palabras escondidas en la cuadrícula.');
    }, 200);
  };

  useEffect(() => {
    initGrid();
  }, [pool]);

  const handleCellClick = (r, c) => {
    const cellKey = `${r}_${c}`;
    let newSelection = [];

    if (selectedCells.includes(cellKey)) {
      newSelection = selectedCells.filter((k) => k !== cellKey);
    } else {
      newSelection = [...selectedCells, cellKey];
    }
    setSelectedCells(newSelection);

    // Formar la palabra con las celdas seleccionadas
    const spelled = newSelection.map((k) => {
      const [row, col] = k.split('_').map(Number);
      return grid[row][col];
    }).join('');

    // Verificar si coincide con alguna palabra del pool
    pool.forEach((p) => {
      const targetWord = p.word.toUpperCase().slice(0, 5);
      if (spelled === targetWord && !foundWords.includes(p.id)) {
        setFoundWords((prev) => [...prev, p.id]);
        setSelectedCells([]);
        kidSpeak?.speakToby?.(`¡Encontraste la palabra [[ENGLISH: ${p.word}]]! 🔍`);
        onEarnStar?.(20);
      }
    });
  };

  const isComplete = pool.length > 0 && foundWords.length === pool.length;

  return (
    <div style={{ textAlign: 'center', padding: '1rem' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            🔍 Sopa de Letras (Word Search)
          </h3>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Toca las letras en la cuadrícula para descubrir las palabras
          </p>
        </div>
        <button
          onClick={initGrid}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.5rem 0.9rem',
            background: 'var(--bg-surface)',
            border: '2px solid var(--border)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={15} /> Nueva sopa
        </button>
      </div>

      {/* Palabras a buscar */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
        {pool.map((p) => {
          const found = foundWords.includes(p.id);
          return (
            <div
              key={p.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: found ? '#ecfdf5' : 'var(--bg-surface)',
                border: found ? '2px solid #10b981' : '2px solid var(--border)',
                borderRadius: '16px',
                padding: '0.5rem 1rem',
                color: found ? '#065f46' : 'var(--text-primary)',
                fontWeight: 900,
                fontSize: '1rem',
              }}
            >
              <span style={{ fontSize: '1.6rem' }}>{p.emoji}</span>
              <span style={{ textDecoration: found ? 'line-through' : 'none' }}>{p.word}</span>
              {found && <Check size={16} color="#10b981" />}
            </div>
          );
        })}
      </div>

      {/* Cuadrícula 5x5 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.5rem',
          maxWidth: '340px',
          margin: '0 auto',
          background: '#d1fae5',
          padding: '0.85rem',
          borderRadius: '24px',
          border: '3px solid #10b981',
        }}
      >
        {grid.map((row, r) =>
          row.map((letter, c) => {
            const isSelected = selectedCells.includes(`${r}_${c}`);
            return (
              <button
                key={`${r}_${c}`}
                onClick={() => handleCellClick(r, c)}
                style={{
                  aspectRatio: '1',
                  borderRadius: '14px',
                  border: isSelected ? '3px solid #059669' : '2px solid #a7f3d0',
                  background: isSelected ? '#10b981' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#065f46',
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 0.15s',
                }}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>

      {isComplete && (
        <div style={{ marginTop: '1.25rem', background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '18px', padding: '1rem' }}>
          <span style={{ fontSize: '2.5rem' }}>🎉 🔍 🐶 ⭐</span>
          <h4 style={{ margin: '0.3rem 0', color: '#065f46', fontSize: '1.2rem', fontWeight: 900 }}>
            ¡Bieeeen! ¡Encontraste todas las palabras!
          </h4>
        </div>
      )}
    </div>
  );
}
