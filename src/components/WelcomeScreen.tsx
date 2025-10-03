import { Play } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 via-white to-zinc-50 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900 animate-pulse" />

      <div className="relative z-10 text-center space-y-8 px-4">
        <div className="space-y-4">
          <h1 className="text-7xl font-bold tracking-tight">🎹</h1>
          <h2 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Piano
          </h2>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
            Professional virtual piano with studio-quality sound
          </p>
        </div>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 rounded-full hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all hover:scale-105 shadow-2xl"
        >
          <Play className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          Start Playing
        </button>

        <p className="text-sm text-zinc-500 dark:text-zinc-500">
          Click to initialize audio engine
        </p>
      </div>
    </div>
  );
}
