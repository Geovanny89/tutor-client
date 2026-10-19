import React from 'react';
import VocabCard from './VocabCard';
import { BookX } from 'lucide-react';

export default function VocabCardGrid({ words, category, onSelect }) {
  if (words.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 1rem',
        background: 'var(--bg-surface)',
        borderRadius: '20px',
        border: '1px solid var(--border)',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <BookX size={44} color="var(--border-strong)" style={{ marginBottom: '0.75rem' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
          No se encontraron palabras con ese filtro.
        </p>
        <p style={{ color: 'var(--border-strong)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Prueba otro nivel CEFR o borra el texto de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', fontWeight: 600, marginBottom: '0.85rem' }}>
        {words.length} {words.length === 1 ? 'entrada' : 'entradas'} encontradas
      </p>
      <div
        className="vocab-card-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '0.85rem',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {words.map((word, i) => (
          <VocabCard key={`${category}-${word.word}-${i}`} word={word} onSelect={onSelect} />
        ))}
      </div>

      <style>{`
        @media (max-width: 560px) {
          .vocab-card-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
