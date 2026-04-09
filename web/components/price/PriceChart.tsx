// web/components/price/PriceChart.tsx

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
import { useDebugValue, useState } from "react";
import { useEffect } from "react";

const COLORS = ["#4f46e5","#16a34a","#f97316","#dc2626","#06b6d4","#2563eb"];
const BASE_COLOR = "#da04ddaa";

export default function PriceChart({ data, selected, baseHotel, hotelMap, setSelected }: any) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const baseValues: number[] = data
    .map((d: Record<string, any>) => d[`hotel_${baseHotel}`])
    .filter((v: number | null) => v != null);
  
  const baseMin = Math.min(...baseValues);
  const baseMax = Math.max(...baseValues);

  const range = baseMax - baseMin || 1000;

  const safeMin = baseMin - range * 0.1;
  const safeMax = baseMax + range * 0.1;

  const [pinnedIds, setPinnedIds] = useState<number[]>([]);

  useEffect(() => {
    setPinnedIds(prev => prev.filter(id => selected.includes(id)));
  }, [selected]);

  const togglePin = (id: number) => {
    if (id === baseHotel) return;

    if (pinnedIds.includes(id)) {
      setPinnedIds(pinnedIds.filter(v => v !== id));
    } else {
      if (pinnedIds.length >= 4) return;
      setPinnedIds([...pinnedIds, id]);
    }
  };


  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      
      <SectionTitle title="PRICE TREND" />

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />

            <XAxis dataKey="date" tickFormatter={(d)=>d.slice(8,10)} />

            <YAxis
              tickFormatter={(v)=>
                v != null ? `${(Number(v)/1000).toFixed(1)}K` : ""
              }
              width={40}
              tick={{ fontSize: 11 }}
              tickMargin={4}
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

            {selected.map((id:number, i:number)=>{
              const isBase = id === baseHotel;
              const isHovered = hoveredId === id;
              const isPinned = pinnedIds.includes(id);

              const isActive = isBase || isHovered || isPinned;

              const isDimmed =
                hoveredId === null && pinnedIds.length === 0
                  ? id !== baseHotel
                  : !isActive;

              const latest = data[data.length - 1]?.[`hotel_${id}`];
              const isOutOfRange = latest != null && (latest < baseMin || latest > baseMax);

              return (
                <Line
                  key={id}
                  dataKey={`hotel_${id}`}
                  name={hotelMap[id]}
                  stroke={
                    isOutOfRange
                      ? "#dc2626"
                      : isBase 
                      ? BASE_COLOR 
                      : COLORS[i % COLORS.length]
                  }
                  strokeWidth={isActive ? 4 : 2}
                  strokeOpacity={isDimmed ? 0.2 : 1}
                  strokeDasharray={isOutOfRange ? "5.5" : undefined}
                  dot={isBase ? {r:3} : false }
                  activeDot={{ r:6 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}