import { useRef, useState, useCallback, useEffect } from "react";

/**
 * Romantic chord progression: Am → F → C → G
 * Each chord is an array of frequencies (Hz).
 */
const CHORDS: number[][] = [
  [220.0, 261.63, 329.63], // Am  (A3, C4, E4)
  [174.61, 220.0, 261.63], // F   (F3, A3, C4)
  [261.63, 329.63, 392.0], // C   (C4, E4, G4)
  [196.0, 246.94, 293.66], // G   (G3, B3, D4)
];

/** Melody notes that float above the chords (pentatonic-ish) */
const MELODY: { freq: number; duration: number; delay: number }[] = [
  { freq: 523.25, duration: 1.2, delay: 0.0 }, // C5
  { freq: 493.88, duration: 0.8, delay: 1.3 }, // B4
  { freq: 440.0, duration: 1.0, delay: 2.2 },  // A4
  { freq: 392.0, duration: 1.4, delay: 3.3 },  // G4
  { freq: 440.0, duration: 0.6, delay: 4.8 },  // A4
  { freq: 523.25, duration: 1.0, delay: 5.5 },  // C5
  { freq: 587.33, duration: 1.2, delay: 6.6 }, // D5
  { freq: 523.25, duration: 1.5, delay: 7.9 }, // C5
];

const CHORD_DURATION = 3.2; // seconds per chord
const LOOP_LENGTH = CHORDS.length * CHORD_DURATION; // ~12.8s per loop

function createReverb(ctx: AudioContext): ConvolverNode {
  const convolver = ctx.createConvolver();
  const rate = ctx.sampleRate;
  const length = rate * 2.5;
  const impulse = ctx.createBuffer(2, length, rate);

  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2.2);
    }
  }

  convolver.buffer = impulse;
  return convolver;
}

function playChordTone(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
  volume: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);

  // Soft attack and release
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.4);
  gain.gain.setValueAtTime(volume, startTime + duration - 0.6);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

function playMelodyNote(
  ctx: AudioContext,
  dest: AudioNode,
  freq: number,
  startTime: number,
  duration: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Triangle wave for a softer, bell-like melody tone
  osc.type = "triangle";
  osc.frequency.setValueAtTime(freq, startTime);

  const vol = 0.06;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(dest);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.1);
}

function scheduleLoop(ctx: AudioContext, dest: AudioNode, loopStart: number) {
  // Schedule chords
  CHORDS.forEach((chord, ci) => {
    const chordTime = loopStart + ci * CHORD_DURATION;
    chord.forEach((freq) => {
      playChordTone(ctx, dest, freq, chordTime, CHORD_DURATION, 0.04);
      // Add octave-up shimmer
      playChordTone(ctx, dest, freq * 2, chordTime, CHORD_DURATION, 0.015);
    });
  });

  // Schedule melody
  MELODY.forEach((note) => {
    playMelodyNote(ctx, dest, note.freq, loopStart + note.delay, note.duration);
  });
}

export function useBackgroundMusic() {
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (ctxRef.current && ctxRef.current.state !== "closed") {
      ctxRef.current.close();
    }
    ctxRef.current = null;
    masterGainRef.current = null;
    setIsPlaying(false);
  }, []);

  const start = useCallback(() => {
    if (ctxRef.current) return; // already playing

    const ctx = new AudioContext();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.8, ctx.currentTime);
    masterGainRef.current = masterGain;

    const reverb = createReverb(ctx);
    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.5, ctx.currentTime);

    const dryGain = ctx.createGain();
    dryGain.gain.setValueAtTime(0.6, ctx.currentTime);

    // Routing: source → dry + reverb → master → output
    dryGain.connect(masterGain);
    reverb.connect(reverbGain);
    reverbGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Mix node that feeds both dry and reverb
    const mix = ctx.createGain();
    mix.connect(dryGain);
    mix.connect(reverb);

    // Schedule first two loops immediately for seamless start
    scheduleLoop(ctx, mix, ctx.currentTime + 0.1);
    scheduleLoop(ctx, mix, ctx.currentTime + 0.1 + LOOP_LENGTH);

    let loopIndex = 2;
    // Keep scheduling ahead
    timerRef.current = setInterval(() => {
      if (!ctxRef.current) return;
      const t = ctxRef.current.currentTime;
      const nextStart = 0.1 + loopIndex * LOOP_LENGTH;
      if (nextStart - t < LOOP_LENGTH * 1.5) {
        scheduleLoop(ctxRef.current, mix, nextStart);
        loopIndex++;
      }
    }, 2000);

    setIsPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    console.log("ASD")
    if (isPlaying) stop();
    else start();
  }, [isPlaying, start, stop]);

  // Cleanup on unmount
  useEffect(() => {
    start();
    return () => {
      stop();
    };
  }, [stop]);

  return { isPlaying, toggle };
}
