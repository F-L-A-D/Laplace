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
import { sortHotels } from "@/utils/sortHotels";
import { useState, useEffect, useMemo } from "react";

const COLORS = ["#4f46e5","#16a34a","#f97316","#dc2626","#06b6d4","#2563eb"];
const BASE_COLOR = "#da04ddaa";

type Props = {
  data: any[];
  selected: number[];
  baseHotel: number;
  hotelMap: Record<number, string>;
  setSelected: (v: number[]) => void;
  pinnedIds: number[];
  setPinnedIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function PriceChart({
  data,
  selected,
  baseHotel,
  hotelMap,
  setSelected,
  pinnedIds,
  setPinnedIds
}: Props) {

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // ------------------------
  // baseレンジ計算
  // ------------------------
  const { baseMin, baseMax, safeMin, safeMax } = useMemo(() => {
    const values = data
      .map(d => d[`hotel_${baseHotel}`])
      .filter(v => v != null);

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1000;

    return {
      baseMin: min,
      baseMax: max,
      safeMin: min - range * 0.1,
      safeMax: max + range * 0.1
    };
  }, [data, baseHotel]);

  // ------------------------
  // pinの整合性維持
  // ------------------------
  useEffect(() => {
    setPinnedIds(prev => prev.filter(id => selected.includes(id)));
  }, [selected, setPinnedIds]);

  // ------------------------
  // pin toggle
  // ------------------------
  const togglePin = (id: number) => {
    if (id === baseHotel) return;

    setPinnedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(v => v !== id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  // ------------------------
  // Line状態判定
  // ------------------------
  const getLineState = (id: number) => {
    const isBase = id === baseHotel;
    const isHovered = hoveredId === id;
    const isPinned = pinnedIds.includes(id);

    const isActive = isBase || isHovered || isPinned;

    const isDimmed =
      hoveredId === null && pinnedIds.length === 0
        ? id !== baseHotel
        : !isActive;

    return { isBase, isHovered, isPinned, isActive, isDimmed };
  };

  // ------------------------
  // stroke決定
  // ------------------------
  const getStroke = (id: number, i: number) => {
    const latest = data[data.length - 1]?.[`hotel_${id}`];

    const isOutOfRange =
      latest != null && (latest < baseMin || latest > baseMax);

    if (isOutOfRange) return "#dc2626";
    if (id === baseHotel) return BASE_COLOR;

    return COLORS[i % COLORS.length];
  };

  const sorted = sortHotels(selected, baseHotel, pinnedIds);
  
  // ------------------------
  // render
  // ------------------------
  return (
    <div style={wrap}>
      <SectionTitle title="PRICE TREND" />

      <div style={chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
            
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />

            <XAxis dataKey="date" tickFormatter={(d)=>d.slice(8,10)} />

            <YAxis
              tickFormatter={(v)=>
                v != null ? `${(Number(v)/1000).toFixed(1)}K` : ""
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
                  selected={selected}
                  baseHotel={baseHotel}
                  hotelMap={hotelMap}
                />
              )}
            />

            <Legend
              content={(props) => (
                <PriceLegend
                  {...props}
                  baseHotel={baseHotel}
                  data={data}
                  selected={selected}
                  setSelected={setSelected}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  pinnedIds={pinnedIds}
                  togglePin={togglePin}
                  hotelMap={hotelMap}
                />
              )}
            />

            {sorted.map((id, i) => {
              const { isBase, isActive, isDimmed } = getLineState(id);

              return (
                <Line
                  key={id}
                  dataKey={`hotel_${id}`}
                  name={hotelMap[id]}
                  stroke={getStroke(id, i)}
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

// ------------------------
// styles
// ------------------------

const wrap = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column" as const
};

const chartWrap = {
  flex: 1,
  minHeight: 0
};