// MIDI note number to frequency conversion
export const midiToFrequency = (midiNote: number): number => {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
};

// ADSR Envelope parameters (in seconds)
export const ENVELOPE = {
  ATTACK: 0.01,   // 10ms - Quick attack for piano
  DECAY: 0.1,     // 100ms
  SUSTAIN: 0.7,   // 70% of peak
  RELEASE: 0.3,   // 300ms
} as const;

// Audio engine settings
export const AUDIO_CONFIG = {
  SAMPLE_RATE: 48000,
  MAX_VOICES: 32,
  MASTER_VOLUME: 0.5,
} as const;

// Velocity curve - maps MIDI velocity (0-127) to gain (0-1)
export const velocityToGain = (velocity: number): number => {
  // Exponential curve for more natural feel
  const normalized = Math.max(0, Math.min(127, velocity)) / 127;
  return Math.pow(normalized, 1.5);
};

// Velocity to filter cutoff (brighter = higher velocity)
export const velocityToFilterCutoff = (velocity: number): number => {
  const normalized = Math.max(0, Math.min(127, velocity)) / 127;
  // Range: 800Hz (soft) to 8000Hz (hard)
  return 800 + normalized * 7200;
};

// MIDI note names for reference
export const NOTE_NAMES = [
  'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'
] as const;

export const getMidiNoteName = (midiNote: number): string => {
  const octave = Math.floor(midiNote / 12) - 1;
  const noteName = NOTE_NAMES[midiNote % 12];
  return `${noteName}${octave}`;
};
