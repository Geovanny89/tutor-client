/**
 * Bilingual speech helpers for kids voice UX.
 * English keywords are marked by the LLM as [[ENGLISH: word]] so the UI
 * can highlight them and the TTS can switch accent mid-utterance.
 */

const ENGLISH_MARKER_RE = /\[\[ENGLISH:\s*([^\]]+)\]\]/gi;

/**
 * Strips punctuation, symbols and emojis that certain speech synthesizers
 * read aloud (e.g. "estrella", "signo de exclamación", "signo de admiración").
 */
export function cleanForSpeech(text = '') {
  return String(text || '')
    // Remove all unicode emojis and pictographs
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u{1F000}-\u{1FAFF}\u{2000}-\u{2BFF}\u{2600}-\u{27BF}]/gu, '')
    // Explicit star and award symbol purge (stops TTS reading "estrella" / "trofeo")
    .replace(/[⭐🌟★☆✨🌠💫🏆🎉🎈💥🐾🐶]/gu, '')
    // Remove inverted and regular exclamation marks (stops TTS reading "signo de exclamación")
    .replace(/[¡!]/g, '')
    // Remove inverted question marks (stops TTS reading "signo de interrogación")
    .replace(/[¿]/g, '')
    // Replace quotes, brackets, asterisks, tildes, slashes with clean space
    .replace(/[*_#`~"«»[\](){}<>\\/|]/g, ' ')
    // Clean trailing question marks into natural pause if needed, or leave single question mark
    .replace(/\?+/g, '?')
    // Collapse multiple dots or spaces
    .replace(/\.{2,}/g, '.')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Split tutor text into language segments for multilingual TTS.
 * @returns {{ lang: 'es'|'en', text: string }[]}
 */
export function splitBilingualSegments(text = '') {
  if (!text) return [];

  const segments = [];
  let lastIndex = 0;
  let match;
  const re = new RegExp(ENGLISH_MARKER_RE.source, 'gi');

  while ((match = re.exec(text)) !== null) {
    const before = text.slice(lastIndex, match.index).trim();
    if (before) segments.push({ lang: 'es', text: before });
    const english = (match[1] || '').trim();
    if (english) segments.push({ lang: 'en', text: english });
    lastIndex = match.index + match[0].length;
  }

  const rest = text.slice(lastIndex).trim();
  if (rest) segments.push({ lang: 'es', text: rest });

  // No markers → treat whole string as Spanish (kids bilingual default)
  if (segments.length === 0 && text.trim()) {
    segments.push({ lang: 'es', text: text.trim() });
  }

  return segments
    .map((s) => ({
      ...s,
      text: cleanForSpeech(s.text),
    }))
    .filter((s) => s.text);
}

/** Plain text without markers and without TTS-read symbols (for TTS fallback / search). */
export function stripEnglishMarkers(text = '') {
  const withoutMarkers = String(text || '').replace(ENGLISH_MARKER_RE, '$1');
  return cleanForSpeech(withoutMarkers);
}

/**
 * React-friendly nodes: Spanish text + highlighted English chips.
 * Keeps emojis and punctuation for the visual interface.
 * @returns {Array<{ type: 'text'|'en', value: string, key: string }>}
 */
export function tokenizeEnglishMarkers(text = '') {
  const parts = [];
  let lastIndex = 0;
  let match;
  let i = 0;
  const re = new RegExp(ENGLISH_MARKER_RE.source, 'gi');

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index), key: `t${i++}` });
    }
    parts.push({ type: 'en', value: (match[1] || '').trim(), key: `e${i++}` });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex), key: `t${i++}` });
  }

  if (parts.length === 0 && text) {
    parts.push({ type: 'text', value: text, key: 't0' });
  }

  return parts;
}
