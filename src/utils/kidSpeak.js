/**
 * Toby-style speech engine for kids games:
 * - Dynamic Latin American Spanish narrative (warm, energetic, crystal-clear cartoon articulation)
 * - Clear, high-pitch native US English keywords in [[ENGLISH: word]] markers
 * - Never drags or sounds bored: cartoon puppy pitch and lively tempo!
 */

import { kidAudio } from './kidAudio';

export const TOBY_PHRASES = {
  listenIntro: (word) =>
    `¡Guau guau! ¡Aventura! ¿Dónde se esconde [[ENGLISH: ${word}]]? ¡Toca rápido [[ENGLISH: ${word}]]!`,
  listenCorrect: (word) =>
    `¡Yuuupiii! ¡Excelente trabajo! ¡Se dice [[ENGLISH: ${word}]]! Repite fuerte conmigo: [[ENGLISH: ${word}]]!`,
  listenWrong: (word) =>
    `¡Oh oh! ¡Casi casi! Escucha de nuevo: estamos buscando [[ENGLISH: ${word}]]. ¡Tú puedes, amiguito!`,

  bubblePrompt: (word) =>
    `¡Wuuuf! ¡Explota la burbuja mágica con [[ENGLISH: ${word}]]! ¡Rápido, atrápala!`,
  bubblePopped: (word) =>
    `¡Pop pop! ¡Genial, reventaste [[ENGLISH: ${word}]]! ¡Súper campeón!`,
  bubbleWrong: (word) =>
    `¡Ups, esa burbuja no era! ¡Busca donde dice [[ENGLISH: ${word}]]!`,

  memoryIntro: () =>
    `¡Yaaay! ¡Juguemos a las Parejas Mágicas! Toca una carta para descubrir la sorpresa.`,
  memoryFlip: (word) =>
    `¡Mira qué lindo, es [[ENGLISH: ${word}]]! ¿Dónde estará el otro [[ENGLISH: ${word}]]?`,
  memoryMatch: (word) =>
    `¡Guau guau! ¡Hiciste match con [[ENGLISH: ${word}]]! ¡Eres increíble!`,
  memoryMiss: (word) =>
    `¡Casi! Son diferentes, pero acuérdate bien dónde estaba [[ENGLISH: ${word}]].`,
  memoryWin: () =>
    `¡Woooohoooo! ¡Encontraste todas las parejas mágicas! ¡Eres el mejor explorador del mundo!`,

  explorerIntro: () =>
    `¡Hola explorador! Toca cualquier dibujo de la pizarra mágica y te enseñaré a decirlo en inglés.`,
  explorerWord: (word, soundText = '') =>
    soundText
      ? `¡Escucha! Se dice [[ENGLISH: ${word}]], y suena [[ENGLISH: ${soundText}]]. ¡Dilo conmigo: [[ENGLISH: ${word}]]!`
      : `¡Guau! En inglés se dice [[ENGLISH: ${word}]]. ¡Repite conmigo: [[ENGLISH: ${word}]]!`,
  explorerSlow: (word) =>
    `¡Modo tortuguita activado! Escucha con calma: [[ENGLISH: ${word}]].`,
};

/**
 * @param {object} voice - { speak, speakBilingual } from useVoice
 */
export function createKidSpeak({ speak, speakBilingual }) {
  // Voice energy profiles so Toby never sounds bored or sluggish
  const getEnergyParams = (style = 'cartoon', slow = false) => {
    if (slow) {
      return {
        esRate: 0.82,
        esPitch: 1.18,
        enRate: 0.80,
        enPitch: 1.22,
      };
    }

    switch (style) {
      case 'sweet':
        return {
          esRate: 0.98,
          esPitch: 1.25,
          enRate: 0.94,
          enPitch: 1.28,
        };
      case 'cartoon':
      default:
        // Ultra-cheerful cartoon character: animated, vibrant, high-energy
        return {
          esRate: 1.04,
          esPitch: 1.34,
          enRate: 1.00,
          enPitch: 1.38,
        };
    }
  };

  /**
   * Main speech method: speaks complete bilingual Toby phrases
   * automatically switching accents between LatAm Spanish and Native US English.
   */
  const speakToby = (phrase, { slow = false, style = 'cartoon', withBark = true, onEnd = null } = {}) => {
    if (!phrase) {
      if (onEnd) onEnd();
      return;
    }

    // Optional short cartoon puppy sound cue before speaking
    if (withBark && !slow) {
      try {
        kidAudio.playTobyBark();
      } catch (e) {}
    }

    const { esRate, esPitch, enRate, enPitch } = getEnergyParams(style, slow);

    if (speakBilingual) {
      // Short 120ms pause after bark so the voice starts crisply
      setTimeout(() => {
        speakBilingual(phrase, {
          esRate,
          esPitch,
          esLang: 'es-MX',
          enRate,
          enPitch,
          enLang: 'en-US',
          gender: null,
          onEnd,
        });
      }, withBark && !slow ? 120 : 0);
      return;
    }

    const clean = phrase.replace(/\[\[ENGLISH:\s*([^\]]+)\]\]/gi, '$1');
    speak(clean, esRate, esPitch, 'es-MX', null, onEnd);
  };

  const speakSpanish = (text, slow = false) => {
    speakToby(text, { slow, withBark: false });
  };

  const speakEnglish = (text, rateOrSlow = 1.0) => {
    if (!text) return;
    const rate =
      typeof rateOrSlow === 'boolean'
        ? (rateOrSlow ? 0.82 : 1.0)
        : (Number(rateOrSlow) || 1.0);
    // High-pitched bright US English
    speak(text, rate, 1.36, 'en-US', 'female');
  };

  const speakPromptThenWord = (spanishLine, englishWord) => {
    if (englishWord) {
      speakToby(`¡Guau guau! ¿Dónde se esconde [[ENGLISH: ${englishWord}]]? ¡Toca [[ENGLISH: ${englishWord}]]!`);
    } else {
      speakToby(spanishLine || '¡Guau guau! ¡Vamos a jugar!');
    }
  };

  return {
    speakToby,
    speakSpanish,
    speakEnglish,
    speakPromptThenWord,
    phrases: TOBY_PHRASES,
  };
}
