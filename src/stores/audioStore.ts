import { create } from "zustand";
import AudioEngine from "@/lib/audio/AudioEngine";

interface AudioStore {
  // State
  isInitialized: boolean;
  masterVolume: number;
  activeNotes: Set<number>;

  // Actions
  initialize: () => Promise<void>;
  playNote: (midiNote: number, velocity?: number) => void;
  stopNote: (midiNote: number) => void;
  stopAllNotes: () => void;
  setMasterVolume: (volume: number) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  // Initial state
  isInitialized: false,
  masterVolume: 0.5,
  activeNotes: new Set<number>(),

  // Initialize audio engine
  initialize: async () => {
    try {
      console.log("AudioStore: Starting initialization");
      await AudioEngine.initialize();
      console.log("AudioStore: Engine initialized, updating state");
      set({ isInitialized: true });
    } catch (error) {
      console.error("Failed to initialize audio engine:", error);
      throw error;
    }
  },

  // Play a note
  playNote: (midiNote: number, velocity: number = 100) => {
    if (!get().isInitialized) {
      console.warn("Audio engine not initialized");
      return;
    }

    AudioEngine.playNote(midiNote, velocity);

    const activeNotes = new Set(get().activeNotes);
    activeNotes.add(midiNote);
    set({ activeNotes });
  },

  // Stop a note
  stopNote: (midiNote: number) => {
    AudioEngine.stopNote(midiNote);

    const activeNotes = new Set(get().activeNotes);
    activeNotes.delete(midiNote);
    set({ activeNotes });
  },

  // Stop all notes
  stopAllNotes: () => {
    AudioEngine.stopAllNotes();
    set({ activeNotes: new Set() });
  },

  // Set master volume
  setMasterVolume: (volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    AudioEngine.setMasterVolume(clampedVolume);
    set({ masterVolume: clampedVolume });
  },
}));
