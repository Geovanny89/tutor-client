import { useState, useEffect, useRef, useCallback } from 'react';

// Keep the mic open long enough to capture full sentences, but close it
// automatically once the user has clearly stopped talking.
const SILENCE_TIMEOUT_MS = 2500;
const INITIAL_SILENCE_TIMEOUT_MS = 8000;

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
  'vicki', 'ximena', 'serena', 'veena',
];

const voiceGenderOf = (name) => {
  const n = (name || '').toLowerCase();
  if (n.includes('female')) return 'female';
  if (n.includes('male')) return 'male';
  if (FEMALE_VOICE_HINTS.some((h) => n.includes(h))) return 'female';
  if (MALE_VOICE_HINTS.some((h) => n.includes(h))) return 'male';
  return null;
};

/**
 * useVoice Hook
 * Uses 100% FREE Native Web Speech API
 * - SpeechRecognition (Speech-to-Text)
 * - SpeechSynthesis (Text-to-Speech with native English voices)
 */
export function useVoice({
  lang = 'en-US',
  pitch = 1.0,
  rate = 0.95,
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
        resetSilenceTimer(INITIAL_SILENCE_TIMEOUT_MS);
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
        resetSilenceTimer(SILENCE_TIMEOUT_MS);
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
  }, [lang, onResult, onError]);

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

  // Speak text with native voice
  const speak = useCallback(
    (text, customRate = rate, customPitch = pitch, customLang = lang, customGender = null) => {
      if (!('speechSynthesis' in window) || !text) return;

      const cleanText = text
        .replace(/[*_#`~[\]()]/g, '') // remove markdown artifacts
        .trim();

      if (!cleanText) return;

      // Cancel previous speech and resume in case Chrome is stuck in paused state
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = customRate;
      utterance.pitch = customPitch;

      // Get available voices
      let availableVoices = window.speechSynthesis.getVoices();
      if (!availableVoices || availableVoices.length === 0) {
        // Retry getting voices once
        availableVoices = window.speechSynthesis.getVoices() || [];
      }

      const langPrefix = (customLang || 'en').split('-')[0].toLowerCase();
      const langPool = availableVoices.filter((v) =>
        (v.lang || '').toLowerCase().startsWith(langPrefix)
      );
      const enPool = availableVoices.filter((v) => (v.lang || '').toLowerCase().includes('en'));
      const pool = langPool.length ? langPool : enPool;

      // Prefer high-quality neural/online voices, then Google voices.
      const qualityRank = (name) => {
        const n = (name || '').toLowerCase();
        if (n.includes('natural') || n.includes('online')) return 0;
        if (n.includes('google')) return 1;
        return 2;
      };
      const pickFrom = (list) =>
        [...list].sort((a, b) => qualityRank(a.name) - qualityRank(b.name))[0];

      let preferredVoice = null;

      // 1) Same gender as the persona + same accent (e.g. David → male en-GB)
      if (customGender) {
        const gendered = pool.filter((v) => voiceGenderOf(v.name) === customGender);
        if (gendered.length) preferredVoice = pickFrom(gendered);
      }
      // 2) Same gender in any English accent (keeps the persona's voice consistent
      //    when the exact accent has no voice of that gender available)
      if (!preferredVoice && customGender) {
        const genderedEn = enPool.filter((v) => voiceGenderOf(v.name) === customGender);
        if (genderedEn.length) preferredVoice = pickFrom(genderedEn);
      }
      // 3) Any voice with the requested accent
      if (!preferredVoice && pool.length) preferredVoice = pickFrom(pool);
      // 4) Any English voice
      if (!preferredVoice && enPool.length) preferredVoice = pickFrom(enPool);
      // 5) Whatever the browser offers
      if (!preferredVoice) preferredVoice = availableVoices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      } else {
        utterance.lang = customLang || 'en-US';
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        window.__kdiceUtterance = null;
      };
      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis error:', e);
        setIsSpeaking(false);
        window.__kdiceUtterance = null;
      };

      // CRITICAL CHROME BUG FIX: Prevent Garbage Collection of Utterance mid-speech
      window.__kdiceUtterance = utterance;
      currentUtteranceRef.current = utterance;

      // Small timeout to allow cancel() to clear cleanly on Windows
      setTimeout(() => {
        try {
          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.error('Failed to trigger speech:', err);
        }
      }, 50);
    },
    [lang, pitch, rate]
  );

  const stopSpeaking = useCallback(() => {
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
    stopSpeaking,
  };
}
