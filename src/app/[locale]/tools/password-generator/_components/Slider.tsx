"use client";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  step?: number;
  unit?: string;
}

export default function Slider({ label, value, min, max, onChange, step = 1, unit }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm text-white/60">{label}</span>
        <span className="text-sm font-bold text-violet-400 tabular-nums">
          {value}{unit ? ` ${unit}` : ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-violet-500"
        style={{ background: `linear-gradient(to right, #7C3AED ${pct}%, rgba(255,255,255,0.1) 0%)` }}
      />
    </div>
  );
}
