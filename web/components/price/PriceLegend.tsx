"use client";

import { useState } from "react";

type Props = {
  payload?: any;
  baseHotel: number;
  data: any[];
  selected: number[];
  setSelected: (v: number[]) => void;
  hoveredId: number | null;
  setHoveredId: (v: number | null) => void;
  pinnedIds: number[];
  togglePin: (id: number) => void;
  hotelMap: Record<number, string>;
};

export default function PriceLegend({
  payload,
  baseHotel,
  data,
  selected,
  setSelected,
  hoveredId,
  setHoveredId,
  pinnedIds,
  togglePin,
  hotelMap
}: Props) {
  if (!payload || !data?.length) return null;

  const latest = data[data.length - 1];
  const uniqueSelected = Array.from(new Set(selected));

  const merged = uniqueSelected.map((id) => {
    const key = `hotel_${id}`;
    const p = payload.find((x: any) => x.dataKey === key);

    return {
      id,
      name: hotelMap[id],
      color: p?.color ?? "#ccc",
      price: latest?.[key] ?? null
    };
  });

  // ------------------------
  // ソート
  // ------------------------
  const sorted = [...merged].sort((a, b) => {
    if (a.id === baseHotel) return -1;
    if (b.id === baseHotel) return 1;

    const aPinned = pinnedIds.includes(a.id);
    const bPinned = pinnedIds.includes(b.id);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    return a.name.localeCompare(b.name, "en");
  });

  // ------------------------
  // 表示制御
  // ------------------------
  const MAX = 5;
  const visible = sorted.slice(0, MAX);
  const hidden = sorted.slice(MAX);

  const [showAll, setShowAll] = useState(false);

  return (
    <div 
      style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}
      onMouseLeave={() => setHoveredId(null)}
    >
      
      {/* ===== 上位表示 ===== */}
      {visible.map((entry) => {
        const isBase = entry.id === baseHotel;
        const isPinned = pinnedIds.includes(entry.id);
        const isHovered = hoveredId === entry.id;

        const isActive = isBase || isPinned || isHovered;
        const hasAnyFocus = hoveredId != null || pinnedIds.length > 0;

        const isDimmed = hasAnyFocus
          ? !isActive
          : entry.id !== baseHotel;

        return (
          <div
            key={entry.id}
            onClick={() => togglePin(entry.id)}
            onMouseEnter={() => setHoveredId(entry.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: isBase ? "default" : "pointer",
              opacity: isDimmed ? 0.3 : 1,
              fontWeight: isBase || isPinned ? "bold" : "normal",
              color: isBase
                ? "#f59e0b"
                : entry.price == null
                ? "#999"
                : "#444"
            }}
          >
            {/* ドット */}
            <div
              style={{
                width: "12px",
                height: "12px",
                background: entry.color,
                borderRadius: "50%",
                border: isBase ? "2px solid #000" : "none",
                opacity: entry.price == null ? 0.4 : 1
              }}
            />

            {/* 名前 */}
            <span>{entry.name}</span>

            {/* マーク */}
            {isBase && " ★"}
            {isPinned && " 📌"}
          </div>
        );
      })}

      {/* ===== AND OTHER ===== */}
      {hidden.length > 0 && (
        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setShowAll(true)}
          onMouseLeave={() => setShowAll(false)}
        >
          {/* トリガー */}
          <div style={{ color: "#999", cursor: "pointer" }}>
            +{hidden.length} AND OTHER
          </div>

          {/* ドロップダウン */}
          {showAll && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                background: "#fff",
                border: "1px solid #ddd",
                padding: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 999,
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                whiteSpace: "nowrap",
                minWidth: "max-content",
                maxHeight: "220px",
                overflowY: "auto"
              }}
            >
              {hidden.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => togglePin(entry.id)}
                  onMouseEnter={() => setHoveredId(entry.id)}
                  style={{
                    cursor: "pointer",
                    padding: "4px 6px"
                  }}
                >
                  {entry.name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}