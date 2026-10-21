import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useVoice } from '../hooks/useVoice';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

import EvaluationHeader from '../components/evaluation/EvaluationHeader';
import EvaluationResultCard from '../components/evaluation/EvaluationResultCard';
import EvaluationQuestionCard from '../components/evaluation/EvaluationQuestionCard';
import EvaluationSpeakingBonus from '../components/evaluation/EvaluationSpeakingBonus';

// Reserva local por si un módulo aún no tiene preguntas cargadas en el servidor.
const FALLBACK_QUESTIONS = [
  {
    id: 'q1',
    question: "Which of the following is the correct response to 'How do you do?'",
    options: ['I am doing well, thanks!', 'How do you do?', 'Goodbye!', 'Yes, please.'],
    correct: 0,
  },
  {
    id: 'q2',
    question: 'Select the sentence with the correct grammar:',
    options: ['She go to school every day.', 'She goes to school every day.', 'She going school.', 'She is go to school.'],
    correct: 1,
  },
  {
    id: 'q3',
    question: "What does 'I look forward to meeting you' mean?",
    options: ['I am afraid to see you.', 'I am excited and anticipating seeing you.', 'I forgot our meeting.', 'I cannot meet you.'],
    correct: 1,
  },
];

export default function EvaluationPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { fetchProfile } = useAuthStore();

  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [spokenAnswers, setSpokenAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Intento cronometrado (el tiempo lo controla el servidor)
  const [attempt, setAttempt] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const deadlineRef = useRef(null);
  const autoSubmittedRef = useRef(false);
  const submitRef = useRef(() => {});

  const { speak, startListening, stopListening, isListening } = useVoice({
    lang: 'en-US',
    rate: 0.9,
    onResult: (text) => {
      setSpokenAnswers((prev) => ({ ...prev, currentSpeaking: text }));
    },
    onError: (err) => toast.error(err),
  });

  useEffect(() => {
    fetchEvaluation();
  }, [moduleId]);

  const fetchEvaluation = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/evaluations/module/${moduleId}`);
      if (res.success && res.data) {
        setEvaluation(res.data);
        await startAttempt(res.data.id);
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo cargar la evaluación del módulo.');
    } finally {
      setLoading(false);
    }
  };

  // Inicia (o reanuda) el intento y arranca el cronómetro desde el servidor.
  const startAttempt = async (evaluationId) => {
    try {
      const res = await api.post(`/evaluations/${evaluationId}/attempt`);
      if (res.success && res.data) {
        setAttempt(res.data);
        setSecondsLeft(res.data.remaining_seconds);
        deadlineRef.current = Date.now() + res.data.remaining_seconds * 1000;
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo iniciar el intento cronometrado.');
    }
  };

  // Cuenta regresiva. Al llegar a 0 se envía automáticamente.
  useEffect(() => {
    if (!attempt || result) return undefined;
    const id = setInterval(() => {
      if (!deadlineRef.current) return;
      const left = Math.max(0, Math.round((deadlineRef.current - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0 && !autoSubmittedRef.current) {
        autoSubmittedRef.current = true;
        clearInterval(id);
        toast.error('¡Se acabó el tiempo! Enviando tus respuestas...');
        submitRef.current(true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [attempt, result]);

  const handleSelectOption = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value,
    }));
  };

  const handleSubmitEvaluation = useCallback(
    async (auto = false) => {
      if (!evaluation) return;

      const questions = evaluation.questions?.length ? evaluation.questions : FALLBACK_QUESTIONS;
      const answeredCount = Object.keys(answers).length;

      if (!auto && answeredCount < questions.length && questions.length > 0) {
        if (!confirm(`Has respondido ${answeredCount} de ${questions.length} preguntas. ¿Deseas enviar el examen de todos modos?`)) {
          return;
        }
      }

      setSubmitting(true);
      try {
        // El backend espera un array [{ question_id, answer }]
        const payload = questions.map((q, idx) => ({
          question_id: q.id || `q${idx}`,
          answer: answers[idx] ?? '',
        }));

        if (spokenAnswers.currentSpeaking) {
          payload.push({ question_id: 'speaking_bonus', answer: spokenAnswers.currentSpeaking });
        }

        const url = attempt?.attempt_id
          ? `/evaluations/attempts/${attempt.attempt_id}/submit`
          : `/evaluations/${evaluation.id}/submit`;

        const res = await api.post(url, { answers: payload });

        if (res.success && res.data) {
          setResult(res.data);
          await fetchProfile();
          if (res.data.timed_out) {
            toast.error('Se agotó el tiempo del examen. Revisa tu resultado.');
          } else if (res.data.passed) {
            toast.success('¡Felicitaciones! Has aprobado el examen 🎉', { duration: 4000 });
          } else {
            toast.error(`No alcanzaste el ${res.data.min_pass_score ?? 70}% requerido. Puedes repasar y volver a intentarlo 💪`);
          }
        }
      } catch (err) {
        toast.error(err.message || 'Error al enviar la evaluación');
      } finally {
        setSubmitting(false);
      }
    },
    [evaluation, answers, spokenAnswers, attempt]
  );

  // Expone el submit más reciente al cronómetro sin reinstanciarlo.
  submitRef.current = handleSubmitEvaluation;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-subtle)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        Cargando evaluación del módulo...
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Evaluación no encontrada</h2>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            marginTop: '1rem',
            background: 'var(--primary)',
            color: 'var(--text-on-primary)',
            border: 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Volver a Módulos
        </button>
      </div>
    );
  }

  const questions = evaluation.questions?.length ? evaluation.questions : FALLBACK_QUESTIONS;

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem', color: 'var(--text-primary)' }}>

      {/* Header */}
      <EvaluationHeader
        evaluation={evaluation}
        timeLeft={secondsLeft}
        timeLimitMinutes={attempt?.time_limit_minutes}
        onBack={() => navigate(`/modules/${moduleId}`)}
      />

      {/* Result Card */}
      {result && (
        <EvaluationResultCard
          result={result}
          onContinue={() => navigate('/dashboard')}
          onRetry={() => {
            setResult(null);
            setAnswers({});
            setSpokenAnswers({});
            autoSubmittedRef.current = false;
            startAttempt(evaluation.id);
          }}
        />
      )}

      {/* Questions List */}
      {!result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((q, qIndex) => (
            <EvaluationQuestionCard
              key={q.id || qIndex}
              q={q}
              qIndex={qIndex}
              totalQuestions={questions.length}
              selectedAnswer={answers[qIndex]}
              onSelectOption={handleSelectOption}
              onSpeakQuestion={(text) => speak(text, 0.9, 1.0, 'en-US')}
            />
          ))}

          {/* Speaking Bonus Section */}
          <EvaluationSpeakingBonus
            isListening={isListening}
            spokenAnswer={spokenAnswers.currentSpeaking}
            onStartListening={startListening}
            onStopListening={stopListening}
          />

          {/* Submit Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              onClick={() => handleSubmitEvaluation(false)}
              disabled={submitting}
              style={{
                padding: '0.95rem 2.75rem',
                borderRadius: '14px',
                background: 'var(--primary)',
                color: 'var(--text-on-primary)',
                fontWeight: 800,
                fontSize: '1.05rem',
                border: 'none',
                cursor: submitting ? 'wait' : 'pointer',
                boxShadow: '0 6px 20px rgba(5, 150, 105, 0.3)',
              }}
            >
              {submitting ? 'Evaluando tus Respuestas...' : 'Enviar y Calificar Examen ✨'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
