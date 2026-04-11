"use client";

import { useState, useMemo } from "react";

import {
  buildLegendData,
  sortLegend,
  splitVisible,
  getLegendState
} from "@/components/price/priceLegend.logic";

import {
  wrap,
  item,
  dot,
  dropdown
} from "@/components/price/priceLegend.styles";

import { COLORS } from "@/styles/theme";

type Props = {
  payload?: any;
  data: any[];
  view: {
    baseHotel: number;
    displaySelected: number[];
    pinned: number[];
  }
  hotelMap: Record<number, string>;
  hoveredId: number | null;
  setHoveredId: (v: number | null) => void;
  onTogglePin: (id: number) => void;
};

export default function PriceLegend({
  payload,
  data,
  view,
  hotelMap,
  hoveredId,
  setHoveredId,
  onTogglePin
}: Props) {
  const [showAll, setShowAll] = useState(false);
  const VISIBLE_COUNT = 5;
  const { baseHotel, displaySelected, pinned } = view; 

  if (!data?.length || !displaySelected.length) return null;

  // ------------------------
  // データ生成
  // ------------------------
  const merged = useMemo(() => {
    return buildLegendData(displaySelected, payload, data, hotelMap);
  }, [displaySelected, payload, data, hotelMap]);

  const sorted = useMemo(() => {
    return sortLegend(merged, baseHotel, pinned);
  }, [merged, baseHotel, pinned]);

  const { visible, hidden } = useMemo(() => {
    return splitVisible(sorted, VISIBLE_COUNT);
  }, [sorted, VISIBLE_COUNT]);

  const handleClick = (id: number) => {
    if (id === baseHotel) return;
    onTogglePin(id);
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
      onMouseLeave={() => {
        handleLeave();
        setShowAll(false);
      }}
    >
      {/* ===== visible ===== */}
      {visible.map((entry) => {
        const { isBase, isPinned, isDimmed } =
          getLegendState(entry.id, baseHotel, hoveredId, pinned);

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