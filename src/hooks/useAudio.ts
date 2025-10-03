import { useEffect } from "react";
import { useAudioStore } from "@/stores/audioStore";

/**
 * Custom hook for audio operations
 * Handles initialization and provides audio controls
 */
export const useAudio = () => {
  const {
    isInitialized,
    masterVolume,
    activeNotes,
    initialize,
    playNote,
    stopNote,
    stopAllNotes,
    setMasterVolume,
  } = useAudioStore();

  // Auto-initialize on mount
  useEffect(() => {
    if (!isInitialized) {
      console.log("Attempting to initialize audio...");
      initialize()
        .then(() => {
          console.log("Audio initialized successfully");
        })
        .catch((err) => {
          console.error("Audio initialization failed:", err);
        });
    }
  }, [isInitialized, initialize]);

  return {
    isInitialized,
    masterVolume,
    activeNotes,
    initialize,
    playNote,
    stopNote,
    stopAllNotes,
    setMasterVolume,
    isNoteActive: (midiNote: number) => activeNotes.has(midiNote),
  };
};
