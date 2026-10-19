import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useVoice } from '../hooks/useVoice';
import { useAiStore } from '../stores/aiStore';
import {
  ArrowLeft,
  Sparkles,
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  XCircle,
  Lightbulb,
  RefreshCw,
  Trophy,
  Loader2,
} from 'lucide-react';

const EXERCISE_TYPES = [
  { id: 'fill_blank', name: 'Completar frase', icon: '✏️', hint: 'Elige la palabra que falta' },
  { id: 'pronunciation', name: 'Pronunciación', icon: '🎤', hint: 'Lee la frase en voz alta' },
  { id: 'technical', name: 'Inglés técnico', icon: '🛠️', hint: 'Vocabulario profesional' },
  { id: 'vocabulary', name: 'Vocabulario', icon: '📚', hint: 'Usa la palabra en una frase' },
  { id: 'mixed', name: 'Mixto', icon: '🎲', hint: 'Una mezcla de todos los tipos' },
];

const cardStyle = {
  background: 'var(--bg-surface)',
  border: '1px solid var(--border)',
  borderRadius: '20px',
  padding: '1.5rem',
  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
};

export default function PracticePage() {
  const { id: routeModuleId } = useParams();
  const navigate = useNavigate();
  const { connected, checkStatus, usageStats, fetchUsage } = useAiStore();

  const [modules, setModules] = useState([]);
  const [selectedModuleId, setSelectedModuleId] = useState(routeModuleId || '');
  const [exerciseType, setExerciseType] = useState('fill_blank');
  const [count, setCount] = useState(5);

  const [exercises, setExercises] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [checkingId, setCheckingId] = useState(null);
  const [listeningId, setListeningId] = useState(null);

  const voiceTargetRef = useRef(null);
  const exercisesRef = useRef([]);
  exercisesRef.current = exercises;

  const { isListening, startListening, stopListening, speak, isSupported } = useVoice({
    lang: 'en-US',
    onResult: (text) => {
      const exercise = voiceTargetRef.current;
      voiceTargetRef.current = null;
      setListeningId(null);
      if (!exercise) return;
      setAnswers((prev) => ({ ...prev, [exercise.id]: text }));
      submitPronunciation(exercise, text);
    },
    onError: (err) => {
      toast.error(err);
      voiceTargetRef.current = null;
      setListeningId(null);
    },
  });

  useEffect(() => {
    loadModules();
    checkStatus();
    fetchUsage();
  }, []);

  const loadModules = async () => {
    try {
      const res = await api.get('/modules');
      if (res.success && Array.isArray(res.data)) setModules(res.data);
    } catch (err) {
      // Silently ignore: the student can still write a free topic
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setResults({});
    setAnswers({});
    try {
      const res = await api.post('/ai/practice/generate', {
        module_id: selectedModuleId || undefined,
        type: exerciseType,
        count,
      });
      if (res.success && res.data?.exercises?.length) {
        setExercises(res.data.exercises);
        toast.success(`¡${res.data.exercises.length} ejercicios listos! 🎯`);
        if (!res.data.fromCache) fetchUsage();
      } else {
        toast.error('No se pudieron generar ejercicios. Intenta de nuevo.');
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleCheck = async (exercise) => {
    const answer = (answers[exercise.id] || '').trim();
    if (!answer) {
      toast.error('Escribe tu respuesta primero.');
      return;
    }

    setCheckingId(exercise.id);
    try {
      const res = await api.post('/ai/practice/check', {
        type: exercise.type,
        sentence: exercise.sentence || exercise.question || '',
        expected: exercise.answer || exercise.word,
        student_answer: answer,
        hints: exercise.hints || [],
      });
      if (res.success) setResults((prev) => ({ ...prev, [exercise.id]: res.data }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCheckingId(null);
    }
  };

  const submitPronunciation = async (exercise, spokenText) => {
    if (!spokenText?.trim()) return;
    setCheckingId(exercise.id);
    try {
      const res = await api.post('/ai/grade', {
        student_answer: spokenText,
        expected_answer: exercise.sentence,
      });
      if (res.success) setResults((prev) => ({ ...prev, [exercise.id]: res.data }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCheckingId(null);
    }
  };

  const toggleMic = (exercise) => {
    if (isListening) {
      stopListening();
      voiceTargetRef.current = null;
      setListeningId(null);
      return;
    }
    voiceTargetRef.current = exercise;
    setListeningId(exercise.id);
    startListening();
  };

  const answeredCount = Object.keys(results).length;
  const correctCount = Object.values(results).filter((r) => r.correct || r.score >= 70).length;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem', color: 'var(--text-primary)' }}>
      <button
        onClick={() => navigate(routeModuleId ? `/modules/${routeModuleId}` : '/dashboard')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'transparent',
          border: 'none',
          color: 'var(--primary)',
          cursor: 'pointer',
          fontSize: '0.92rem',
          fontWeight: 700,
          marginBottom: '1.5rem',
        }}
      >
        <ArrowLeft size={16} /> {routeModuleId ? 'Volver al módulo' : 'Volver al panel'}
      </button>

      {/* Header */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              margin: '0 0 0.4rem 0',
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
            }}>
              <Sparkles size={26} color="var(--primary)" /> Práctica con IA
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.95rem' }}>
              Pon a prueba lo aprendido: completa frases, practica tu pronunciación y domina el inglés técnico.
              La IA valida cada respuesta al instante.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.5rem 0.9rem',
            borderRadius: '999px',
            background: connected === false ? 'var(--error-bg)' : connected ? 'var(--primary-bg)' : 'var(--bg-muted)',
            border: `1px solid ${connected === false ? 'var(--error-border)' : connected ? 'var(--primary-soft-2)' : 'var(--border)'}`,
            fontSize: '0.78rem',
            fontWeight: 700,
            color: connected === false ? 'var(--error-strong)' : connected ? 'var(--primary-hover)' : 'var(--text-subtle)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: connected === false ? 'var(--error)' : connected ? 'var(--primary-light)' : 'var(--text-muted)',
            }} />
            {connected === false ? 'IA desconectada' : connected ? 'IA en línea' : 'Verificando…'}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Módulo / Tema
            </label>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg-base)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                outline: 'none',
              }}
            >
              <option value="">Tema libre (general)</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name || m.title} (Nivel {m.level})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Número de ejercicios
            </label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: '1px solid var(--border-strong)',
                background: 'var(--bg-base)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 600,
                outline: 'none',
              }}
            >
              {[3, 5, 8, 10].map((n) => (
                <option key={n} value={n}>{n} ejercicios</option>
              ))}
            </select>
          </div>
        </div>

        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.55rem' }}>
          Tipo de práctica
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '1.25rem' }}>
          {EXERCISE_TYPES.map((type) => {
            const isActive = exerciseType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setExerciseType(type.id)}
                title={type.hint}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.6rem 1rem',
                  borderRadius: '999px',
                  border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                  background: isActive ? 'var(--primary-bg)' : 'var(--bg-surface)',
                  color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span>{type.icon}</span> {type.name}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleGenerate}
            disabled={generating}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: generating ? 'var(--text-muted)' : 'var(--primary)',
              color: 'var(--text-on-primary)',
              fontWeight: 800,
              padding: '0.8rem 1.6rem',
              borderRadius: '12px',
              border: 'none',
              cursor: generating ? 'wait' : 'pointer',
              fontSize: '0.95rem',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)',
            }}
          >
            {generating ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />}
            {generating ? 'Generando con IA…' : 'Generar ejercicios'}
          </button>

          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
            Le quedan {usageStats.interactionsRemaining} interacciones de IA hoy
          </span>
        </div>
      </div>

      {/* Progress summary */}
      {exercises.length > 0 && (
        <div style={{
          ...cardStyle,
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          background: 'var(--primary-bg)',
          borderColor: 'var(--primary-soft-2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Trophy size={22} color="var(--primary)" />
            <strong style={{ color: 'var(--primary-text)', fontSize: '1rem' }}>
              {correctCount} / {exercises.length} correctas
            </strong>
            <span style={{ color: 'var(--primary-hover)', fontSize: '0.85rem' }}>
              ({answeredCount} respondidas)
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '160px', height: '8px', background: 'var(--primary-soft)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${exercises.length ? (correctCount / exercises.length) * 100 : 0}%`,
                height: '100%',
                background: 'var(--primary)',
                transition: 'width 0.4s ease',
              }} />
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--primary-soft-2)',
                color: 'var(--primary-hover)',
                fontWeight: 700,
                padding: '0.5rem 0.9rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.83rem',
              }}
            >
              <RefreshCw size={15} /> Nuevos
            </button>
          </div>
        </div>
      )}

      {/* Exercises */}
      {exercises.length === 0 && !generating && (
        <div style={{
          ...cardStyle,
          textAlign: 'center',
          padding: '3rem 2rem',
          border: '1px dashed var(--border-strong)',
          color: 'var(--text-subtle)',
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎯</div>
          <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '0.35rem' }}>
            Aún no hay ejercicios
          </strong>
          Elige un tipo de práctica y pulsa «Generar ejercicios» para que la IA cree un reto a tu medida.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {exercises.map((exercise, index) => (
          <ExerciseCard
            key={exercise.id}
            index={index}
            exercise={exercise}
            answer={answers[exercise.id] || ''}
            result={results[exercise.id]}
            checking={checkingId === exercise.id}
            listening={listeningId === exercise.id}
            voiceSupported={isSupported}
            onAnswer={(value) => setAnswers((prev) => ({ ...prev, [exercise.id]: value }))}
            onCheck={() => handleCheck(exercise)}
            onSpeak={(text, rate) => speak(text, rate || 0.95, 1.0, 'en-US')}
            onToggleMic={() => toggleMic(exercise)}
          />
        ))}
      </div>

      {exercises.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link
            to="/tutor"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--primary)',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.95rem',
            }}
          >
            ¿Quieres practicar conversación real? Habla con el tutor de voz <Sparkles size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}

