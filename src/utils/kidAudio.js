/**
 * Web Audio API synthesizer for kid-friendly sound effects.
 * 100% client-side, zero external files, instantaneous and works offline.
 */

class KidAudioPlayer {
  constructor() {
    this.ctx = null;
  }

  getAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Cute bubble pop sound
  playPop() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  }

  // Cheerful chime when matching or getting a correct answer
  playSuccess() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const start = now + idx * 0.07;
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.36);
      });
    } catch (e) {}
  }

  // Gentle, non-punishing boop for trying again
  playTryAgain() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(200, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  // Playful puppy woof chime for Toby
  playTobyBark() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Two cute, short cartoon puppy yips
      [0, 0.12].forEach((offset) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const t = now + offset;
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(740, t + 0.05);
        osc.frequency.exponentialRampToValueAtTime(480, t + 0.09);

        gain.gain.setValueAtTime(0.22, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.1);
      });
    } catch (e) {}
  }

  // Magical sparkle sound for speech cue
  playSparkle() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const notes = [659.25, 880, 1046.5, 1318.5]; // E5, A5, C6, E6
      const now = ctx.currentTime;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = now + idx * 0.04;
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.21);
      });
    } catch (e) {}
  }

  // Card flip whoosh
  playFlip() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.06);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {}
  }

  // Victory fanfare for completing a game
  playVictory() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const chord = [523.25, 659.25, 783.99, 1046.5]; // C major
      const now = ctx.currentTime;

      // Arpeggio
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.value = freq;

        const start = now + idx * 0.1;
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.52);
      });

      // Final celebration chord
      setTimeout(() => {
        const chordNow = ctx.currentTime;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, chordNow);
          gain.gain.exponentialRampToValueAtTime(0.001, chordNow + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(chordNow);
          osc.stop(chordNow + 0.82);
        });
      }, 450);
    } catch (e) {}
  }
}

export const kidAudio = new KidAudioPlayer();
