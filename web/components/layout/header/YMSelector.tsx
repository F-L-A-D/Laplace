"use client";

import { useState, useRef, useEffect } from "react";

import* as s from "@/components/layout/header/ymSelector.styles"

type Props = {
  year: string;
  month: string;
  setYear: (v: string) => void;
  setMonth: (v: string) => void;
};

export default function YMSelector({
  year,
  month,
  setYear,
  setMonth
}: Props) {

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const years = ["2025", "2026", "2027"];
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

  // 外クリック
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const move = (dir: -1 | 1) => {
    let y = Number(year);
    let m = Number(month) + dir;

    if (m === 0) { m = 12; y--; }
    if (m === 13) { m = 1; y++; }

    setYear(String(y));
    setMonth(String(m).padStart(2, "0"));
  };

  return (
    <div ref={ref} style={s.wrap}>
      
      {/* control */}
      <div style={s.control}>
        <button style={s.arrow} onClick={() => move(-1)}>‹</button>

        <div
          style={s.center}
          onClick={() => setOpen(v => !v)}
        >
          {year}.{month}
        </div>

        <button style={s.arrow} onClick={() => move(1)}>›</button>
      </div>

      {/* dropdown */}
      {open && (
        <div style={s.dropdown}>
          <div>
            {years.map(y => (
              <div
                key={y}
                onClick={() => setYear(y)}
                style={s.item(y === year)}
              >
                {y}
              </div>
            ))}
          </div>

          <div>
            {months.map(m => (
              <div
                key={m}
                onClick={() => setMonth(m)}
                style={s.item(m === month)}
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}