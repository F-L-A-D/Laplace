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

const COLORS = ["#4f46e5","#16a34a","#f97316","#dc2626","#06b6d4","#2563eb"];
const BASE_COLOR = "#da04ddaa";

export default function PriceChart({ data, selected, baseHotel, hotelMap }: any) {

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
            />

            <Tooltip
              content={(props) => (
                <PriceTooltip {...props} baseHotel={baseHotel} />
              )}
            />

            <Legend
              content={(props) => (
                <PriceLegend {...props} baseHotel={baseHotel} />
              )}
            />

            {selected.map((id:number,i:number)=>{
              const isBase = id===baseHotel;

              return (
                <Line
                  key={id}
                  dataKey={`hotel_${id}`}
                  name={hotelMap[id]}
                  stroke={isBase ? BASE_COLOR : COLORS[i % COLORS.length]}
                  strokeWidth={isBase ? 4 : 2}
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