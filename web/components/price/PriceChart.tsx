//web/components/price/PriceChart.tsx

"use client";

import {
  LineChart,
  Line,
  Area,
  ComposedChart,
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

import { useState, useMemo, useCallback } from "react";


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

  const { baseMin, baseMax, safeMin, safeMax } = useMemo(() => {
    return calcBaseRange(data, baseHotel);
  }, [data, baseHotel]);

  const sorted = useMemo(() => {
    return sortHotels(displaySelected, baseHotel, pinned);
  }, [displaySelected, baseHotel, pinned]);

  const handleTogglePin = useCallback((id: number) => {
    if (pinned.includes(id)) unpin(id);
    else pin(id);
  }, [pinned, pin, unpin]);


  const chartData = useMemo(() => {
    const flat = Array.isArray(data[0]) ? data[0] : data;
    const map: Record<string, any> = {};

    flat.forEach((r: any) => {
      const date = new Date(r.date).toLocaleDateString("sv-SE");
      if (!map[date]) {
        map[date] = { 
          date, 
          allMins: [] as number[]
        };
      }

      const pMin = r.price_min;
      if (pMin != null) {
        map[date][`hotel_${r.hotel_id}`] = pMin;
        map[date].allMins.push(pMin);
      }
    });

    return Object.values(map).map(row => {
      const mins = row.allMins as number[];
      const marketMin = mins.length ? Math.min(...mins) : null;
      const marketMax = mins.length ? Math.max(...mins) : null;

      return {
        ...row,
        marketRange: [marketMin, marketMax]
      };
    });
  }, [data]);

  const renderTooltip = useCallback(
    (props: any) => (
      <PriceTooltip
        {...props}
        hotelMap={hotelMap}
        view={view}
      />
    ),
    [hotelMap, view]
  );

  const renderLegend = useCallback(
    (props: any) => (
      <PriceLegend
        {...props}
        data={data}
        view={view}
        hotelMap={hotelMap}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        onTogglePin={handleTogglePin}
      />
    ),
    [data, view, hotelMap, hoveredId, handleTogglePin]
  );

  const formatDateTick = useCallback((d: any) => {
    if (!d) return "";
    const s = String(d);
    return s.length >= 10 ? s.slice(8, 10) : "";
  }, []);

  const formatYTick = useCallback((v: any) => {
    if (v == null) return "";
    return `${(Number(v) / 1000).toFixed(1)}K`;
  }, []);

  
  // ------------------------
  // render
  // ------------------------
  return (
    <div style={wrap}>
      <SectionHeader title="PRICE TREND" />

      <div style={chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 10, bottom: 60 }}
          >
            <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDateTick} />
            <YAxis
              tickFormatter={formatYTick}
              width={40}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[safeMin, safeMax]}
            />
            <Tooltip content={renderTooltip}/>
            <Legend content={renderLegend}/>

            {/* 1. まず各ホテルのメインラインを描画 */}
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
                    connectNulls={true}
                  />
                );
              })}

            {/* 市場全体のレンジ塗りつぶし (全ホテルの範囲) */}
            <Area
              key="market-range"
              type="monotone"
              dataKey="marketRange"
              stroke="none"
              fill="#94a3b8"
              fillOpacity={0.1}
              isAnimationActive={false}
              connectNulls={true}
              name="Market Range"
            />

          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}