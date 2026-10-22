import { create } from 'zustand';
import api from '../services/api';
import { useAuthStore } from './authStore';

export const TUTOR_PERSONAS = [
  {
    id: 'toby',
    name: 'Toby',
    role: 'Perro Explorador',
    avatar: '🐶',
    accent: 'es-MX',
    // Prefer warm LatAm neural (Dalia/Sabina); gender left flexible for quality
    voiceGender: 'female',
    voicePitch: 1.08,
    voiceRate: 0.88,
    bilingual: true,
    kidsOnly: true,
    description: 'Español latino + palabras en inglés. Adivinanzas y vocabulario para niños de 5 a 9 años.',
    welcomeMessage: '¡Woof woof! 🐶 ¡Hola! Soy Toby el perro explorador. ¿Listo para aprender inglés jugando?',
    welcomeMessageKids: '¡Woof woof! 🐶 ¡Hola amiguito! Soy Toby. Adivina: ¿de qué color es el sol? Se dice [[ENGLISH: YELLOW]]. ¡Repite conmigo!',
  },
  {
    id: 'beyli',
    name: 'Beyli',
    role: 'Friendly Native Tutor',
    avatar: '👩🏼‍🏫',
    accent: 'en-US',
    voiceGender: 'female',
    voicePitch: 1.0,
    voiceRate: 0.9,
    bilingual: false,
    description: 'Habla con paciencia y ritmo claro. Ideal para niveles A0, A1 y A2.',
    welcomeMessage: "Hi there! I'm Beyli, your personal English tutor. Don't worry about making mistakes—I'm here to help you practice! How are you doing today?",
    welcomeMessageKids: "Hello! 👋 I am Beyli. Look! 🍎 How are you?",
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
    bilingual: false,
    description: 'Acento británico moderno. Conversaciones prácticas de viajes, trabajo y vida cotidiana.',
    welcomeMessage: "Hello! David here. Ready to practice natural British English? Tell me about your plans for this week or where you'd like to travel!",
    welcomeMessageKids: "Hi! 🦁 I am David. I like lions. And you?",
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
    bilingual: false,
    description: 'Correcciones avanzadas de modismos, vocabulario rico y debates para niveles B1 a C2.',
    welcomeMessage: "Hey! Gema here. Let's elevate your English to the next level. What topic are you passionate about discussing today?",
    welcomeMessageKids: "Hello! 🎨 I am Gema. Do you like colors?",
  },
];

/** Personas visibles según edad del estudiante */
export const getPersonasForAge = (ageRange) => {
  if (ageRange === 'kids') {
    return TUTOR_PERSONAS.filter((p) => p.kidsOnly || p.id === 'beyli');
  }
  return TUTOR_PERSONAS.filter((p) => !p.kidsOnly);
};

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
  showAdModal: false,
  adToPlay: null,

  setAdModal: (show, ad = null) => set({ showAdModal: show, adToPlay: ad }),

  checkTokensAndTriggerAd: async () => {
    if (get().usageStats.interactionsRemaining > 0) return true;

    // Los estudiantes de una academia no ven publicidad: al agotar sus tokens
    // la IA queda bloqueada hasta el día siguiente (la academia ya paga la plataforma).
    if (useAuthStore.getState().user?.tenant?.is_academy) return false;

    try {
      const [t, a] = await Promise.all([api.get('/ads/tokens'), api.get('/ads')]);
      if (t.success && a.success) {
        const ads = a.data.ads || [];
        const tokens = t.data;
        const promoAd = ads.find((ad) => ad.kind === 'promo');
        const extraAds = ads.filter((ad) => ad.kind === 'extra');
        const ad = (tokens.can_watch_promo && promoAd) ? promoAd : extraAds[0];
        
        if (ad && (tokens.can_watch_promo || tokens.can_watch_extra)) {
          set({ showAdModal: true, adToPlay: ad });
          return false;
        }
      }
    } catch (err) { /* ignore */ }
    return false;
  },

  setPersona: (persona) => {
    const isKids = useAuthStore.getState().user?.age_range === 'kids';
    const welcome = isKids ? (persona.welcomeMessageKids || persona.welcomeMessage) : persona.welcomeMessage;
    
    set({
      activePersona: persona,
      sessionId: null,
      messages: [
        {
          id: Date.now(),
          role: 'assistant',
          text: welcome,
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

    // Check tokens before sending
    const hasTokens = await get().checkTokensAndTriggerAd();
    if (!hasTokens) {
      // If modal was triggered, we return a special status
      if (get().showAdModal) {
        return { success: false, message: 'out_of_tokens_trigger_ad' };
      }
      const isAcademy = useAuthStore.getState().user?.tenant?.is_academy;
      return {
        success: false,
        message: isAcademy
          ? 'Alcanzaste tu límite diario de IA. Vuelve mañana para seguir practicando.'
          : 'No te quedan tokens de IA hoy. Mira un video en la sección de Recompensas para ganar más.',
      };
    }

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
      const ageRange = useAuthStore.getState().user?.age_range || 'adults';
      const res = await api.post('/ai/chat', {
        message: userText.trim(),
        session_id: get().sessionId,
        mode: activePersona.bilingual ? 'kids_bilingual' : tutorMode,
        domain,
        persona: `${activePersona.name} (${activePersona.role})`,
        persona_name: activePersona.name,
        persona_role: activePersona.role,
        bilingual: !!activePersona.bilingual,
        age_range: ageRange,
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
            dailyLimit: res.data.ai_limit || state.usageStats.dailyLimit,
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
    const isKids = useAuthStore.getState().user?.age_range === 'kids';
    const welcome = isKids ? (persona.welcomeMessageKids || persona.welcomeMessage) : persona.welcomeMessage;

    set({
      sessionId: null,
      messages: [
        {
          id: Date.now(),
          role: 'assistant',
          text: welcome,
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
