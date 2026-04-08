"use client";

import { useState, useRef, useEffect } from "react";

type Props = {
  year: string;
  month: string;
  setYear: (v: string) => void;
  setMonth: (v: string) => void;
};

export default function YearMonthSelector({
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

  // ------------------------
  // 外クリックで閉じる
  // ------------------------
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current) return;

      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ------------------------
  // 前月
  // ------------------------
  const prevMonth = () => {
    let y = Number(year);
    let m = Number(month);

    m--;
    if (m === 0) {
      m = 12;
      y--;
    }

    setYear(String(y));
    setMonth(String(m).padStart(2, "0"));
  };

  // ------------------------
  // 次月
  // ------------------------
  const nextMonth = () => {
    let y = Number(year);
    let m = Number(month);

    m++;
    if (m === 13) {
      m = 1;
      y++;
    }

    setYear(String(y));
    setMonth(String(m).padStart(2, "0"));
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* ===== 一体コントロール ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: "8px",
          background: "#f3f4f6",
          overflow: "hidden",
          fontSize: "14px"
        }}
      >
        {/* ← */}
        <div onClick={prevMonth} style={arrowStyle}>
          ‹
        </div>

        {/* 中央 */}
        <div
          onClick={() => setOpen(v => !v)}
          style={{
            padding: "6px 12px",
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          {year}.{month}
        </div>

        {/* → */}
        <div onClick={nextMonth} style={arrowStyle}>
          ›
        </div>
      </div>

      {/* ===== ドロップダウン ===== */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: "8px",
            padding: "10px",
            display: "flex",
            gap: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
            zIndex: 20
          }}
        >
          {/* 年 */}
          <div>
            {years.map(y => (
              <div
                key={y}
                onClick={() => setYear(y)}
                style={itemStyle(y === year)}
              >
                {y}
              </div>
            ))}
          </div>

          {/* 月 */}
          <div>
            {months.map(m => (
              <div
                key={m}
                onClick={() => setMonth(m)}
                style={itemStyle(m === month)}
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

// ------------------------
const arrowStyle: React.CSSProperties = {
  padding: "6px 8px",
  cursor: "pointer",
  opacity: 0.6
};

const itemStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
  background: active ? "#f3f4f6" : "transparent"
});