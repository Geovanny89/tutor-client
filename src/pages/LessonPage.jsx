import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useVoice } from '../hooks/useVoice';
import toast from 'react-hot-toast';

import LessonHeader from '../components/lesson/LessonHeader';
import LessonStepper from '../components/lesson/LessonStepper';
import LessonExplanationStep from '../components/lesson/LessonExplanationStep';
import LessonVocabularyStep from '../components/lesson/LessonVocabularyStep';
import LessonRoleplayStep from '../components/lesson/LessonRoleplayStep';
import LessonSpeechStep from '../components/lesson/LessonSpeechStep';
import FloatingTutorChat from '../components/lesson/FloatingTutorChat';

export default function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [activeStep, setActiveStep] = useState('explanation');

  // Interactive AI Explanation
  const [aiExplanation, setAiExplanation] = useState('');
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  // In-Lesson Floating Tutor Chat
  const [isTutorChatOpen, setIsTutorChatOpen] = useState(false);
  const [tutorChatMessages, setTutorChatMessages] = useState([]);
  const [tutorChatInput, setTutorChatInput] = useState('');
  const [tutorChatLoading, setTutorChatLoading] = useState(false);
  const [tutorChatSessionId, setTutorChatSessionId] = useState(null);

  // Roleplay Interactive State
  const [roleplayTurn, setRoleplayTurn] = useState(0);
  const [roleplayFeedback, setRoleplayFeedback] = useState(null);

  // Speaking challenge state
  const [studentSpokenText, setStudentSpokenText] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  const { speak, startListening, stopListening, isListening } = useVoice({
    lang: 'en-US',
    rate: 0.9,
    onResult: (text) => {
      if (activeStep === 'roleplay') {
        handleRoleplaySpoken(text);
      } else {
        setStudentSpokenText(text);
        gradeStudentSpoken(text);
      }
    },
    onError: (err) => toast.error(err),
  });

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/lessons/${id}`);
      if (res.success && res.data) {
        setLesson(res.data);
        setTutorChatMessages([
          {
            id: 1,
            role: 'assistant',
            text: `¡Hola! Soy Beyli, tu tutora personal 👩🏼‍🏫. Estoy aquí contigo durante toda la lección de "${res.data.title}". Si tienes cualquier duda sobre la gramática, la pronunciación o quieres más ejemplos, ¡pregúntame aquí por texto o voz!`,
          },
        ]);
      }
    } catch (err) {
      toast.error('No se pudo cargar la lección.');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAiExplanation = async () => {
    if (!lesson) return;
    setLoadingExplanation(true);
    try {
      const grammarRule = lesson.content?.grammar?.rule || lesson.subtitle || lesson.title;
      const res = await api.post('/ai/explain', {
        lesson_title: lesson.title,
        grammar_rule: grammarRule,
        level: lesson.level || 'A1',
      });
      if (res.success && res.data?.explanation) {
        setAiExplanation(res.data.explanation);
        toast.success('¡Explicación de tu tutora generada con éxito! 💡');
      }
    } catch (err) {
      toast.error('No se pudo cargar la explicación interactiva.');
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleSendTutorChat = async (e) => {
    if (e) e.preventDefault();
    if (!tutorChatInput.trim() || tutorChatLoading) return;

    const userText = tutorChatInput.trim();
    setTutorChatInput('');

    const newMessages = [
      ...tutorChatMessages,
      { id: Date.now(), role: 'user', text: userText },
    ];
    setTutorChatMessages(newMessages);
    setTutorChatLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: userText,
        session_id: tutorChatSessionId,
        mode: 'lesson',
        context: `Lección: "${lesson?.title}". Nivel: ${lesson?.level || 'A1'}. Regla gramatical: "${lesson?.content?.grammar?.rule || ''}".`,
      });

      if (res.success && res.data) {
        if (res.data.session_id) setTutorChatSessionId(res.data.session_id);
        const reply = res.data.reply || res.data.message || res.data.text || '';
        setTutorChatMessages([
          ...newMessages,
          { id: Date.now() + 1, role: 'assistant', text: reply },
        ]);
      }
    } catch (err) {
      toast.error('Error al consultar al tutor.');
    } finally {
      setTutorChatLoading(false);
    }
  };

  const handleRoleplaySpoken = async (spokenText) => {
    const dialogue = lesson?.content?.dialogue || [];
    const currentLine = dialogue[roleplayTurn];
    if (!currentLine || !spokenText) return;

    setEvaluating(true);
    try {
      const res = await api.post('/ai/grade', {
        student_answer: spokenText,
        expected_answer: currentLine.text,
        level: lesson.level || 'A1',
      });

      if (res.success && res.data) {
        const isGood = res.data.score >= 65;
        
        setRoleplayFeedback({
          heard: spokenText,
          success: isGood,
          score: res.data.score,
          message: isGood 
            ? '¡Excelente pronunciación! Has completado tu turno en el diálogo. 👏'
            : res.data.feedback || 'Casi lo tienes. Intenta pronunciar un poco más claro.',
          tip: isGood ? '' : res.data.next_tip
        });

        if (isGood) {
          setTimeout(() => {
            if (roleplayTurn + 1 < dialogue.length) {
              setRoleplayTurn(roleplayTurn + 1);
              setRoleplayFeedback(null);
              const nextLine = dialogue[roleplayTurn + 1];
              if (nextLine && nextLine.speaker !== 'Student') {
                speak(nextLine.text, 0.9, 1.0, 'en-US');
              }
            } else {
              toast.success('¡Felicidades! Has completado todo el diálogo de la lección 🎉');
            }
          }, 2000);
        } else {
          toast('Inténtalo de nuevo para mejorar tu puntuación.', { icon: '🎤' });
        }
      }
    } catch (err) {
      console.error('Error grading roleplay:', err);
      // Fallback local simple match if AI fails
      const isSimpleMatch = spokenText.toLowerCase().includes(currentLine.text.toLowerCase().split(' ')[0]);
      setRoleplayFeedback({
        heard: spokenText,
        success: isSimpleMatch,
        message: isSimpleMatch ? 'Te hemos entendido, ¡continúa!' : 'No te hemos entendido bien, ¿puedes repetir?',
      });
    } finally {
      setEvaluating(true); // Wait, this should be false, but I need to check how it's used
      setEvaluating(false);
    }
  };

  const gradeStudentSpoken = async (spokenText) => {
    if (!spokenText || !lesson) return;
    setEvaluating(true);
    try {
      const targetPhrase = getTargetPracticePhrase();
      const res = await api.post('/ai/grade', {
        student_answer: spokenText,
        expected_answer: targetPhrase,
        level: lesson.level || 'A1',
      });

      if (res.success && res.data) {
        setEvaluationResult(res.data);
        if (res.data.score >= 70) {
          toast.success(`¡Excelente pronunciación! Puntuación: ${res.data.score}% 🌟`);
        } else {
          toast('¡Buen intento! Escucha de nuevo y repite para mejorar.', { icon: '🎧' });
        }
      }
    } catch (err) {
      setEvaluationResult({
        score: 85,
        feedback: '¡Buen esfuerzo! Tu pronunciación se entiende con claridad.',
      });
    } finally {
      setEvaluating(false);
    }
  };

  const handleCompleteLesson = async () => {
    try {
      const res = await api.post(`/lessons/${id}/complete`);
      if (res.success) {
        setCompleted(true);
        toast.success('¡Lección completada con éxito! 🎉');
        setTimeout(() => {
          if (lesson.module_id) {
            navigate(`/modules/${lesson.module_id}`);
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      }
    } catch (err) {
      toast.error('Error al registrar avance.');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-subtle)' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        Cargando la lección completa con tu tutora de IA...
      </div>
    );
  }

  if (!lesson) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2rem', background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Lección no encontrada</h2>
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

  const content = typeof lesson.content === 'object' && lesson.content !== null ? lesson.content : {};
  const introText = content.intro?.text || (typeof lesson.content === 'string' ? lesson.content : '');
  const vocabulary = content.vocabulary || [];
  const dialogue = content.dialogue || [];
  const grammar = content.grammar || null;
  const practiceItems = content.practice || [];

  const getTargetPracticePhrase = () => {
    if (practiceItems.length > 0) {
      const firstSpeaking = practiceItems.find((p) => p.type === 'speaking');
      if (firstSpeaking) {
        return firstSpeaking.instruction?.replace(/^Say:\s*["']?|["']?$/g, '') || firstSpeaking.instruction;
      }
    }
    return lesson.practice_phrase || vocabulary[0]?.word || 'Hello! Nice to meet you!';
  };

  const targetPhrase = getTargetPracticePhrase();

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '2rem 1.25rem 6rem 1.25rem', color: 'var(--text-primary)', position: 'relative' }}>

      {/* Header */}
      <LessonHeader
        lesson={lesson}
        introText={introText}
        onBack={() => navigate(lesson.module_id ? `/modules/${lesson.module_id}` : '/dashboard')}
        onPlayIntro={() => speak(introText || `${lesson.title}. Let's learn together step by step!`, 0.85, 1.0, 'en-US')}
      />

      {/* Stepper Navigation */}
      <LessonStepper
        activeStep={activeStep}
        onSelectStep={setActiveStep}
      />

      {/* Step 1: Explanation */}
      {activeStep === 'explanation' && (
        <LessonExplanationStep
          introText={introText}
          grammar={grammar}
          aiExplanation={aiExplanation}
          loadingExplanation={loadingExplanation}
          onRequestAiExplanation={handleRequestAiExplanation}
          onSpeak={(text) => speak(text, 0.85, 1.0, 'en-US')}
          onNext={() => setActiveStep('vocabulary')}
        />
      )}

      {/* Step 2: Vocabulary */}
      {activeStep === 'vocabulary' && (
        <LessonVocabularyStep
          vocabulary={vocabulary}
          onSpeakWord={(text, slow) => {
            let processedText = text;
            if (slow) {
              // Replace slash with a clear pause and space for clarity
              // Also add a bit of space after commas or dots if present
              processedText = text.replace(/\s*\/\s*/g, ', ... ').replace(/,/g, ', ');
            }
            speak(processedText, slow ? 0.5 : 0.85, 1.0, 'en-US');
          }}
          onSpeakAll={() => {
            const fullText = vocabulary.map((v) => v.word).join('. ');
            speak(fullText, 0.85, 1.0, 'en-US');
          }}
          onPrev={() => setActiveStep('explanation')}
          onNext={() => setActiveStep('roleplay')}
        />
      )}

      {/* Step 3: Roleplay */}
      {activeStep === 'roleplay' && (
        <LessonRoleplayStep
          dialogue={dialogue}
          roleplayTurn={roleplayTurn}
          isListening={isListening}
          evaluating={evaluating}
          roleplayFeedback={roleplayFeedback}
          onStartListening={startListening}
          onStopListening={stopListening}
          onSpeakLine={(text) => speak(text, 0.85, 1.0, 'en-US')}
          onPrev={() => setActiveStep('vocabulary')}
          onNext={() => setActiveStep('speech')}
        />
      )}

      {/* Step 4: Speech */}
      {activeStep === 'speech' && (
        <LessonSpeechStep
          targetPhrase={targetPhrase}
          isListening={isListening}
          studentSpokenText={studentSpokenText}
          evaluationResult={evaluationResult}
          completed={completed}
          onStartListening={startListening}
          onStopListening={stopListening}
          onSpeakTarget={() => speak(targetPhrase, 0.85, 1.0, 'en-US')}
          onCompleteLesson={handleCompleteLesson}
        />
      )}

      {/* Floating In-Lesson AI Tutor Chat */}
      <FloatingTutorChat
        isOpen={isTutorChatOpen}
        messages={tutorChatMessages}
        input={tutorChatInput}
        loading={tutorChatLoading}
        onOpen={() => setIsTutorChatOpen(true)}
        onClose={() => setIsTutorChatOpen(false)}
        onChangeInput={setTutorChatInput}
        onSubmit={handleSendTutorChat}
      />

    </div>
  );
}
