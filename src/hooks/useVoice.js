import { useState, useEffect, useRef, useCallback } from 'react';

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
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
        setInterimTranscript('');
      };

      recognition.onresult = (event) => {
        let final = '';
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item.isFinal) {
            final += item[0].transcript;
          } else {
            interim += item[0].transcript;
          }
        }

        if (final) {
          setTranscript(final);
          setInterimTranscript('');
          if (onResult) onResult(final);
        } else {
          setInterimTranscript(interim);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech' && onError) {
          onError(`Error de micrófono: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
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
    (text, customRate = rate, customPitch = pitch, customLang = lang) => {
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

      // Find best English voice
      const preferredVoice =
        availableVoices.find(
          (v) =>
            v.lang.toLowerCase().startsWith(langPrefix) &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Daniel') ||
              v.name.includes('Karen') ||
              v.name.includes('Arthur') ||
              v.name.includes('Zira') ||
              v.name.includes('David') ||
              v.name.includes('Mark'))
        ) ||
        availableVoices.find((v) => v.lang.toLowerCase().startsWith(langPrefix)) ||
        availableVoices.find((v) => v.lang.toLowerCase().includes('en')) ||
        availableVoices[0];

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
