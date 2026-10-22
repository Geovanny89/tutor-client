import { useState, useEffect, useRef, useCallback } from 'react';
import { splitBilingualSegments, stripEnglishMarkers, cleanForSpeech } from '../utils/bilingualSpeech';

// Keep the mic open long enough to capture full sentences, but close it
// automatically once the user has clearly stopped talking.
// Kids need a longer pause (spanglish / slow answers) — default 2.5–3s.
const DEFAULT_SILENCE_TIMEOUT_MS = 2500;
const DEFAULT_INITIAL_SILENCE_TIMEOUT_MS = 8000;

// Name hints used to infer the gender of a browser voice so each tutor
// persona keeps a consistent voice.
const MALE_VOICE_HINTS = [
  'david', 'mark', 'george', 'daniel', 'alex', 'fred', 'guy', 'ryan', 'male',
  'oliver', 'thomas', 'james', 'roger', 'christopher', 'brian', 'eric', 'liam',
  'matthew', 'william', 'aaron', 'nathan', 'gordon', 'steffan', 'rishi',
  'arthur', 'andrew', 'brandon', 'jason', 'kevin', 'justin', 'joey', 'elliot',
];
const FEMALE_VOICE_HINTS = [
  'zira', 'hazel', 'samantha', 'karen', 'susan', 'female', 'victoria', 'tessa',
  'moira', 'fiona', 'aria', 'jenny', 'michelle', 'emma', 'sonia', 'libby',
  'sara', 'catherine', 'allison', 'ava', 'joanna', 'kendra', 'kimberly',
  'salli', 'nicole', 'olivia', 'clara', 'emily', 'linda', 'heather', 'amber',
  'ashley', 'jessa', 'misty', 'kayla', 'courtney', 'monica', 'paulina',
  'vicki', 'ximena', 'serena', 'veena', 'dalia', 'sabina', 'salome', 'luciana',
  'maria', 'sofia', 'camila', 'valentina', 'isabella',
];

// Known warm Latin American Spanish voices (Chrome/Edge/Windows).
const LATAM_VOICE_NAME_BONUS = [
  'dalia', 'sabina', 'salome', 'jorge', 'carlos', 'juan', 'raul', 'luciana',
  'paulina', 'ximena', 'catalina', 'gerardo', 'ricardo', 'andres', 'camila',
  'google español de estados unidos', 'google español', 'microsoft dalia',
  'microsoft sabina', 'microsoft salome', 'microsoft jorge',
];

// Spain / robotic desktop voices to avoid for kids bilingual UX.
const AVOID_VOICE_HINTS = [
  'helena', 'laura', 'enrique', 'pablo', 'desktop', 'compact', 'mobile',
  'es-es', 'españa', 'spain', 'castilian',
];

const LATAM_LANG_PREFIXES = [
  'es-mx', 'es-co', 'es-us', 'es-ar', 'es-cl', 'es-pe', 'es-ve', 'es-cr',
  'es-ec', 'es-uy', 'es-pa', 'es-gt', 'es-hn', 'es-ni', 'es-bo', 'es-py', 'es-do',
];

const voiceGenderOf = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('female')) return 'female';
  if (n.includes('male')) return 'male';
  if (FEMALE_VOICE_HINTS.some((h) => n.includes(h))) return 'female';
  if (MALE_VOICE_HINTS.some((h) => n.includes(h))) return 'male';
  return null;
};

const isLatamLang = (lang = '') => {
  const l = lang.toLowerCase();
  return LATAM_LANG_PREFIXES.some((p) => l.startsWith(p));
};

/**
 * Score a voice for warm Latin American Spanish (higher = better).
 * Penalizes Spain accents and local "Desktop" robotic voices.
 */
