import { useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { getMidiNoteName } from "@/lib/audio/constants";
import { SettingsPanel } from "./SettingsPanel";
import { WelcomeScreen } from "./WelcomeScreen";

export function PianoKeyboard() {
  const {
    isInitialized,
    masterVolume,
    playNote,
    stopNote,
    setMasterVolume,
    isNoteActive,
    initialize,
  } = useAudio();
  const [velocity, setVelocity] = useState(100);
  const [showWelcome, setShowWelcome] = useState(true);

  const notes = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];

  const handleMouseDown = (midiNote: number) => {
    playNote(midiNote, velocity);
  };

  const handleMouseUp = (midiNote: number) => {
    stopNote(midiNote);
  };

  const isBlackKey = (midiNote: number): boolean => {
    const note = midiNote % 12;
    return [1, 3, 6, 8, 10].includes(note);
  };

  const handleStart = async () => {
    await initialize();
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-white dark:bg-zinc-950">
      <SettingsPanel
        velocity={velocity}
        onVelocityChange={setVelocity}
        masterVolume={masterVolume}
        onVolumeChange={setMasterVolume}
      />

      <div className="relative flex gap-[2px] items-end">
        {notes.map((midiNote) => {
          const isBlack = isBlackKey(midiNote);
          const isActive = isNoteActive(midiNote);

          if (isBlack) {
            return (
              <button
                key={midiNote}
                onMouseDown={() => handleMouseDown(midiNote)}
                onMouseUp={() => handleMouseUp(midiNote)}
                onMouseLeave={() => handleMouseUp(midiNote)}
                className={`
                  absolute w-12 h-32 rounded-b-lg border-2 border-zinc-700
                  transition-all select-none shadow-lg
                  ${
                    isActive
                      ? "bg-zinc-600 text-white scale-95"
                      : "bg-gray-900 hover:bg-gray-800"
                  }
                `}
                style={{
                  left: `${(midiNote - 60) * 56 + 36}px`,
                  zIndex: 10,
                }}
              >
                <span className="text-xs mt-20 block opacity-70 text-white">
                  {getMidiNoteName(midiNote)}
                </span>
              </button>
            );
          }

          return (
            <button
              key={midiNote}
              onMouseDown={() => handleMouseDown(midiNote)}
              onMouseUp={() => handleMouseUp(midiNote)}
              onMouseLeave={() => handleMouseUp(midiNote)}
              className={`
                w-14 h-48 rounded-b-lg border-2 border-zinc-300 dark:border-zinc-700
                transition-all select-none shadow-lg
                ${
                  isActive
                    ? "bg-zinc-300 dark:bg-zinc-700 scale-95"
                    : "bg-white hover:bg-zinc-50 dark:bg-zinc-100 dark:hover:bg-zinc-200"
                }
              `}
            >
              <span className="text-sm mt-40 block opacity-70 text-gray-800">
                {getMidiNoteName(midiNote)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
