"use client";

import HotelName from "@/components/common/HotelName";

import {
  buildRows,
  sortRows,
  formatDiff
} from "./priceTooltip.logic";

import {
  wrap,
  header,
  row,
  soldOut
} from "./priceTooltip.styles";

import { COLORS } from "@/styles/theme";

import { useMemo } from "react";

type Props = {
  active?: boolean;
  payload?: any;
  label?: string | number;
  displaySelected: number[];
  baseHotel: number;
  hotelMap: Record<number, string>;
  pinnedIds: number[];
};

export default function PriceTooltip({
  active,
  payload,
  label,
  displaySelected,
  baseHotel,
  hotelMap,
  pinnedIds
}: Props) {
  if (!active || !payload?.length) return null;

  // ------------------------
  // データ生成
  // ------------------------
  const rows = useMemo(() => {
    return buildRows(payload, displaySelected, baseHotel);
  }, [payload, displaySelected, baseHotel]);

  const sorted = useMemo(() => {
    return sortRows(rows, baseHotel, pinnedIds);
  }, [rows, baseHotel]);

  return (
    <div style={wrap}>
      {/* 日付 */}
      <div style={header}>{label}</div>

      {/* リスト */}
      {sorted.map((r) => {
        const isBase = r.id === baseHotel;
        const isSoldOut = r.value == null;
        const isPinned = pinnedIds.includes(r.id);

        return (
          <div
            key={r.id}
            style={{
              ...row,
              background: isBase
                ? COLORS.bg.base
                : isPinned
                ? COLORS.bg.pinned
                : isSoldOut
                ? COLORS.bg.subtle
                : COLORS.bg.default
            }}
          >
            {/* ホテル名 */}
            <div>
              <HotelName id={r.id} hotelMap={hotelMap} width={140} />
            </div>

            {/* 価格 */}
            <div style={{ textAlign: "right" }}>
              {isSoldOut
                ? <span style={{ color: COLORS.text.muted }}>SOLD OUT</span>
                : r.value.toLocaleString()}
            </div>

            {/* 差分 */}
            <div style={{ textAlign: "right" }}>
              {!isBase && r.diff != null && (
                <span
                  style={{
                    color: 
                      r.diff > 0 
                        ? COLORS.text.positive
                        : COLORS.text.negative
                  }}
                >
                  {formatDiff(r.diff)}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}