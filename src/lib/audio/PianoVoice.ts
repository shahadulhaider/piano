import AudioContextManager from './AudioContextManager';
import { midiToFrequency, ENVELOPE, velocityToGain, velocityToFilterCutoff } from './constants';

/**
 * Represents a single piano voice with multi-oscillator synthesis
 * Uses 3 oscillators for richer, more realistic piano tone
 */
export class PianoVoice {
  private midiNote: number;
  private oscillators: OscillatorNode[] = [];
  private gainNode: GainNode;
  private filterNode: BiquadFilterNode;
  private isActive: boolean = false;

  constructor(midiNote: number, velocity: number) {
    this.midiNote = midiNote;

    const context = AudioContextManager.getContext();
    const masterGain = AudioContextManager.getMasterGain();
    const now = context.currentTime;
    const frequency = midiToFrequency(midiNote);
    const gain = velocityToGain(velocity);
    const filterCutoff = velocityToFilterCutoff(velocity);

    // Create filter for tone shaping
    this.filterNode = context.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.value = filterCutoff;
    this.filterNode.Q.value = 1;

    // Create envelope gain node
    this.gainNode = context.createGain();
    this.gainNode.gain.value = 0;

    // Connect: Oscillators -> Filter -> Gain (envelope) -> Master
    this.filterNode.connect(this.gainNode);
    this.gainNode.connect(masterGain);

    // Create 3 oscillators for rich tone
    const oscillatorConfigs = [
      { type: 'triangle' as OscillatorType, detune: 0, gain: 0.4 },      // Fundamental
      { type: 'sine' as OscillatorType, detune: 1200, gain: 0.15 },      // Octave up
      { type: 'sine' as OscillatorType, detune: 1902, gain: 0.08 },      // Fifth above octave
    ];

    oscillatorConfigs.forEach(config => {
      const osc = context.createOscillator();
      osc.type = config.type;
      osc.frequency.value = frequency;
      osc.detune.value = config.detune;

      // Individual gain for each oscillator
      const oscGain = context.createGain();
      oscGain.gain.value = config.gain * gain;

      osc.connect(oscGain);
      oscGain.connect(this.filterNode);

      osc.start(now);
      this.oscillators.push(osc);
    });

    // Apply ADSR envelope
    this.applyAttack(now, gain);
    this.isActive = true;
  }

  private applyAttack(startTime: number, targetGain: number): void {
    const { ATTACK, DECAY, SUSTAIN } = ENVELOPE;
    const peakGain = targetGain;
    const sustainGain = targetGain * SUSTAIN;

    this.gainNode.gain.cancelScheduledValues(startTime);
    this.gainNode.gain.setValueAtTime(0, startTime);

    // Attack phase
    this.gainNode.gain.linearRampToValueAtTime(peakGain, startTime + ATTACK);

    // Decay phase
    this.gainNode.gain.linearRampToValueAtTime(sustainGain, startTime + ATTACK + DECAY);
  }

  release(): void {
    if (!this.isActive) return;

    const context = AudioContextManager.getContext();
    const now = context.currentTime;
    const { RELEASE } = ENVELOPE;

    // Release phase - fade to 0
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
    this.gainNode.gain.linearRampToValueAtTime(0, now + RELEASE);

    // Stop oscillators and cleanup
    this.oscillators.forEach(osc => {
      osc.stop(now + RELEASE);
    });

    // Cleanup after release
    setTimeout(() => {
      this.cleanup();
    }, RELEASE * 1000 + 100);

    this.isActive = false;
  }

  private cleanup(): void {
    this.oscillators.forEach(osc => {
      osc.disconnect();
    });
    this.filterNode.disconnect();
    this.gainNode.disconnect();
    this.oscillators = [];
  }

  getMidiNote(): number {
    return this.midiNote;
  }

  getIsActive(): boolean {
    return this.isActive;
  }
}