function ExerciseCard({
  index,
  exercise,
  answer,
  result,
  checking,
  listening,
  voiceSupported,
  onAnswer,
  onCheck,
  onSpeak,
  onToggleMic,
}) {
  const isPronunciation = exercise.type === 'pronunciation';
  const isVocabulary = exercise.type === 'vocabulary';
  const expected = exercise.answer || exercise.word;

  const isCorrect = result && (result.correct || result.score >= 70);

  return (
    <div style={{
      ...cardStyle,
      borderColor: result ? (isCorrect ? 'var(--primary-soft-2)' : 'var(--error-border)') : 'var(--border)',
      background: result ? (isCorrect ? 'var(--primary-bg)' : 'var(--error-bg)') : 'var(--bg-surface)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
        <span style={{
          width: '28px',
          height: '28px',
          borderRadius: '9px',
          background: 'var(--primary-bg)',
          color: 'var(--primary)',
          border: '1px solid var(--primary-soft-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '0.82rem',
          flexShrink: 0,
        }}>
          {index + 1}
        </span>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {isPronunciation ? 'Pronunciación' : isVocabulary ? 'Vocabulario' : exercise.type === 'technical' ? 'Inglés técnico' : 'Completar frase'}
        </span>
        {result && (
          <span style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontWeight: 800,
            fontSize: '0.85rem',
            color: isCorrect ? 'var(--primary-hover)' : 'var(--error-strong)',
          }}>
            {isCorrect ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {result.score ?? 0}%
          </span>
        )}
      </div>

      {/* Prompt */}
      {isVocabulary ? (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{exercise.word}</div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '0.2rem' }}>{exercise.translation}</div>
          {exercise.example && (
            <div style={{ marginTop: '0.55rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <em style={{ color: 'var(--text-secondary)' }}>“{exercise.example}”</em>
              <button
                onClick={() => onSpeak(exercise.example)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex' }}
                title="Escuchar"
              >
                <Volume2 size={17} />
              </button>
            </div>
          )}
          <div style={{ marginTop: '0.85rem', fontWeight: 700, color: 'var(--primary-text)', fontSize: '0.95rem' }}>
            {exercise.question || `Escribe una frase usando "${exercise.word}".`}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, lineHeight: 1.55, flex: 1 }}>
              {exercise.sentence}
            </p>
            <button
              onClick={() => onSpeak(exercise.sentence, 0.85)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', display: 'flex', flexShrink: 0 }}
              title="Escuchar la frase"
            >
              <Volume2 size={19} />
            </button>
          </div>

          {exercise.focus && (
            <div style={{ fontSize: '0.82rem', color: 'var(--accent-purple)', fontWeight: 700, marginTop: '0.45rem' }}>
              🎯 Enfoque: {exercise.focus}
            </div>
          )}
          {exercise.translation && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Significado: {exercise.translation}
            </div>
          )}
          {exercise.context && (
            <div style={{ fontSize: '0.82rem', color: 'var(--text-subtle)', marginTop: '0.25rem', fontStyle: 'italic' }}>
              {exercise.context}
            </div>
          )}
        </div>
      )}

      {/* Answer controls */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={answer}
          onChange={(e) => onAnswer(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onCheck(); }}
          placeholder={isPronunciation ? 'Pulsa el micrófono y lee la frase…' : 'Escribe tu respuesta…'}
          disabled={!!result}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '0.7rem 0.95rem',
            borderRadius: '12px',
            border: '1px solid var(--border-strong)',
            background: result ? 'var(--bg-muted)' : 'var(--bg-surface)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            outline: 'none',
          }}
        />

        {isPronunciation && voiceSupported && !result && (
          <button
            onClick={onToggleMic}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: listening ? 'var(--error-strong)' : 'var(--primary)',
              color: 'var(--text-on-primary)',
              fontWeight: 700,
              padding: '0.7rem 1.1rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {listening ? <MicOff size={17} /> : <Mic size={17} />}
            {listening ? 'Escuchando…' : 'Hablar'}
          </button>
        )}

        {!result && (
          <button
            onClick={onCheck}
            disabled={checking || !answer.trim()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: checking || !answer.trim() ? 'var(--border-strong)' : 'var(--primary)',
              color: 'var(--text-on-primary)',
              fontWeight: 700,
              padding: '0.7rem 1.3rem',
              borderRadius: '12px',
              border: 'none',
              cursor: checking || !answer.trim() ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {checking ? <Loader2 size={16} className="spin" /> : <CheckCircle2 size={16} />}
            Comprobar
          </button>
        )}
      </div>

      {/* Options & Hints */}
      {!result && (
        <div style={{ marginTop: '0.85rem' }}>
          {/* Real options to click (if AI provided them) */}
          {Array.isArray(exercise.options) && exercise.options.length > 0 && (
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {exercise.options.map((opt, i) => (
                <button
                  key={`opt-${i}`}
                  onClick={() => onAnswer(opt)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    border: answer === opt ? '2px solid var(--primary)' : '1px solid var(--border-strong)',
                    background: answer === opt ? 'var(--primary-bg)' : 'var(--bg-base)',
                    color: answer === opt ? 'var(--primary-text)' : 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Descriptive Hints (small, non-clickable unless they are valid short answers) */}
          {Array.isArray(exercise.hints) && exercise.hints.length > 0 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-subtle)', marginRight: '0.2rem' }}>
                <Lightbulb size={14} style={{ verticalAlign: 'middle', marginTop: '-2px' }} /> PISTAS:
              </span>
              {exercise.hints.map((hint, i) => (
                <span
                  key={`hint-${i}`}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    background: 'var(--bg-muted)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    border: '1px solid var(--border)',
                  }}
                >
                  {hint}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {result && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed var(--border)' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isCorrect ? 'var(--primary-text)' : 'var(--error-strong)', marginBottom: '0.4rem' }}>
            {result.feedback}
          </div>

          {!isCorrect && expected && (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
              Respuesta correcta: <strong>{result.expected || expected}</strong>
            </div>
          )}

          {Array.isArray(result.mispronounced_words) && result.mispronounced_words.length > 0 && (
            <div style={{ fontSize: '0.88rem', color: 'var(--accent-purple)', marginBottom: '0.3rem' }}>
              🎧 Pronunciación: {result.mispronounced_words.map((w) => `${w.said || '—'} → ${w.expected}`).join(', ')}
            </div>
          )}

          {Array.isArray(result.corrections) && result.corrections.length > 0 && (
            <ul style={{ margin: '0.35rem 0 0.35rem 1.1rem', padding: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              {result.corrections.map((c, i) => (
                <li key={i}>
                  «{c.said}» → <strong>{c.should_be}</strong>{c.why ? ` (${c.why})` : ''}
                </li>
              ))}
            </ul>
          )}

          {(result.tip || result.next_tip || result.improvement) && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.45rem',
              marginTop: '0.5rem',
              padding: '0.7rem 0.9rem',
              background: 'var(--warning-bg)',
              border: '1px solid var(--accent-gold-border)',
              borderRadius: '10px',
              fontSize: '0.87rem',
              color: 'var(--accent-gold-text)',
              fontWeight: 600,
            }}>
              <Lightbulb size={17} color="var(--accent-gold-strong)" style={{ flexShrink: 0, marginTop: '1px' }} />
              <span>{result.improvement || result.tip || result.next_tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