const scoreLatinSpanishVoice = (voice, preferredGender = null) => {
  const name = (voice.name || '').toLowerCase();
  const lang = (voice.lang || '').toLowerCase();
  let score = 0;

  if (isLatamLang(lang)) score += 120;
  if (lang.startsWith('es-mx')) score += 40; // warm neutral LatAm (Dalia)
  if (lang.startsWith('es-co')) score += 45; // Colombia
  if (lang.startsWith('es-us')) score += 35; // Google US Spanish = LatAm
  if (lang === 'es' || lang.startsWith('es-419')) score += 25;

  // Neural / cloud voices sound natural; desktop locals sound robotic.
  if (name.includes('natural') || name.includes('neural')) score += 100;
  if (name.includes('online')) score += 90;
  if (name.includes('google')) score += 70;
  if (name.includes('microsoft') && (name.includes('online') || name.includes('natural'))) {
    score += 80;
  }

  if (LATAM_VOICE_NAME_BONUS.some((h) => name.includes(h))) score += 50;

  if (preferredGender && voiceGenderOf(name) === preferredGender) score += 15;

  // Hard penalties
  if (lang.startsWith('es-es')) score -= 150;
  if (AVOID_VOICE_HINTS.some((h) => name.includes(h) || lang.includes(h))) score -= 120;
  if (name.includes('desktop') || name.includes('compact')) score -= 100;

  // Non-Spanish should never win for Spanish segments
  if (!lang.startsWith('es')) score -= 500;

  return score;
};

const pickBestLatinSpanishVoice = (availableVoices, preferredGender = null) => {
  const spanish = availableVoices.filter((v) => (v.lang || '').toLowerCase().startsWith('es'));
  if (!spanish.length) return null;

  const ranked = [...spanish].sort(
    (a, b) => scoreLatinSpanishVoice(b, preferredGender) - scoreLatinSpanishVoice(a, preferredGender)
  );

  const best = ranked[0];
  // If the "best" is still a Spain/desktop voice, try again ignoring gender.
  if (best && scoreLatinSpanishVoice(best, null) < 50 && preferredGender) {
    return [...spanish].sort(
      (a, b) => scoreLatinSpanishVoice(b, null) - scoreLatinSpanishVoice(a, null)
    )[0];
  }
  return best;
};

/**
 * useVoice Hook
 * Uses 100% FREE Native Web Speech API
 * - SpeechRecognition (Speech-to-Text) with es-CO / en-US
 * - SpeechSynthesis (Text-to-Speech) with bilingual segment switching
 */
