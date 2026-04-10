"use client";

import { useState, useMemo } from "react";

import {
  buildLegendData,
  sortLegend,
  splitVisible,
  getLegendState
} from "./priceLegend.logic";

import {
  wrap,
  item,
  dot,
  dropdown
} from "./priceLegend.styles";

import { COLORS } from "@/styles/theme";

type Props = {
  payload?: any;
  baseHotel: number;
  data: any[];
  selected: number[];
  hoveredId: number | null;
  setHoveredId: (v: number | null) => void;
  pinnedIds: number[];
  onTogglePin: (id: number) => void;
  hotelMap: Record<number, string>;
};

export default function PriceLegend({
  payload,
  baseHotel,
  data,
  selected,
  hoveredId,
  setHoveredId,
  pinnedIds,
  onTogglePin,
  hotelMap
}: Props) {
  const [showAll, setShowAll] = useState(false);

  if (!payload || !data?.length) return null;

  // ------------------------
  // データ生成
  // ------------------------
  const merged = useMemo(() => {
    return buildLegendData(selected, payload, data, hotelMap);
  }, [selected, payload, data, hotelMap]);

  const sorted = useMemo(() => {
    return sortLegend(merged, baseHotel, pinnedIds);
  }, [merged, baseHotel, pinnedIds]);

  const { visible, hidden } = useMemo(() => {
    return splitVisible(sorted, 5);
  }, [sorted]);

  const handleClick = (id: number) => {
    if (id !== baseHotel){
      onTogglePin(id);
    }
  };

  const handleHover = (id: number) => {
    setHoveredId(id);
  };

  const handleLeave = () => {
    setHoveredId(null);
  };

  return (
    <div
      style={wrap}
      onMouseLeave={handleLeave}
    >
      {/* ===== visible ===== */}
      {visible.map((entry) => {
        const { isBase, isPinned, isDimmed } =
          getLegendState(entry.id, baseHotel, hoveredId, pinnedIds);

        return (
          <div
            key={entry.id}
            onClick={() => handleClick(entry.id)}
            onMouseEnter={() => handleHover(entry.id)}
            style={{
              ...item,
              cursor: isBase ? "default" : "pointer",
              opacity: isDimmed ? 0.3 : 1,

              fontWeight: 400,
              color: COLORS.text.secondary,

              borderBottom: isBase
                ? `2px solid ${COLORS.border.base}`
                : isPinned
                ? `2px solid ${COLORS.border.pinned}`
                : `2px solid ${COLORS.border.default}`,

              paddingBottom: "2px"
            }}
          >
            <div
              style={{
                ...dot,
                background: entry.color,
                border: isBase ? "2px solid #000" : "none"
              }}
            />

            <span>{entry.name}</span>

          </div>
        );
      })}

      {/* ===== hidden ===== */}
      {hidden.length > 0 && (
        <div
          style={{ position: "relative" }}
          onClick={(e) => {
            e.stopPropagation();
            setShowAll(v => !v);
          }}
        >
          <div style={{ color: "#999", cursor: "pointer" }}>
            +{hidden.length} AND OTHER
          </div>

          {showAll && (
            <div style={dropdown}>
              {hidden.map((entry) => (
                <div
                  key={entry.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick(entry.id);
                  }}
                  style={{ cursor: "pointer", padding: "4px 6px" }}
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