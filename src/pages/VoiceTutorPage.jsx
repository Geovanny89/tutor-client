import React, { useState, useEffect, useRef } from 'react';
import { useAiStore } from '../stores/aiStore';
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
    messages,
    isLoading,
    usageStats,
    sendMessage,
    clearChat,
    fetchUsage,
  } = useAiStore();

  const [inputMessage, setInputMessage] = useState('');
  const [showGuide, setShowGuide] = useState(true);
  const [slowAudio, setSlowAudio] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
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
    lang: activePersona.accent || 'en-US',
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
    if (messages.length === 0) {
      setPersona(activePersona);
    }
  }, []);

  const handleSendVoice = async (text) => {
    if (usageStats.interactionsRemaining <= 0) {
      toast.error('Has alcanzado tu límite gratuito de hoy. Se reinicia a medianoche ⏳');
      return;
    }

    const result = await sendMessage(text, `Estudiante nivel: ${user?.current_level || 'A1'}`);
    if (result.success && autoSpeak) {
      speak(result.reply, slowAudio ? 0.75 : activePersona.voiceRate, activePersona.voicePitch, activePersona.accent);
    }
  };

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const text = inputMessage.trim();
    setInputMessage('');

    if (usageStats.interactionsRemaining <= 0) {
      toast.error('Has alcanzado tu límite gratuito de hoy. Se reinicia a medianoche ⏳');
      return;
    }

    const result = await sendMessage(text, `Estudiante nivel: ${user?.current_level || 'A1'}`);
    if (result.success && autoSpeak) {
      speak(result.reply, slowAudio ? 0.75 : activePersona.voiceRate, activePersona.voicePitch, activePersona.accent);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      if (usageStats.interactionsRemaining <= 0) {
        toast.error('Límite diario alcanzado. Podrás seguir mañana gratis.');
        return;
      }
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
      activePersona.accent
    );
  };

  const starterPrompts = [
    { text: "Hello! How are you today? What's your name?", label: "👋 Saludar y conocerse" },
    { text: "Can you ask me a question about my hobbies or family?", label: "❓ Hazme una pregunta" },
    { text: "Can we practice ordering food at an American restaurant?", label: "🍔 Pedir comida" },
    { text: "What did you do last weekend? Tell me a short story.", label: "📖 Hablar del fin de semana" },
  ];

  return (
    <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '1.75rem 1.25rem', color: '#0F172A' }}>
      
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
            speak(persona.welcomeMessage, persona.voiceRate, persona.voicePitch, persona.accent);
          }
        }}
      />

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
