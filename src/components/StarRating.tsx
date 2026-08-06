"use client";

import { useState } from "react";

const LABELS: [number, string][] = [
  [0.5, "Horrível"],
  [1.5, "Fraco"],
  [2.5, "Ok"],
  [3.5, "Bom"],
  [4.5, "Ótimo"],
  [5, "Obra-prima"],
];

function labelFor(value: number) {
  if (value <= 0) return "";
  for (const [max, label] of LABELS) {
    if (value <= max) return label;
  }
  return LABELS[LABELS.length - 1][1];
}

function Star({ fill, glow }: { fill: number; glow: boolean }) {
  return (
    <span className="relative inline-block w-8 h-8 leading-none select-none">
      <span className="absolute inset-0 text-line/70 text-[2rem] leading-none">★</span>
      <span
        className="absolute inset-0 text-gold text-[2rem] leading-none overflow-hidden transition-all duration-150"
        style={{
          width: `${fill * 100}%`,
          filter: glow && fill > 0 ? "drop-shadow(0 0 6px rgba(217,164,65,.7))" : "none",
        }}
      >
        ★
      </span>
    </span>
  );
}

export default function StarRating({
  value,
  onChange,
  readOnly = false,
  size = "md",
  showLabel = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  function fillFor(starIndex: number) {
    const diff = shown - starIndex;
    if (diff >= 1) return 1;
    if (diff >= 0.5) return 0.5;
    return 0;
  }

  function handleClick(starIndex: number, isLeftHalf: boolean) {
    if (readOnly || !onChange) return;
    const newValue = starIndex + (isLeftHalf ? 0.5 : 1);
    onChange(newValue === value ? starIndex : newValue);
  }

  const scale = size === "lg" ? "scale-110" : size === "sm" ? "scale-[0.62] -ml-2.5" : "";

  return (
    <div className="inline-flex items-center gap-3">
      <div
        className={`flex items-center gap-0.5 origin-left ${scale}`}
        onMouseLeave={() => setHover(null)}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="relative">
            <Star fill={fillFor(i)} glow={!readOnly} />
            {!readOnly && (
              <>
                <button
                  type="button"
                  aria-label={`${i + 0.5} estrelas`}
                  className="absolute left-0 top-0 w-1/2 h-full"
                  onMouseEnter={() => setHover(i + 0.5)}
                  onClick={() => handleClick(i, true)}
                />
                <button
                  type="button"
                  aria-label={`${i + 1} estrelas`}
                  className="absolute right-0 top-0 w-1/2 h-full"
                  onMouseEnter={() => setHover(i + 1)}
                  onClick={() => handleClick(i, false)}
                />
              </>
            )}
          </span>
        ))}
      </div>
      {size !== "sm" && <span className="font-mono text-sm opacity-60">{value.toFixed(1)}</span>}
      {showLabel && value > 0 && (
        <span className="font-mono text-xs uppercase tracking-wide2 text-gold">
          {labelFor(shown)}
        </span>
      )}
    </div>
  );
}
