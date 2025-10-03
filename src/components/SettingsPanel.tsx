import { Settings, Sun, Moon, Monitor } from "lucide-react";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

interface SettingsPanelProps {
  velocity: number;
  onVelocityChange: (velocity: number) => void;
  masterVolume: number;
  onVolumeChange: (volume: number) => void;
}

export function SettingsPanel({
  velocity,
  onVelocityChange,
  masterVolume,
  onVolumeChange,
}: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 rounded-full transition-colors shadow-lg"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 -z-10"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-14 right-0 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-2xl p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold">Theme</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    theme === "light"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  }`}
                >
                  <Sun className="w-4 h-4" />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    theme === "dark"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  }`}
                >
                  <Moon className="w-4 h-4" />
                  <span className="text-sm">Dark</span>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-colors ${
                    theme === "system"
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                      : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm">System</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Master Volume: {Math.round(masterVolume * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume * 100}
                onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold">
                Velocity: {velocity}
              </label>
              <input
                type="range"
                min="0"
                max="127"
                value={velocity}
                onChange={(e) => onVelocityChange(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
              />
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Controls note volume and brightness
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
