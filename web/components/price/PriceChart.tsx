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

import SectionHeader from "@/components/common/SectionHeader";
import PriceLegend from "@/components/price/PriceLegend";
import PriceTooltip from "@/components/price/PriceTooltip";

import { sortHotels } from "@/utils/pinned";

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
  hotelMap: Record<number, string>;
  view: {
    baseHotel: number;
    displaySelected: number[];
    pinned: number[];
  }
  actions: {
    pin: (id: number) => void;
    unpin: (id: number) => void;
  }
};

export default function PriceChart({
  data,
  hotelMap,
  view,
  actions
}: Props) {

  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { baseHotel, displaySelected, pinned } = view;
  const { pin, unpin } = actions;
  console.log("data", data);

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
    return sortHotels(displaySelected, baseHotel, pinned);
  }, [displaySelected, baseHotel, pinned]);

  // ------------------------
  // wrap
  // ------------------------

  const handleTogglePin = (id: number) => {
    if (pinned.includes(id)){
      unpin(id);
    } else {
      pin(id);
    }
  };  
  
  const chartData = useMemo(() => {
    const flat = Array.isArray(data[0]) ? data[0] : data;
    console.log("flat", flat)

    const map: Record<string, any> = {};

    flat.forEach((r: any) => {
      const date = new Date(r.date)
        .toLocaleDateString("sv-SE")

      if (!map[date]) {
        map[date] = { date };
      }

      map[date][`hotel_${r.hotel_id}`] = r.price;
    });

    return Object.values(map);
  }, [data]);

  // ------------------------
  // render
  // ------------------------
  return (
    <div style={wrap}>
      <SectionHeader title="PRICE TREND" />

      <div style={chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />

            <XAxis
              dataKey="date"
              tickFormatter={(d) => {
                if (!d) return "";
                const s = String(d);
                return d.length >= 10 ? d.slice(8, 10) : "";
              }}
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
                  hotelMap={hotelMap}
                  view={view}
                />
              )}
            />

            <Legend
              content={(props) => (
                <PriceLegend
                  {...props}
                  data={data}
                  view={view}
                  hotelMap={hotelMap}
                  hoveredId={hoveredId}
                  setHoveredId={setHoveredId}
                  onTogglePin={handleTogglePin}
                />
              )}
            />

            {sorted
              .filter((id): id is number => id != null)
              .map((id, i) => {
                const { isBase, isActive, isDimmed } =
                  getLineState(id, baseHotel, hoveredId, pinned);

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