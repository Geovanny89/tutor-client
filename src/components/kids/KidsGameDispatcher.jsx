import React from 'react';
// Los 4 Juegos Originales / Globales
import ListenAndFindGame from './ListenAndFindGame';
import BubblePopGame from './BubblePopGame';
import VisualMemoryGame from './VisualMemoryGame';
import SoundboardExplorer from './SoundboardExplorer';

// Los 15 Juegos Educativos para lecciones creadas por profesores con IA
import MemoryMatchGame from './games/MemoryMatchGame';
import DragDropGame from './games/DragDropGame';
import OddOneOutGame from './games/OddOneOutGame';
import WordBingoGame from './games/WordBingoGame';
import SimonSaysGame from './games/SimonSaysGame';
import BalloonPopGame from './games/BalloonPopGame';
import SoundBoxGame from './games/SoundBoxGame';
import SpellingBeeGame from './games/SpellingBeeGame';
import LetterRainGame from './games/LetterRainGame';
import WordSearchGame from './games/WordSearchGame';
import SentenceTrainGame from './games/SentenceTrainGame';
import OppositesMatchGame from './games/OppositesMatchGame';
import CatchAnswerGame from './games/CatchAnswerGame';
import FlashcardQuizGame from './games/FlashcardQuizGame';
import WordMazeGame from './games/WordMazeGame';

export default function KidsGameDispatcher({ gameId, items, kidSpeak, onEarnStar, lesson }) {
  switch (gameId) {
    // ─── 4 JUEGOS GLOBALES (Por defecto para institutos y lecciones estándar) ─
    case 'listen':
      return <ListenAndFindGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'bubble':
      return <BubblePopGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} speak={kidSpeak?.speakEnglish} items={items} />;

    case 'memory':
      return <VisualMemoryGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} speak={kidSpeak?.speakEnglish} items={items} />;

    case 'explorer':
      return <SoundboardExplorer onEarnStar={onEarnStar} kidSpeak={kidSpeak} speak={kidSpeak?.speakEnglish} items={items} />;

    // ─── 15 JUEGOS DISPONIBLES PARA EL PROMPT / IA DEL PROFESOR ───────────────
    case 'memory_match':
      return <MemoryMatchGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'drag_drop':
      return <DragDropGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'odd_one_out':
      return <OddOneOutGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'word_bingo':
      return <WordBingoGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'simon_says':
      return <SimonSaysGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'balloon_pop':
      return <BalloonPopGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'sound_box':
      return <SoundBoxGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'spelling_bee':
      return <SpellingBeeGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'letter_rain':
      return <LetterRainGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'word_search':
      return <WordSearchGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'sentence_train':
      return <SentenceTrainGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'opposites_match':
      return <OppositesMatchGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'catch_answer':
      return <CatchAnswerGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'flashcard_quiz':
      return <FlashcardQuizGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    case 'word_maze':
      return <WordMazeGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;

    default:
      return <ListenAndFindGame onEarnStar={onEarnStar} kidSpeak={kidSpeak} items={items} />;
  }
}
