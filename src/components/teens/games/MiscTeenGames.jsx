import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTeensGame } from '../../../context/TeensGameContext';
import { playEnglishPhrase } from '../../../utils/teenSpeech';

// ─── Crucigrama Pro ───────────────────────────────────────────────────────────
export function CrosswordProGame({ items = [], onWin, onLose }) {
  const { earnXp, earnCoins } = useTeensGame();
  const clues = items.slice(0, 5).map((item) => ({
    word: (item.word || item.english || item).toUpperCase(),
    hint: item.spanish || item.translation || '???',
  }));

  const [answers, setAnswers] = useState(clues.map(() => ''));
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    const correct = clues.filter((c, i) => answers[i].trim().toUpperCase() === c.word).length;
    const won = correct >= Math.ceil(clues.length / 2);
    setTimeout(() => {
      if (won) { earnXp(140); earnCoins(45); onWin?.(); }
      else onLose?.();
    }, 1200);
  };

  return (
    <div style={darkCard}>
      <GameTitle emoji="🧩" title="Crucigrama Pro" subtitle="Escribe la palabra en inglés según la pista en español." />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {clues.map((clue, i) => {
          const correct = submitted && answers[i].trim().toUpperCase() === clue.word;
          const wrong = submitted && answers[i].trim().toUpperCase() !== clue.word;
          return (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span style={{
                minWidth: '26px', height: '26px', background: '#7c3aed',
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 900, fontSize: '0.85rem', flexShrink: 0,
              }}>{i + 1}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', minWidth: '80px' }}>
                {clue.hint}
              </span>
              <input
                value={answers[i]}
                onChange={(e) => {
                  const next = [...answers]; next[i] = e.target.value; setAnswers(next);
                }}
                disabled={submitted}
                placeholder={`${clue.word.length} letras`}
                style={{
                  flex: 1, padding: '0.55rem 0.8rem', borderRadius: '10px',
                  background: submitted ? (correct ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)') : 'rgba(255,255,255,0.07)',
                  border: `1.5px solid ${submitted ? (correct ? '#10b981' : '#ef4444') : 'rgba(255,255,255,0.2)'}`,
                  color: '#fff', fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', outline: 'none',
                }}
              />
              <SpeakBtn text={clue.word} size={13} title="Escuchar palabra en inglés" />
              {submitted && (
                <span style={{ fontSize: '1.1rem' }}>{correct ? '✅' : '❌'}</span>
              )}
            </div>
          );
        })}
      </div>
      {!submitted && (
        <ActionBtn onClick={handleSubmit} style={{ marginTop: '1.25rem' }}>Verificar Respuestas</ActionBtn>
      )}
      {submitted && (
        <p style={{ textAlign: 'center', color: '#f59e0b', fontWeight: 700, marginTop: '1rem' }}>
          {clues.filter((c, i) => answers[i].trim().toUpperCase() === clue.word).length}/{clues.length} correctas
        </p>
      )}
    </div>
  );
}

// ─── RPG Adventure (Elige tu Aventura) ───────────────────────────────────────
const STORY = {
  start: {
    text: "You are a young traveler who arrives at a mysterious castle. The door is locked. What do you do?",
    options: [
      { label: "Knock on the door politely.", next: 'knock', correct: true },
      { label: "Break the window.", next: 'break', correct: false },
    ],
  },
  knock: {
    text: "A butler opens the door. 'Good evening,' he says. 'Are you here for the English challenge?' How do you respond?",
    options: [
      { label: "Yes, I would like to participate, please.", next: 'yes', correct: true },
      { label: "Yes. Give me the challenge.", next: 'rude', correct: false },
    ],
  },
  yes: {
    text: "The butler smiles. 'Excellent manners! You have passed the first test. Which tense describes a completed action in the past?'",
    options: [
      { label: "Past Simple.", next: 'correct_end', correct: true },
      { label: "Present Perfect.", next: 'wrong_end', correct: false },
    ],
  },
  correct_end: { text: "🎉 The castle doors open wide. You completed the adventure!", end: true, win: true },
  wrong_end: { text: "😞 The butler shakes his head. You were sent back outside.", end: true, win: false },
  break: { text: "💥 You are immediately expelled from the castle grounds. Adventure over.", end: true, win: false },
  rude: { text: "😤 The butler closes the door. Politeness matters in English!", end: true, win: false },
};

