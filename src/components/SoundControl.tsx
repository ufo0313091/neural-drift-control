import { useEffect, useRef, useState } from "react";
import { startSound, stopSound, setVolume } from "@/lib/sound";

type Mode = "rain" | "wave" | "forest" | "ambient" | "none";

const MODES: { id: Mode; label: string; icon: string }[] = [
  { id: "rain",    label: "雨",   icon: "🌧" },
  { id: "wave",    label: "波",   icon: "🌊" },
  { id: "forest",  label: "森",   icon: "🌿" },
  { id: "ambient", label: "瞑想", icon: "✦"  },
  { id: "none",    label: "なし", icon: "—"  },
];

const KEY_MODE = "urgeos.sound_mode";
const KEY_VOL  = "urgeos.sound_volume";

interface Props {
  autoStart?: boolean;
}

export function SoundControl({ autoStart = false }: Props) {
  const [open, setOpen]     = useState(false);
  const [mode, setMode]     = useState<Mode>(() => (localStorage.getItem(KEY_MODE) as Mode) ?? "none");
  const [vol, setVol]       = useState<number>(() => Number(localStorage.getItem(KEY_VOL) ?? 0.35));
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (autoStart && !started.current && mode !== "none") {
      started.current = true;
      startSound(mode, vol);
      setPlaying(true);
    }
    return () => { stopSound(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleMode(m: Mode) {
    setMode(m);
    localStorage.setItem(KEY_MODE, m);
    if (m === "none") {
      stopSound();
      setPlaying(false);
    } else {
      startSound(m, vol);
      setPlaying(true);
    }
  }

  function handleVol(v: number) {
    setVol(v);
    localStorage.setItem(KEY_VOL, String(v));
    setVolume(v);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>{playing ? "♪" : "♩"}</span>
        <span>サウンド</span>
      </button>

      {open && (
        <div className="absolute bottom-10 right-0 z-50 w-56 rounded-2xl border border-white/10 bg-[#111] p-4 shadow-2xl">
          <div className="mb-3 grid grid-cols-5 gap-1.5">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => handleMode(m.id)}
                className={
                  "flex flex-col items-center gap-0.5 rounded-xl border p-2 text-[10px] transition-colors " +
                  (mode === m.id
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : "border-white/8 bg-white/[0.04] text-muted-foreground hover:text-foreground")
                }
              >
                <span className="text-base">{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
          {mode !== "none" && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground">音量</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={vol}
                onChange={(e) => handleVol(Number(e.target.value))}
                className="h-1 w-full cursor-pointer accent-accent"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
