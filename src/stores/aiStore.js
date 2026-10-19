import { create } from 'zustand';
import api from '../services/api';

export const TUTOR_PERSONAS = [
  {
    id: 'beyli',
    name: 'Beyli',
    role: 'Friendly Native Tutor',
    avatar: '👩🏼‍🏫',
    accent: 'en-US',
    voiceGender: 'female',
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
    voiceGender: 'male',
    voicePitch: 0.95,
    voiceRate: 0.95,
    description: 'Acento británico moderno. Conversaciones prácticas de viajes, trabajo y vida cotidiana.',
    welcomeMessage: "Hello! David here. Ready to practice natural British English? Tell me about your plans for this week or where you'd like to travel!",
  },
  {
    id: 'gema',
    name: 'Gema',
    role: 'Advanced Fluency Mentor',
    avatar: '👩🏻‍💻',
    accent: 'en-US',
    voiceGender: 'female',
    voicePitch: 1.05,
    voiceRate: 1.0,
    description: 'Correcciones avanzadas de modismos, vocabulario rico y debates para niveles B1 a C2.',
    welcomeMessage: "Hey! Gema here. Let's elevate your English to the next level. What topic are you passionate about discussing today?",
  },
];

export const TUTOR_MODES = [
  {
    id: 'conversation',
    name: 'Fluidez',
    description: 'Conversación libre para ganar soltura, con correcciones suaves.',
    icon: '💬',
  },
  {
    id: 'technical',
    name: 'Inglés técnico',
    description: 'Inglés profesional: reuniones, correos, código, negociación.',
    icon: '🛠️',
  },
];

export const useAiStore = create((set, get) => ({
  activePersona: TUTOR_PERSONAS[0],
  tutorMode: 'conversation',
  domain: 'software engineering and business English',
  sessionId: null,
  messages: [],
  isLoading: false,
  isSpeaking: false,
  connected: null, // null = unknown, true/false once checked
  translatingId: null,
  usageStats: {
    interactionsUsed: 0,
    dailyLimit: 20,
    interactionsRemaining: 20,
    resetTime: null,
  },

  setPersona: (persona) => {
    set({
      activePersona: persona,
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

  setTutorMode: (tutorMode) => {
    set({ tutorMode, sessionId: null });
  },

  setDomain: (domain) => set({ domain }),

  // Verify whether the AI provider is actually reachable ("online/offline" indicator)
  checkStatus: async () => {
    try {
      const res = await api.get('/ai/status');
      if (res.success && res.data) {
        set({ connected: !!res.data.connected });
        return res.data;
      }
      set({ connected: false });
      return null;
    } catch (err) {
      set({ connected: false });
      return null;
    }
  },

  fetchUsage: async () => {
    try {
      const res = await api.get('/ai/usage');
      if (res.success && res.data) {
        set({
          usageStats: {
            interactionsUsed: res.data.used || 0,
            dailyLimit: res.data.limit || 20,
            interactionsRemaining: res.data.remaining ?? 20,
            resetTime: res.data.reset_at,
          },
        });
      }
    } catch (err) {
      console.warn('Could not fetch AI usage:', err.message);
    }
  },

  /**
   * @param {string} userText - what the student said
   * @param {object} options - { context } optional extra context (e.g. lesson title)
   */
  sendMessage: async (userText, options = {}) => {
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
      const { activePersona, tutorMode, domain } = get();
      const res = await api.post('/ai/chat', {
        message: userText.trim(),
        session_id: get().sessionId,
        mode: tutorMode,
        domain,
        persona: `${activePersona.name} (${activePersona.role})`,
        context: options.context || '',
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
          degraded: res.data.connected === false,
        };

        set((state) => ({
          sessionId: res.data.session_id || state.sessionId,
          messages: [...state.messages, aiMessage],
          isLoading: false,
          connected: res.data.connected ?? state.connected,
          usageStats: {
            ...state.usageStats,
            interactionsUsed: res.data.ai_limit
              ? res.data.ai_limit - res.data.ai_remaining
              : state.usageStats.interactionsUsed + 1,
            interactionsRemaining:
              res.data.ai_remaining ?? Math.max(0, state.usageStats.interactionsRemaining - 1),
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

  translateMessage: async (messageId, text) => {
    if (!text || !text.trim()) return;
    set({ translatingId: messageId });

    try {
      const res = await api.post('/ai/translate', { text: text.trim() });
      if (res.success && res.data) {
        const translation = res.data.text;
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === messageId ? { ...m, translation } : m
          ),
          translatingId: null,
        }));
        return { success: true, translation };
      }
      throw new Error(res.message || 'Error al traducir');
    } catch (err) {
      console.error('Translation error:', err.message);
      set({ translatingId: null });
      return { success: false, message: err.message };
    }
  },
}));
