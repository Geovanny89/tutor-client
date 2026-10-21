import React, { useState, useEffect, useRef } from 'react';
import { useAiStore, TUTOR_MODES } from '../stores/aiStore';
import { useAuthStore } from '../stores/authStore';
import { useVoice } from '../hooks/useVoice';
import toast from 'react-hot-toast';

import TutorHeaderBanner from '../components/tutor/TutorHeaderBanner';
import TutorPersonaSelector from '../components/tutor/TutorPersonaSelector';
import TutorChatWindow from '../components/tutor/TutorChatWindow';
import TutorInputControls from '../components/tutor/TutorInputControls';

export default function VoiceTutorPage() {
  const { user } = useAuthStore();
  const {
    activePersona,
    setPersona,
    tutorMode,
    setTutorMode,
    domain,
    setDomain,
    connected,
    checkStatus,
    messages,
    isLoading,
    usageStats,
    sendMessage,
    clearChat,
    fetchUsage,
    checkTokensAndTriggerAd,
  } = useAiStore();

  const [inputMessage, setInputMessage] = useState('');
  const [showGuide, setShowGuide] = useState(true);
  const [slowAudio, setSlowAudio] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [recognitionLang, setRecognitionLang] = useState('en-US');
  const [customDomain, setCustomDomain] = useState(domain);
  const messagesEndRef = useRef(null);

  const {
    isListening,
    isSpeaking,
    transcript,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    isSupported,
  } = useVoice({
    lang: recognitionLang,
    rate: slowAudio ? 0.75 : activePersona.voiceRate || 0.9,
    pitch: activePersona.voicePitch || 1.0,
    onResult: (text) => {
      if (text && text.trim()) {
        handleSendVoice(text);
      }
    },
    onError: (err) => {
      toast.error(err);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    fetchUsage();
    checkStatus();
    if (messages.length === 0) {
      setPersona(activePersona);
    }
  }, []);

  const handleSendVoice = async (text) => {
    const hasTokens = await checkTokensAndTriggerAd();
    if (!hasTokens) return;

    const result = await sendMessage(text, {
      context: `Estudiante nivel: ${user?.current_level || 'A1'}, Edad: ${user?.age_range || 'adults'}`,
    });
    if (result.success && autoSpeak) {
      speak(result.reply, slowAudio ? 0.75 : activePersona.voiceRate, activePersona.voicePitch, activePersona.accent, activePersona.voiceGender);
    }
  };

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const text = inputMessage.trim();
    setInputMessage('');

    const hasTokens = await checkTokensAndTriggerAd();
    if (!hasTokens) return;

    const result = await sendMessage(text, {
      context: `Estudiante nivel: ${user?.current_level || 'A1'}, Edad: ${user?.age_range || 'adults'}`,
    });
    if (result.success && autoSpeak) {
      speak(result.reply, slowAudio ? 0.75 : activePersona.voiceRate, activePersona.voicePitch, activePersona.accent, activePersona.voiceGender);
    }
  };

  const toggleListen = async () => {
    if (isListening) {
      stopListening();
    } else {
      const hasTokens = await checkTokensAndTriggerAd();
      if (!hasTokens) return;
      startListening();
    }
  };

  const playVoice = (text, customSlow = false) => {
    if (!text || !text.trim()) {
      toast.error('Este mensaje aún no contiene texto para reproducir');
      return;
    }
    speak(
      text, 
      customSlow ? 0.7 : activePersona.voiceRate, 
      activePersona.voicePitch, 
      activePersona.accent,
      activePersona.voiceGender
    );
  };

  const starterPrompts = tutorMode === 'technical'
    ? [
        { text: "Help me write a professional email to ask for a deadline extension.", label: "✉️ Correo profesional" },
        { text: "Explain how to run and lead a daily stand-up meeting in English.", label: "🗣️ Daily stand-up" },
        { text: "Role-play a job interview for a software developer position.", label: "💼 Entrevista de trabajo" },
        { text: "Teach me useful English vocabulary for code reviews and pull requests.", label: "🔍 Code review" },
      ]
    : user?.age_range === 'kids'
    ? [
        { text: "Hello! My name is Jose. 🍎", label: "👋 Saludar" },
        { text: "Look! A big elephant! 🐘", label: "🐘 Animales" },
        { text: "I like the color blue. 🔵", label: "🎨 Colores" },
        { text: "One, two, three! 🔢", label: "🔢 Contar" },
      ]
    : [
        { text: "Hello! How are you today? What's your name?", label: "👋 Saludar y conocerse" },
        { text: "Can you ask me a question about my hobbies or family?", label: "❓ Hazme una pregunta" },
        { text: "Can we practice ordering food at an American restaurant?", label: "🍔 Pedir comida" },
        { text: "What did you do last weekend? Tell me a short story.", label: "📖 Hablar del fin de semana" },
      ];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '1.75rem 1.25rem', color: 'var(--text-primary)' }}>
      
      {/* Header Banner & Token Limit */}
      <TutorHeaderBanner
        usageStats={usageStats}
        showGuide={showGuide}
        onCloseGuide={() => setShowGuide(false)}
      />

      {/* Tutor Persona Bar */}
      <TutorPersonaSelector
        activePersona={activePersona}
        onSelectPersona={(persona) => {
          setPersona(persona);
          if (autoSpeak) {
            speak(persona.welcomeMessage, persona.voiceRate, persona.voicePitch, persona.accent, persona.voiceGender);
          }
        }}
      />

      {/* Mode selector: fluency vs technical English + live connection status */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.65rem',
        marginBottom: '1.25rem',
      }}>
        {TUTOR_MODES.map((mode) => {
          const isActive = tutorMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setTutorMode(mode.id)}
              title={mode.description}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.1rem',
                borderRadius: '999px',
                border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                background: isActive ? 'var(--primary-bg)' : 'var(--bg-surface)',
                color: isActive ? 'var(--primary-text)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span>{mode.icon}</span>
              {mode.name}
            </button>
          );
        })}

        {/* Connection status pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          marginLeft: 'auto',
          padding: '0.5rem 0.9rem',
          borderRadius: '999px',
          background: connected === false ? 'var(--error-bg)' : connected ? 'var(--primary-bg)' : 'var(--bg-muted)',
          border: `1px solid ${connected === false ? 'var(--error-border)' : connected ? 'var(--primary-soft-2)' : 'var(--border)'}`,
          fontSize: '0.8rem',
          fontWeight: 700,
          color: connected === false ? 'var(--error-strong)' : connected ? 'var(--primary-hover)' : 'var(--text-subtle)',
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

      {/* Technical domain selector (only in technical mode) */}
      {tutorMode === 'technical' && (
        <div style={{
          display: 'flex',
          gap: '0.65rem',
          alignItems: 'center',
          marginBottom: '1.25rem',
          padding: '0.85rem 1rem',
          borderRadius: '14px',
          background: 'var(--bg-base)',
          border: '1px solid var(--border)',
        }}>
          <span style={{ fontSize: '1.05rem' }}>🎯</span>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Área técnica:
          </label>
          <input
            type="text"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
            onBlur={() => setDomain(customDomain || 'general professional English')}
            placeholder="ej: software engineering, medicine, finance, law…"
            style={{
              flex: 1,
              minWidth: '180px',
              padding: '0.55rem 0.85rem',
              borderRadius: '10px',
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-surface)',
              color: 'var(--text-primary)',
              fontSize: '0.88rem',
              outline: 'none',
            }}
          />
        </div>
      )}

      {/* Main Conversation Window */}
      <div style={{
        borderRadius: '24px',
        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
      }}>
        <TutorChatWindow
          activePersona={activePersona}
          slowAudio={slowAudio}
          autoSpeak={autoSpeak}
          messages={messages}
          isLoading={isLoading}
          isListening={isListening}
          transcript={transcript}
          messagesEndRef={messagesEndRef}
          onToggleSlowAudio={() => setSlowAudio(!slowAudio)}
          onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
          onClearChat={clearChat}
          onPlayVoice={playVoice}
          onStopListening={stopListening}
        />

        <TutorInputControls
          messages={messages}
          inputMessage={inputMessage}
          isLoading={isLoading}
          isListening={isListening}
          recognitionLang={recognitionLang}
          onToggleRecognitionLang={() => setRecognitionLang(prev => prev === 'en-US' ? 'es-ES' : 'en-US')}
          starterPrompts={starterPrompts}
          onSelectStarter={handleSendVoice}
          onToggleListen={toggleListen}
          onChangeInput={setInputMessage}
          onSubmitText={handleSendText}
        />
      </div>

    </div>
  );
}
