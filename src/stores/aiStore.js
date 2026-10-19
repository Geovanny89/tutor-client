import { create } from 'zustand';
import api from '../services/api';

export const TUTOR_PERSONAS = [
  {
    id: 'Beyli',
    name: 'Beyli',
    role: 'Friendly Native Tutor',
    avatar: '👩🏼‍🏫',
    accent: 'en-US',
    voicePitch: 1.0,
    voiceRate: 0.9,
    description: 'Habla con paciencia y ritmo claro. Ideal para niveles A0, A1 y A2.',
    welcomeMessage: "Hi there! I'm Beyli, your personal English tutor. Don't worry about making mistakes—I'm here to help you practice! How are you doing today?",
  },
  {
    id: 'david',
    name: 'David',
    role: 'Daily Life & Travel Coach',
    avatar: '👨🏻‍💼',
    accent: 'en-GB',
    voicePitch: 0.95,
    voiceRate: 0.95,
    description: 'Acento británico moderno. Conversaciones prácticas de viajes, trabajo y vida cotidiana.',
    welcomeMessage: "Hello! David here. Ready to practice natural British English? Tell me about your plans for this week or where you'd like to travel!",
  },
  {
    id: 'Gema',
    name: 'Gema',
    role: 'Advanced Fluency Mentor',
    avatar: '👩🏻‍💻',
    accent: 'en-US',
    voicePitch: 1.05,
    voiceRate: 1.0,
    description: 'Correcciones avanzadas de modismos, vocabulario rico y debates para niveles B1 a C2.',
    welcomeMessage: "Hey! Gema here. Let's elevate your English to the next level. What topic are you passionate about discussing today?",
  },
];

export const useAiStore = create((set, get) => ({
  activePersona: TUTOR_PERSONAS[0],
  sessionId: null,
  messages: [],
  isLoading: false,
  isSpeaking: false,
  usageStats: {
    interactionsUsed: 0,
    dailyLimit: 20,
    interactionsRemaining: 20,
    resetTime: null,
  },

  setPersona: (persona) => {
    set({
      activePersona: persona,
      messages: [
        {
          id: Date.now(),
          role: 'assistant',
          text: persona.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    });
  },

  fetchUsage: async () => {
    try {
      const res = await api.get('/ai/usage');
      if (res.success && res.data) {
        set({
          usageStats: {
            interactionsUsed: res.data.interactions_used || 0,
            dailyLimit: res.data.daily_limit || 20,
            interactionsRemaining: Math.max(0, (res.data.daily_limit || 20) - (res.data.interactions_used || 0)),
            resetTime: res.data.reset_time,
          },
        });
      }
    } catch (err) {
      console.warn('Could not fetch AI usage:', err.message);
    }
  },

  sendMessage: async (userText, context = '') => {
    if (!userText || !userText.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      text: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentMessages = get().messages;
    set({
      messages: [...currentMessages, userMessage],
      isLoading: true,
    });

    try {
      const res = await api.post('/ai/chat', {
        message: userText.trim(),
        session_id: get().sessionId,
        context: `${context} Tutor Persona: ${get().activePersona.name} (${get().activePersona.role})`,
      });

      if (res.success && res.data) {
        const replyText = res.data.reply || res.data.message || res.data.text || '';
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fromCache: res.data.from_cache,
          provider: res.data.provider,
        };

        set((state) => ({
          sessionId: res.data.session_id || state.sessionId,
          messages: [...state.messages, aiMessage],
          isLoading: false,
          usageStats: {
            ...state.usageStats,
            interactionsUsed: res.data.usage?.interactions_used || state.usageStats.interactionsUsed + 1,
            interactionsRemaining: res.data.usage?.interactions_remaining ?? (state.usageStats.interactionsRemaining - 1),
          },
        }));

        return { success: true, reply: replyText };
      }
      throw new Error(res.message || 'Error en la respuesta de la IA');
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 1,
        role: 'system',
        text: `⚠️ ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set((state) => ({
        messages: [...state.messages, errorMessage],
        isLoading: false,
      }));
      return { success: false, message: err.message };
    }
  },

  clearChat: () => {
    const persona = get().activePersona;
    set({
      sessionId: null,
      messages: [
        {
          id: Date.now(),
          role: 'assistant',
          text: persona.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    });
  },
}));
