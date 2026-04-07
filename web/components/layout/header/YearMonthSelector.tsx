"use client";

import { useState } from "react";

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

  const years = ["2025", "2026", "2027"];
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );

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
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {/* ← */}
      <div
        onClick={prevMonth}
        style={{
          cursor: "pointer",
          padding: "4px 6px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          background: "#fff"
        }}
      >
        ◀
      </div>

      {/* 中央 */}
      <div style={{ position: "relative" }}>
        <div
          onClick={() => setOpen(!open)}
          style={{
            border: "1px solid #ccc",
            borderRadius: "6px",
            padding: "6px 10px",
            fontSize: "14px",
            cursor: "pointer",
            background: "#fff",
            minWidth: "120px",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          {year} / {month} ▼
        </div>

        {/* ドロップダウン */}
        {open && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              left: 0,
              border: "1px solid #ccc",
              borderRadius: "6px",
              background: "#fff",
              padding: "10px",
              display: "flex",
              gap: "16px",
              zIndex: 20
            }}
          >
            {/* 年 */}
            <div>
              {years.map(y => (
                <div
                  key={y}
                  onClick={() => setYear(y)}
                  style={{
                    padding: "6px 10px",
                    cursor: "pointer",
                    background: y === year ? "#eee" : "transparent"
                  }}
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
                  style={{
                    padding: "6px 10px",
                    cursor: "pointer",
                    background: m === month ? "#eee" : "transparent"
                  }}
                >
                  {m}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* → */}
      <div
        onClick={nextMonth}
        style={{
          cursor: "pointer",
          padding: "4px 6px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          background: "#fff"
        }}
      >
        ▶
      </div>
    </div>
  );
}