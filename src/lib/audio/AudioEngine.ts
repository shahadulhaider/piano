import AudioContextManager from "./AudioContextManager";
import { PianoVoice } from "./PianoVoice";
import { AUDIO_CONFIG } from "./constants";

/**
 * Main audio engine with polyphonic voice management
 * Handles note triggering, voice allocation, and cleanup
 */
export class AudioEngine {
  private static instance: AudioEngine;
  private voices: Map<number, PianoVoice> = new Map();
  private initialized: boolean = false;

  private constructor() {}

  static getInstance(): AudioEngine {
    if (!AudioEngine.instance) {
      AudioEngine.instance = new AudioEngine();
    }
    return AudioEngine.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await AudioContextManager.initialize();

    // Resume context on user interaction (browser autoplay policy)
    await AudioContextManager.resume();

    this.initialized = true;
  }

  playNote(midiNote: number, velocity: number = 100): void {
    if (!this.initialized) {
      console.warn("AudioEngine not initialized");
      return;
    }

    // Stop existing note if playing (for re-triggering)
    this.stopNote(midiNote);

    // Check voice limit
    if (this.voices.size >= AUDIO_CONFIG.MAX_VOICES) {
      // Voice stealing: remove oldest inactive voice
      const oldestNote = Array.from(this.voices.keys())[0];
      this.stopNote(oldestNote);
    }

    // Create and start new voice
    const voice = new PianoVoice(midiNote, velocity);
    this.voices.set(midiNote, voice);
  }

  stopNote(midiNote: number): void {
    const voice = this.voices.get(midiNote);
    if (voice) {
      voice.release();
      // Remove from active voices after a short delay
      setTimeout(() => {
        this.voices.delete(midiNote);
      }, 500); // Cleanup after release phase
    }
  }

  stopAllNotes(): void {
    this.voices.forEach((voice, midiNote) => {
      voice.release();
    });

    // Clear all voices after release
    setTimeout(() => {
      this.voices.clear();
    }, 500);
  }

  setMasterVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    AudioContextManager.setMasterVolume(clampedVolume);
  }

  isNoteActive(midiNote: number): boolean {
    const voice = this.voices.get(midiNote);
    return voice ? voice.getIsActive() : false;
  }

  getActiveVoiceCount(): number {
    return Array.from(this.voices.values()).filter((v) => v.getIsActive())
      .length;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export default AudioEngine.getInstance();