export function RpgAdventureGame({ onWin, onLose }) {
  const { earnXp, earnCoins, addItem } = useTeensGame();
  const [nodeKey, setNodeKey] = useState('start');
  const node = STORY[nodeKey];

  const handleOption = (opt) => {
    if (opt.next === 'correct_end') { earnXp(200); earnCoins(80); addItem({ id: 'adventure_scroll', name: 'Adventure Scroll', emoji: '📜', rarity: 'epic' }); onWin?.(); }
    if (opt.next === 'wrong_end' || opt.next === 'break' || opt.next === 'rude') onLose?.();
    setNodeKey(opt.next);
  };

  return (
    <div style={darkCard}>
      <GameTitle emoji="📖" title="Elige tu Aventura" subtitle="Tus decisiones determinan el final. ¡Usa buen inglés!" />
      <AnimatePresence mode="wait">
        <motion.div
          key={nodeKey}
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        >
          <div style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px', padding: '1.25rem', marginBottom: '1.25rem',
            display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
          }}>
            <p style={{ color: '#fff', fontSize: '1rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic', flex: 1 }}>
              {node.text}
            </p>
            <SpeakBtn text={node.text} size={16} title="Escuchar narración" />
          </div>
          {!node.end && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {node.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <motion.button whileTap={{ scale: 0.98 }} onClick={() => handleOption(opt)}
                    style={{
                      flex: 1,
                      background: 'rgba(124,58,237,0.15)', border: '1.5px solid rgba(124,58,237,0.4)',
                      borderRadius: '12px', padding: '0.9rem 1rem', color: '#fff',
                      fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    {String.fromCharCode(65 + i)}. {opt.label}
                  </motion.button>
                  <SpeakBtn text={opt.label} size={14} title="Escuchar opción" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── Cyber Mission (Terminal Hack) ────────────────────────────────────────────
const CYBER_CHALLENGES = [
  { cmd: 'DECODE:', cipher: 'Aol Whzzdvyk pz: Myvz!', answer: 'frog', hint: 'Rot13-like substitution. Each letter shifted +7.' },
  { cmd: 'TRANSLATE:', cipher: 'What "curious" means in Spanish:', answer: 'curioso', hint: 'Cognate word!' },
  { cmd: 'FIX THE CODE:', cipher: '"She go to school every day."', answer: 'goes', hint: 'Third person singular present.' },
  { cmd: 'FIND THE WORD:', cipher: 'A word meaning "very happy": j _ y f u l', answer: 'joyful', hint: 'Starts with J, ends in -ful.' },
];

export function CyberMissionGame({ onWin, onLose }) {
  const { earnXp, earnCoins, addItem } = useTeensGame();
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const challenge = CYBER_CHALLENGES[idx];

  const handleSubmit = () => {
    const correct = input.trim().toLowerCase() === challenge.answer.toLowerCase();
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      const newScore = score + 1;
      setScore(newScore);
      setTimeout(() => {
        if (idx + 1 >= CYBER_CHALLENGES.length) {
          earnXp(220); earnCoins(90);
          addItem({ id: 'hacker_chip', name: 'Cyber Chip', emoji: '🖥️', rarity: 'epic' });
          onWin?.();
        } else {
          setIdx((i) => i + 1); setInput(''); setFeedback(null);
        }
      }, 800);
    } else {
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  return (
    <div style={{ ...darkCard, fontFamily: 'monospace' }}>
      <GameTitle emoji="💻" title="Cyber Mission: Terminal Hack" subtitle="Descifra los comandos y hackea el sistema." />
      <div style={{
        background: '#000d00', border: '1px solid #00ff0044', borderRadius: '12px',
        padding: '1.25rem', marginBottom: '1.25rem', minHeight: '140px',
      }}>
        <p style={{ color: '#00ff00', fontSize: '0.85rem', margin: '0 0 0.25rem' }}>root@kdice-terminal:~$</p>
        <p style={{ color: '#00cc00', fontSize: '0.82rem', margin: '0 0 0.75rem' }}>
          [{idx + 1}/{CYBER_CHALLENGES.length}] {challenge.cmd}
        </p>
        <p style={{ color: '#88ffaa', fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
          {challenge.cipher}
        </p>
        <p style={{ color: '#335533', fontSize: '0.78rem', margin: 0 }}>// HINT: {challenge.hint}</p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Escribe tu respuesta..."
          style={{
            flex: 1, padding: '0.7rem', borderRadius: '10px',
            background: '#000d00', border: `1.5px solid ${feedback === 'correct' ? '#00ff00' : feedback === 'wrong' ? '#ff4444' : '#00ff0033'}`,
            color: '#00ff00', fontSize: '0.95rem', outline: 'none', fontFamily: 'monospace',
          }}
        />
        <ActionBtn onClick={handleSubmit}>ENTER</ActionBtn>
      </div>
      {feedback && (
        <p style={{ color: feedback === 'correct' ? '#00ff00' : '#ff4444', fontWeight: 700, marginTop: '0.75rem', fontSize: '0.88rem' }}>
          {feedback === 'correct' ? '> ACCESS GRANTED ✓' : '> ACCESS DENIED. Try again.'}
        </p>
      )}
    </div>
  );
}

// ─── Tower Defense (Grammar Wars) ─────────────────────────────────────────────
export function TowerDefenseGame({ items = [], onWin, onLose }) {
  const { earnXp, earnCoins, addItem } = useTeensGame();
  const sentences = [
    { wrong: "She don't like apples.", correct: "She doesn't like apples.", explanation: "3rd person: doesn't + base verb" },
    { wrong: "He have a car.", correct: "He has a car.", explanation: "3rd person singular: has" },
    { wrong: "They was playing.", correct: "They were playing.", explanation: "Plural subject: were" },
    { wrong: "I am go to school.", correct: "I am going to school.", explanation: "Present continuous: am + verb-ing" },
    { wrong: "She eated the food.", correct: "She ate the food.", explanation: "eat → ate (irregular)" },
  ];
  const [idx, setIdx] = useState(0);
  const [hp, setHp] = useState(100);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);

  const s = sentences[idx];

  const handleFix = (choice) => {
    if (selected) return;
    setSelected(choice);
    const correct = choice === 'correct';
    if (correct) {
      setScore((sc) => sc + 1);
    } else {
      setHp((h) => Math.max(0, h - 20));
    }
    setTimeout(() => {
      if (hp - (correct ? 0 : 20) <= 0) { onLose?.(); return; }
      const next = idx + 1;
      if (next >= sentences.length) {
        earnXp(250); earnCoins(100);
        addItem({ id: 'castle_shield', name: 'Castle Shield', emoji: '🛡️', rarity: 'legendary' });
        onWin?.();
      } else {
        setIdx(next); setSelected(null);
      }
    }, 900);
  };

  return (
    <div style={darkCard}>
      <GameTitle emoji="🏰" title="Tower Defense: Grammar Wars" subtitle="Corrige los errores gramaticales para defender la torre." />
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '0.85rem' }}>🏰 Torre:</span>
        <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
          <motion.div animate={{ width: `${hp}%` }} style={{ height: '100%', background: hp > 50 ? '#10b981' : '#ef4444', borderRadius: '999px' }} />
        </div>
        <span style={{ color: '#fff', fontWeight: 800 }}>{hp}%</span>
      </div>
      <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '14px', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ color: '#fca5a5', fontWeight: 700, fontSize: '0.82rem', margin: '0 0 0.4rem' }}>⚠️ Oración incorrecta detectada:</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <p style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 800, margin: 0, flex: 1 }}>"{s.wrong}"</p>
          <SpeakBtn text={s.wrong} size={14} title="Escuchar oración errónea" />
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.75rem' }}>¿Cuál es la corrección?</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {[{ key: 'correct', label: s.correct }, { key: 'wrong', label: 'No hay error, está bien.' }].map((opt) => {
          const isSel = selected === opt.key;
          const isRight = opt.key === 'correct';
          let bg = 'rgba(255,255,255,0.06)'; let border = '1px solid rgba(255,255,255,0.15)';
          if (selected) {
            if (isRight) { bg = 'rgba(16,185,129,0.2)'; border = '2px solid #10b981'; }
            else if (isSel) { bg = 'rgba(239,68,68,0.2)'; border = '2px solid #ef4444'; }
          }
          return (
            <div key={opt.key} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => handleFix(opt.key)}
                style={{ flex: 1, background: bg, border, borderRadius: '12px', padding: '0.85rem', color: '#fff', fontWeight: 700, fontSize: '0.92rem', cursor: selected ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                {opt.label}
              </motion.button>
              {opt.key === 'correct' && (
                <SpeakBtn text={s.correct} size={14} title="Escuchar corrección" />
              )}
            </div>
          );
        })}
      </div>
      {selected && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginTop: '0.75rem' }}>📚 {s.explanation}</p>}
    </div>
  );
}

