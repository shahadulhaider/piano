import { AUDIO_CONFIG } from './constants';

/**
 * Singleton AudioContext manager
 * Handles browser autoplay policies and ensures single context instance
 */
class AudioContextManager {
  private static instance: AudioContextManager;
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  private constructor() {}

  static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.context) {
      return; // Already initialized
    }

    // Create AudioContext
    this.context = new AudioContext({
      sampleRate: AUDIO_CONFIG.SAMPLE_RATE,
      latencyHint: 'interactive', // Optimize for low latency
    });

    // Create master gain node
    this.masterGain = this.context.createGain();
    this.masterGain.gain.value = AUDIO_CONFIG.MASTER_VOLUME;
    this.masterGain.connect(this.context.destination);

    // Resume if suspended (browser autoplay policy)
    if (this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  async resume(): Promise<void> {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  getContext(): AudioContext {
    if (!this.context) {
      throw new Error('AudioContext not initialized. Call initialize() first.');
    }
    return this.context;
  }

  getMasterGain(): GainNode {
    if (!this.masterGain) {
      throw new Error('AudioContext not initialized. Call initialize() first.');
    }
    return this.masterGain;
  }

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      // Smooth volume change to avoid clicks
      const now = this.context!.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(volume, now + 0.05);
    }
  }

  getCurrentTime(): number {
    return this.context?.currentTime ?? 0;
  }

  isInitialized(): boolean {
    return this.context !== null;
  }
}

export default AudioContextManager.getInstance();
