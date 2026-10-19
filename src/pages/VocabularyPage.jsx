import React, { useState, useMemo } from 'react';
import VocabHeader from '../components/vocabulary/VocabHeader';
import VocabCategoryTabs from '../components/vocabulary/VocabCategoryTabs';
import VocabSearchBar from '../components/vocabulary/VocabSearchBar';
import VocabCardGrid from '../components/vocabulary/VocabCardGrid';
import VocabDetailModal from '../components/vocabulary/VocabDetailModal';
import { VOCABULARY_DATA } from '../data/vocabularyData';

const CATEGORIES = [
  { id: 'verbs',      label: 'Verbos',       emoji: '⚡' },
  { id: 'adjectives', label: 'Adjetivos',    emoji: '🎨' },
  { id: 'nouns',      label: 'Sustantivos',  emoji: '📦' },
  { id: 'phrases',    label: 'Frases Útiles', emoji: '💬' },
  { id: 'adverbs',    label: 'Adverbios',    emoji: '🔆' },
  { id: 'alphabet',   label: 'Abecedario',   emoji: '🔤' },
  { id: 'numbers',    label: 'Números',      emoji: '🔢' },
];

const CEFR_LEVELS = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function VocabularyPage() {
  const [activeCategory, setActiveCategory] = useState('verbs');
  const [activeCEFR, setActiveCEFR] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState(null);

  const words = useMemo(() => {
    let list = VOCABULARY_DATA[activeCategory] || [];
    if (activeCEFR !== 'all') {
      list = list.filter((w) => w.level === activeCEFR);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.translation.toLowerCase().includes(q) ||
          (w.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [activeCategory, activeCEFR, search]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', width: '100%', overflowX: 'hidden' }}>
      <VocabHeader />

      <div className="vocab-page-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem 3rem', width: '100%', boxSizing: 'border-box' }}>
        <VocabCategoryTabs
          categories={CATEGORIES}
          active={activeCategory}
          onChange={(c) => {
            setActiveCategory(c);
            setSearch('');
            setActiveCEFR('all');
          }}
        />

        <VocabSearchBar
          search={search}
          onSearch={setSearch}
          cefrLevels={CEFR_LEVELS}
          activeCEFR={activeCEFR}
          onCEFR={setActiveCEFR}
        />

        <VocabCardGrid
          words={words}
          category={activeCategory}
          onSelect={setSelectedWord}
        />
      </div>

      {selectedWord && (
        <VocabDetailModal word={selectedWord} onClose={() => setSelectedWord(null)} />
      )}
    </div>
  );
}