// ─── Debate Arena (simplificado como quiz de argumentación) ──────────────────
const DEBATE_TOPICS = [
  {
    topic: "Social media is harmful for teenagers.",
    side: "AGREE",
    question: "Which argument best supports this position?",
    options: [
      { text: "Social media causes anxiety and affects sleep patterns negatively.", correct: true },
      { text: "Teenagers love using social media.", correct: false },
      { text: "Everyone uses social media nowadays.", correct: false },
      { text: "Some teenagers don't use social media.", correct: false },
    ],
  },
  {
    topic: "School uniforms should be mandatory.",
    side: "DISAGREE",
    question: "Which argument best opposes this?",
    options: [
      { text: "Uniforms reduce students' ability to express their individual identity.", correct: true },
      { text: "Uniforms are comfortable.", correct: false },
      { text: "Some schools use uniforms.", correct: false },
      { text: "Uniforms are expensive.", correct: false },
    ],
  },
];

export function DebateArenaGame({ onWin, onLose }) {
  const { earnXp, earnCoins, addItem } = useTeensGame();
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const debate = DEBATE_TOPICS[qIdx % DEBATE_TOPICS.length];

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt.correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= DEBATE_TOPICS.length) {
        const won = score + (opt.correct ? 1 : 0) >= 1;
        if (won) { earnXp(220); earnCoins(80); addItem({ id: 'mic_gold', name: 'Golden Mic', emoji: '🏆', rarity: 'epic' }); onWin?.(); }
        else onLose?.();
      } else {
        setQIdx((i) => i + 1); setSelected(null);
      }
    }, 1000);
  };

  return (
    <div style={darkCard}>
      <GameTitle emoji="🎤" title="Debate Arena" subtitle="Elige el argumento más convincente en inglés." />
      <div style={{ background: 'rgba(124,58,237,0.15)', border: '1.5px solid rgba(124,58,237,0.35)', borderRadius: '14px', padding: '1rem', marginBottom: '1rem' }}>
        <p style={{ color: '#a78bfa', fontSize: '0.78rem', fontWeight: 800, margin: '0 0 0.3rem' }}>📢 POSICIÓN: {debate.side}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: 0, fontStyle: 'italic', flex: 1 }}>"{debate.topic}"</p>
          <SpeakBtn text={debate.topic} size={14} title="Escuchar tema del debate" />
        </div>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem', marginBottom: '0.75rem' }}>{debate.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {debate.options.map((opt, i) => {
          const isSel = selected?.text === opt.text;
          let bg = 'rgba(255,255,255,0.06)'; let border = '1px solid rgba(255,255,255,0.15)';
          if (selected) {
            if (opt.correct) { bg = 'rgba(16,185,129,0.2)'; border = '2px solid #10b981'; }
            else if (isSel) { bg = 'rgba(239,68,68,0.2)'; border = '2px solid #ef4444'; }
          }
          return (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => handleAnswer(opt)}
                style={{ flex: 1, background: bg, border, borderRadius: '12px', padding: '0.85rem', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: selected ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                {opt.text}
              </motion.button>
              <SpeakBtn text={opt.text} size={14} title="Escuchar argumento" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── News Anchor (lectura en voz alta → comprensión) ─────────────────────────
const NEWS_ITEMS = [
  {
    headline: "Scientists Discover New Species of Deep-Sea Fish",
    body: "Marine researchers announced yesterday that they had found a previously unknown species of bioluminescent fish in the Pacific Ocean at depths exceeding 3,000 meters. The discovery was made using advanced underwater drones.",
    questions: [
      { q: "Where was the fish found?", opts: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], answer: "Pacific Ocean" },
      { q: "What technology was used?", opts: ["Underwater drones", "Submarines", "Satellites", "Scuba diving"], answer: "Underwater drones" },
    ],
  },
];

export function NewsAnchorGame({ onWin, onLose }) {
  const { earnXp, earnCoins } = useTeensGame();
  const news = NEWS_ITEMS[0];
  const [qIdx, setQIdx] = useState(-1); // -1 = reading phase
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  if (qIdx === -1) {
    return (
      <div style={darkCard}>
        <GameTitle emoji="📺" title="News Anchor" subtitle="Lee la noticia y responde las preguntas de comprensión." />
        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <p style={{ color: '#f59e0b', fontWeight: 900, fontSize: '0.85rem', margin: 0 }}>📰 BREAKING NEWS</p>
            <SpeakBtn text={`${news.headline}. ${news.body}`} size={16} title="Escuchar noticia completa" />
          </div>
          <h3 style={{ color: '#fff', fontWeight: 900, fontSize: '1.1rem', margin: '0 0 0.75rem' }}>{news.headline}</h3>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{news.body}</p>
        </div>
        <ActionBtn onClick={() => setQIdx(0)}>📝 Responder Preguntas</ActionBtn>
      </div>
    );
  }

  const q = news.questions[qIdx];

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    if (opt === q.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= news.questions.length) {
        const won = score + (opt === q.answer ? 1 : 0) >= 1;
        if (won) { earnXp(160); earnCoins(55); onWin?.(); } else onLose?.();
      } else {
        setQIdx((i) => i + 1); setSelected(null);
      }
    }, 900);
  };

  return (
    <div style={darkCard}>
      <GameTitle emoji="📺" title="News Anchor" subtitle={`Pregunta ${qIdx + 1}/${news.questions.length}`} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', gap: '0.5rem' }}>
        <p style={{ color: '#fff', fontSize: '1rem', fontWeight: 800, margin: 0, flex: 1 }}>{q.q}</p>
        <SpeakBtn text={q.q} size={15} title="Escuchar pregunta" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
        {q.opts.map((opt) => {
          const isSel = selected === opt;
          let bg = 'rgba(255,255,255,0.07)'; let border = '1px solid rgba(255,255,255,0.15)';
          if (selected) {
            if (opt === q.answer) { bg = 'rgba(16,185,129,0.25)'; border = '2px solid #10b981'; }
            else if (isSel) { bg = 'rgba(239,68,68,0.25)'; border = '2px solid #ef4444'; }
          }
          return (
            <div key={opt} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleAnswer(opt)}
                style={{ flex: 1, background: bg, border, borderRadius: '12px', padding: '0.85rem', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: selected ? 'default' : 'pointer', transition: 'all 0.2s' }}>
                {opt}
              </motion.button>
              <SpeakBtn text={opt} size={13} title="Escuchar opción" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Cipher Challenge ─────────────────────────────────────────────────────────
export function CipherChallengeGame({ items = [], onWin, onLose }) {
  const { earnXp, earnCoins, addItem } = useTeensGame();
  const wordList = items.length >= 3
    ? items.map((i) => i.word || i.english || i).filter(Boolean).slice(0, 4)
    : ['FRIEND', 'SCHOOL', 'MUSIC', 'TRAVEL'];

  // Cifrado César +3
  const encrypt = (w) => w.toUpperCase().split('').map((c) => {
    if (/[A-Z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0) - 65 + 3) % 26) + 65);
    return c;
  }).join('');

  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const word = wordList[idx];
  const cipher = encrypt(word);

  const handleCheck = () => {
    const correct = input.trim().toUpperCase() === word.toUpperCase();
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore((s) => s + 1);
      playEnglishPhrase(word);
    }
    setTimeout(() => {
      if (idx + 1 >= wordList.length) {
        const won = score + (correct ? 1 : 0) >= Math.ceil(wordList.length / 2);
        if (won) { earnXp(170); earnCoins(55); addItem({ id: 'cipher_ring', name: 'Cipher Ring', emoji: '💍', rarity: 'rare' }); onWin?.(); }
        else onLose?.();
      } else {
        setIdx((i) => i + 1); setInput(''); setFeedback(null);
      }
    }, 1000);
  };

  return (
    <div style={darkCard}>
      <GameTitle emoji="🔡" title="Cipher Challenge" subtitle="Descifra el mensaje secreto. Cada letra fue desplazada 3 posiciones." />
      <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'center' }}>
        <p style={{ color: '#8b949e', fontSize: '0.82rem', margin: '0 0 0.5rem', fontFamily: 'monospace' }}>
          MENSAJE CIFRADO ({idx + 1}/{wordList.length}):
        </p>
        <p style={{ color: '#f0883e', fontSize: '2rem', fontWeight: 900, fontFamily: 'monospace', letterSpacing: '0.2em', margin: 0 }}>
          {cipher}
        </p>
        <p style={{ color: '#8b949e', fontSize: '0.78rem', margin: '0.5rem 0 0', fontFamily: 'monospace' }}>
          A+3=D · B+3=E · C+3=F · ... · Z+3=C
        </p>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          placeholder="Descifra aquí..."
          style={{
            flex: 1, padding: '0.75rem', borderRadius: '10px',
            background: 'rgba(255,255,255,0.07)',
            border: `1.5px solid ${feedback === 'correct' ? '#10b981' : feedback === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
            color: '#fff', fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', outline: 'none',
          }}
        />
        <ActionBtn onClick={handleCheck}>OK</ActionBtn>
      </div>
      {feedback && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
          <p style={{ color: feedback === 'correct' ? '#10b981' : '#ef4444', fontWeight: 700, margin: 0, flex: 1 }}>
            {feedback === 'correct' ? `✅ ¡Correcto! La palabra era: ${word}` : `❌ Incorrecto. Pista: ${word.length} letras.`}
          </p>
          {feedback === 'correct' && <SpeakBtn text={word} size={14} title="Escuchar palabra" />}
        </div>
      )}
    </div>
  );
}

// ─── Grammar Chess (simplificado como selector de oración) ────────────────────
export function GrammarChessGame({ onWin, onLose }) {
  const { earnXp, earnCoins, addItem } = useTeensGame();
  const moves = [
    { prompt: "Which sentence uses the Present Perfect correctly?", opts: ["I have went to Paris.", "I have been to Paris.", "I has been to Paris.", "I been to Paris."], answer: "I have been to Paris." },
    { prompt: "Choose the correct conditional sentence:", opts: ["If she study, she will pass.", "If she studies, she will pass.", "If she studied, she will pass.", "If she will study, she passes."], answer: "If she studies, she will pass." },
    { prompt: "Select the correct passive voice:", opts: ["The book was wrote by her.", "The book were written by her.", "The book was written by her.", "The book is wrote by her."], answer: "The book was written by her." },
    { prompt: "Which uses the Past Continuous correctly?", opts: ["I was study when she called.", "I were studying when she called.", "I was studying when she called.", "I studying when she called."], answer: "I was studying when she called." },
  ];
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);

  const m = moves[idx];
  const handleMove = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === m.answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= moves.length) {
        const won = score + (correct ? 1 : 0) >= 3;
        if (won) { earnXp(260); earnCoins(110); addItem({ id: 'chess_king', name: 'Chess King', emoji: '👑', rarity: 'legendary' }); onWin?.(); }
        else onLose?.();
      } else {
        setIdx((i) => i + 1); setSelected(null);
      }
    }, 900);
  };

  return (
    <div style={darkCard}>
      <GameTitle emoji="♟️" title="Grammar Chess" subtitle={`Movimiento ${idx + 1}/${moves.length} — Elige la oración correcta para avanzar.`} />
      <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
        {['♟️', '♛', '♜', '♝'][idx % 4]}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
        <p style={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', margin: 0, flex: 1 }}>{m.prompt}</p>
        <SpeakBtn text={m.prompt} size={15} title="Escuchar pregunta" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {m.opts.map((opt) => {
          const isSel = selected === opt;
          let bg = 'rgba(255,255,255,0.06)'; let border = '1px solid rgba(255,255,255,0.15)';
          if (selected) {
            if (opt === m.answer) { bg = 'rgba(16,185,129,0.2)'; border = '2px solid #10b981'; }
            else if (isSel) { bg = 'rgba(239,68,68,0.2)'; border = '2px solid #ef4444'; }
          }
          return (
            <div key={opt} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <motion.button whileTap={{ scale: 0.98 }} onClick={() => handleMove(opt)}
                style={{ flex: 1, background: bg, border, borderRadius: '12px', padding: '0.8rem', color: '#fff', fontWeight: 600, fontSize: '0.88rem', cursor: selected ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                {opt}
              </motion.button>
              <SpeakBtn text={opt} size={14} title="Escuchar oración" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Componentes comunes ──────────────────────────────────────────────────────
function GameTitle({ emoji, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
      <div style={{ fontSize: '2.2rem', marginBottom: '0.25rem' }}>{emoji}</div>
      <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.25rem', margin: '0 0 0.2rem' }}>{title}</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', margin: 0 }}>{subtitle}</p>
    </div>
  );
}

function ActionBtn({ onClick, children, style = {} }) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={onClick} style={{
      width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none',
      background: 'linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)',
      color: '#fff', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer',
      boxShadow: '0 6px 16px rgba(124,58,237,0.35)', ...style,
    }}>
      {children}
    </motion.button>
  );
}

function SpeakBtn({ text, size = 15, title = "Escuchar audio", style = {} }) {
  if (!text) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        playEnglishPhrase(text);
      }}
      title={title}
      style={{
        background: 'rgba(124, 58, 237, 0.25)',
        border: '1px solid rgba(167, 139, 250, 0.4)',
        borderRadius: '50%',
        width: `${size + 14}px`,
        height: `${size + 14}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#c4b5fd',
        flexShrink: 0,
        transition: 'all 0.15s ease',
        ...style,
      }}
    >
      <Volume2 size={size} />
    </button>
  );
}

const darkCard = {
  background: 'linear-gradient(145deg, #0f0c22 0%, #0f172a 100%)',
  borderRadius: '20px', padding: '1.5rem', minHeight: '420px',
};