export function useVoice({
  lang = 'en-US',
  pitch = 1.0,
  rate = 0.95,
  /** Post-speech silence before auto-stop (kids: 2800–3000). */
  silenceTimeoutMs = DEFAULT_SILENCE_TIMEOUT_MS,
  /** Wait before first word before giving up. */
  initialSilenceTimeoutMs = DEFAULT_INITIAL_SILENCE_TIMEOUT_MS,
  onResult,
  onError,
} = {}) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState([]);

  const recognitionRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const bilingualQueueRef = useRef([]);
  const bilingualActiveRef = useRef(false);

  // Check support and load voices
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition && 'speechSynthesis' in window);

    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      }
    };

    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // ignore
        }
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize Speech Recognition
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      if (onError) onError('El reconocimiento de voz no está soportado en este navegador.');
      return;
    }

    // Stop ongoing speech before listening
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = lang;
      // Keep listening across short pauses so the student can finish the whole
      // sentence (e.g. "hola, ¿cómo estás?") instead of only the first word.
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Accumulates every finalized fragment of the current turn.
      let finalText = '';

      const clearSilenceTimer = () => {
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      };

      // Auto-stop after a pause; the accumulated text is emitted on recognition end.
      const resetSilenceTimer = (delay) => {
        clearSilenceTimer();
        silenceTimerRef.current = setTimeout(() => {
          try {
            recognition.stop();
          } catch (e) {
            // ignore
          }
        }, delay);
      };

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setInterimTranscript('');
        resetSilenceTimer(initialSilenceTimeoutMs);
      };

      recognition.onresult = (event) => {
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            finalText += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        setTranscript(finalText);
        setInterimTranscript(interim);
        // The user is still talking: keep the mic open a little longer.
        resetSilenceTimer(silenceTimeoutMs);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech' && onError) {
          onError(`Error de micrófono: ${event.error}`);
        }
      };

      recognition.onend = () => {
        clearSilenceTimer();
        setIsListening(false);
        const spoken = finalText.trim();
        finalText = '';
        setInterimTranscript('');
        if (spoken) {
          setTranscript(spoken);
          if (onResult) onResult(spoken);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      if (onError) onError(err.message);
    }
  }, [lang, silenceTimeoutMs, initialSilenceTimeoutMs, onResult, onError]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
      setIsListening(false);
    }
  }, []);

  const pickVoice = useCallback((availableVoices, customLang, customGender) => {
    const langPrefix = (customLang || 'en').split('-')[0].toLowerCase();
    const langFull = (customLang || 'en-US').toLowerCase();

    // Spanish: always prefer warm Latin American neural voices (never Spain Desktop).
    if (langPrefix === 'es') {
      const latam = pickBestLatinSpanishVoice(availableVoices, customGender);
      if (latam) return latam;
    }

    const exactPool = availableVoices.filter((v) => (v.lang || '').toLowerCase() === langFull);
    const langPool = availableVoices.filter((v) =>
      (v.lang || '').toLowerCase().startsWith(langPrefix)
    );
    const enPool = availableVoices.filter((v) => (v.lang || '').toLowerCase().startsWith('en'));
    const pool = exactPool.length ? exactPool : (langPool.length ? langPool : enPool);

    const qualityRank = (name) => {
      const n = (name || '').toLowerCase();
      // Expressive child-friendly & animated neural voices first
      if (n.includes('salome') || n.includes('dalia') || n.includes('jenny') || n.includes('aria') || n.includes('ana')) return -2;
      if (n.includes('natural') || n.includes('online') || n.includes('neural')) return 0;
      if (n.includes('google')) return 1;
      if (n.includes('samantha') || n.includes('victoria')) return 1;
      if (n.includes('microsoft') && !n.includes('desktop')) return 2;
      if (n.includes('desktop') || n.includes('compact') || n.includes('mobile')) return 9;
      return 3;
    };
    const pickFrom = (list) =>
      [...list].sort((a, b) => qualityRank(a.name) - qualityRank(b.name))[0];

    let preferredVoice = null;
    if (customGender) {
      const gendered = pool.filter((v) => voiceGenderOf(v.name) === customGender);
      if (gendered.length) preferredVoice = pickFrom(gendered);
    }
    if (!preferredVoice && customGender && langPrefix === 'en') {
      const genderedEn = enPool.filter((v) => voiceGenderOf(v.name) === customGender);
      if (genderedEn.length) preferredVoice = pickFrom(genderedEn);
    }
    if (!preferredVoice && pool.length) preferredVoice = pickFrom(pool);
    if (!preferredVoice && enPool.length) preferredVoice = pickFrom(enPool);
    if (!preferredVoice) preferredVoice = availableVoices[0];
    return preferredVoice;
  }, []);

  const resolveVoices = useCallback(() => {
    let list = window.speechSynthesis.getVoices() || [];
    if (!list.length && voices.length) list = voices;
    return list;
  }, [voices]);

  // Speak text with a single native voice (markers stripped)
  const speak = useCallback(
    (text, customRate = rate, customPitch = pitch, customLang = lang, customGender = null, onEnd = null) => {
      if (!('speechSynthesis' in window) || !text) return;

      bilingualQueueRef.current = [];
      bilingualActiveRef.current = false;

      const cleanText = stripEnglishMarkers(text);
      if (!cleanText) {
        if (onEnd) onEnd();
        return;
      }

      const run = (availableVoices) => {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = customRate;
        utterance.pitch = customPitch;

        const preferredVoice = pickVoice(availableVoices, customLang, customGender);
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          const vLang = (preferredVoice.lang || '').toLowerCase();
          // Keep LatAm locale for Spanish even if voice reports generic "es"
          if ((customLang || '').toLowerCase().startsWith('es')) {
            utterance.lang = isLatamLang(vLang) ? preferredVoice.lang : (customLang || 'es-MX');
          } else {
            utterance.lang = preferredVoice.lang;
          }
        } else {
          utterance.lang = customLang || 'en-US';
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          window.__kdiceUtterance = null;
          if (onEnd) {
            try { onEnd(); } catch (e) {}
          }
        };
        utterance.onerror = (e) => {
          console.warn('SpeechSynthesis error:', e);
          setIsSpeaking(false);
          window.__kdiceUtterance = null;
          if (onEnd) {
            try { onEnd(); } catch (err) {}
          }
        };

        window.__kdiceUtterance = utterance;
        currentUtteranceRef.current = utterance;

        setTimeout(() => {
          try {
            window.speechSynthesis.speak(utterance);
          } catch (err) {
            console.error('Failed to trigger speech:', err);
          }
        }, 50);
      };

      let availableVoices = resolveVoices();
      // Chrome often returns [] on first call — wait briefly for neural/online voices
      if (!availableVoices.length) {
        setTimeout(() => run(resolveVoices()), 280);
        return;
      }
      run(availableVoices);
    },
    [lang, pitch, rate, pickVoice, resolveVoices]
  );

  /**
   * Multilingual TTS: Spanish latino for narrative + native English for [[ENGLISH:]] words.
   * Avoids robotic Spanglish accent by switching browser voices mid-reply.
   */
  const speakBilingual = useCallback(
    (text, {
      // Upbeat, warm and lively Latin American Spanish (never dragging/bored)
      esRate = 1.02,
      esPitch = 1.30,
      esLang = 'es-MX',
      enRate = 0.98,
      enPitch = 1.35,
      enLang = 'en-US',
      gender = null, // null = pick best LatAm neural (quality over gender)
      onEnd = null,
    } = {}) => {
      if (!('speechSynthesis' in window) || !text) {
        if (onEnd) onEnd();
        return;
      }

      const segments = splitBilingualSegments(text);
      if (!segments.length) {
        if (onEnd) onEnd();
        return;
      }

      // Wait for voices if Chrome hasn't loaded them yet
      let availableVoices = window.speechSynthesis.getVoices() || [];
      if (!availableVoices.length) {
        availableVoices = voices.length ? voices : window.speechSynthesis.getVoices() || [];
      }

      // Fallback: no markers → single Spanish utterance with LatAm voice
      if (segments.length === 1 && segments[0].lang === 'es' && !/\[\[ENGLISH:/i.test(text)) {
        speak(segments[0].text, esRate, esPitch, esLang, gender, onEnd);
        return;
      }

      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();

      bilingualActiveRef.current = true;
      bilingualQueueRef.current = segments;

      // Pre-select the best LatAm Spanish voice once for consistency
      const latamVoice = pickBestLatinSpanishVoice(availableVoices, gender)
        || pickVoice(availableVoices, esLang, gender);

      const speakNext = () => {
        if (!bilingualActiveRef.current) return;
        const next = bilingualQueueRef.current.shift();
        if (!next) {
          setIsSpeaking(false);
          bilingualActiveRef.current = false;
          window.__kdiceUtterance = null;
          if (onEnd) {
            try { onEnd(); } catch (err) { console.error(err); }
          }
          return;
        }

        const isEn = next.lang === 'en';
        const spokenContent = cleanForSpeech(next.text);
        if (!spokenContent) {
          speakNext();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(spokenContent);
        utterance.rate = isEn ? enRate : esRate;
        utterance.pitch = isEn ? enPitch : esPitch;

        if (isEn) {
          const preferred = pickVoice(availableVoices, enLang, gender);
          if (preferred) {
            utterance.voice = preferred;
            utterance.lang = preferred.lang;
          } else {
            utterance.lang = enLang;
          }
        } else if (latamVoice) {
          utterance.voice = latamVoice;
          // Force LatAm locale even if the voice reports a generic "es"
          const vLang = (latamVoice.lang || '').toLowerCase();
          utterance.lang = isLatamLang(vLang) ? latamVoice.lang : (esLang || 'es-MX');
        } else {
          utterance.lang = esLang || 'es-MX';
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setTimeout(speakNext, 90);
        };
        utterance.onerror = () => {
          setTimeout(speakNext, 40);
        };

        window.__kdiceUtterance = utterance;
        currentUtteranceRef.current = utterance;
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error('Bilingual TTS failed:', err);
          speakNext();
        }
      };

      setTimeout(speakNext, 50);
    },
    [speak, pickVoice, voices]
  );

  const stopSpeaking = useCallback(() => {
    bilingualQueueRef.current = [];
    bilingualActiveRef.current = false;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    isSupported,
    voices,
    startListening,
    stopListening,
    speak,
    speakBilingual,
    stopSpeaking,
  };
}
