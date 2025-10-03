import { useState } from "react";
import { useAudio } from "@/hooks/useAudio";
import { getMidiNoteName } from "@/lib/audio/constants";

export function AudioTest() {
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

  // C4 to C5 (one octave)
  const notes = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72];

  const handleMouseDown = (midiNote: number) => {
    console.log("Mouse down on note:", midiNote, "velocity:", velocity);
    playNote(midiNote, velocity);
  };

  const handleMouseUp = (midiNote: number) => {
    console.log("Mouse up on note:", midiNote);
    stopNote(midiNote);
  };

  const isBlackKey = (midiNote: number): boolean => {
    const note = midiNote % 12;
    return [1, 3, 6, 8, 10].includes(note);
  };

  const handleInitialize = async () => {
    console.log("Manual initialization triggered");
    await initialize();
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">🎹 Piano Audio Test</h1>
        <p className="text-muted-foreground">
          {isInitialized ? "Audio engine ready ✅" : "Initializing audio..."}
        </p>
        {!isInitialized && (
          <button
            onClick={handleInitialize}
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Click to Initialize Audio
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-6 w-full max-w-md">
        {/* Master Volume */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Master Volume: {Math.round(masterVolume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={masterVolume * 100}
            onChange={(e) => setMasterVolume(Number(e.target.value) / 100)}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Velocity */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Velocity: {velocity}</label>
          <input
            type="range"
            min="0"
            max="127"
            value={velocity}
            onChange={(e) => setVelocity(Number(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Piano Keys */}
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
                  absolute w-12 h-32 rounded-b-lg border-2 border-border
                  transition-colors select-none
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-800 hover:bg-gray-700"
                  }
                `}
                style={{
                  left: `${(midiNote - 60) * 56 + 36}px`,
                  zIndex: 10,
                }}
              >
                <span className="text-xs mt-20 block">
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
                w-14 h-48 rounded-b-lg border-2 border-border
                transition-colors select-none
                ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-white dark:bg-gray-100 hover:bg-gray-200 text-gray-800"
                }
              `}
            >
              <span className="text-sm mt-40 block">
                {getMidiNoteName(midiNote)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Click and hold keys to play notes</p>
        <p>Adjust velocity to control volume and brightness</p>
      </div>
    </div>
  );
}
