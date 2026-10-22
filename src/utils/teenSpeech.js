/**
 * teenSpeech.js
 * Utilidad de síntesis de voz en inglés para misiones y juegos de Teens.
 */
export function playEnglishPhrase(text) {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();
    // Limpiar marcadores y emojis
    const clean = String(text)
      .replace(/\[\[ENGLISH:\s*([^\]]+)\]\]/gi, '$1')
      .replace(/\p{Extended_Pictographic}/gu, '')
      .replace(/[⭐🌟★☆✨🌠💫🏆🎉🎈💥🐾🐶👹💀🗡️🏹🏃🎤🧩🔡♟️🛡️]/gu, '')
      .trim();

    if (!clean) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('David') ||
          v.name.includes('Jenny'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (enVoice) utterance.voice = enVoice;

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech error:', err);
  }
}
