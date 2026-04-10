"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import SectionTitle from "@/components/common/SectionTitle";
import PriceLegend from "@/components/price/PriceLegend";
import PriceTooltip from "@/components/price/PriceTooltip";

import { sortHotels, togglePin } from "@/utils/pinned";

import {
  calcBaseRange,
  getLineState,
  getStroke
} from "@/components/price/priceChart.logic";

import {
  wrap,
  chartWrap,
  COLORS,
  BASE_COLOR
} from "@/components/price/priceChart.styles";

import { useState, useMemo } from "react";

type Props = {
  data: any[];
  baseHotel: number;
  hotelMap: Record<number, string>;
  displaySelected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  pinnedIds: number[];
  setPinnedIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function PriceChart({
  data,
  baseHotel,
  hotelMap,
  displaySelected,
  setSelected,
  pinnedIds,
  setPinnedIds
}: Props) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // ------------------------
  // baseレンジ
  // ------------------------
  const { baseMin, baseMax, safeMin, safeMax } = useMemo(() => {
    return calcBaseRange(data, baseHotel);
  }, [data, baseHotel]);

  // ------------------------
  // 並び順（UI基準）
  // ------------------------
  const sorted = useMemo(() => {
    return sortHotels(displaySelected, baseHotel, pinnedIds);
  }, [displaySelected, baseHotel, pinnedIds]);

  // ------------------------
  // wrap
  // ------------------------

  const handleTogglePin = (id: number) => {
    setPinnedIds (prev =>
      togglePin(id, baseHotel, prev)
    );
  };

  // ------------------------
  // render
  // ------------------------
  return (
    <div style={wrap}>
      <SectionTitle title="PRICE TREND" />

      <div style={chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={(d) => d.slice(8, 10)}
            />

            <YAxis
              tickFormatter={(v) =>
                v != null
                  ? `${(Number(v) / 1000).toFixed(1)}K`
                  : ""
              }
              width={40}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[safeMin, safeMax]}
            />

            <Tooltip
              content={(props) => (
                <PriceTooltip
                  {...props}
                  displaySelected={displaySelected}
                  baseHotel={baseHotel}
                  hotelMap={hotelMap}
                  pinnedIds={pinnedIds}
                />
              )}
            />

            <Legend
              content={(props) => (
                <PriceLegend
                  {...props}
                  baseHotel={baseHotel}
                  data={data}
                  displaySelected={displaySelected}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  pinnedIds={pinnedIds}
                  onTogglePin={handleTogglePin}
                  hotelMap={hotelMap}
                />
              )}
            />

            {sorted.map((id, i) => {
              const { isBase, isActive, isDimmed } =
                getLineState(id, baseHotel, hoveredId, pinnedIds);

              return (
                <Line
                  key={id}
                  dataKey={`hotel_${id}`}
                  name={hotelMap[id]}
                  stroke={getStroke(
                    id,
                    i,
                    data,
                    baseMin,
                    baseMax,
                    baseHotel,
                    COLORS,
                    BASE_COLOR
                  )}
                  strokeWidth={isActive ? 4 : 2}
                  strokeOpacity={isDimmed ? 0.2 : 1}
                  dot={isBase ? { r: 3 } : false}
                  activeDot={{ r: 6 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}