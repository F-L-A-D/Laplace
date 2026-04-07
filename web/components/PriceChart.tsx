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

const COLORS = ["#4f46e5","#16a34a","#f97316","#dc2626","#06b6d4","#2563eb"];

const BASE_COLOR = "#da04ddaa";

export default function PriceChart({ data, selected, baseHotel, hotelMap }: any) {

  return (
    <ResponsiveContainer width="100%" height={600}>
      <LineChart data={data}>

        <CartesianGrid stroke="#eee" strokeDasharray="3 3" />

        <XAxis dataKey="date" tickFormatter={(d)=>d.slice(8,10)} />

        <YAxis tickFormatter={(v)=>
          v != null ? `${(Number(v)/1000).toFixed(1)}K` : ""
        }/>

        {/* ★ Tooltipカスタム */}
        <Tooltip
          content={({ active, payload, label }) => {
            if (!active || !payload) return null;

            return (
              <div style={{
                background:"#fff",
                border:"1px solid #ccc",
                padding:"10px",
                fontSize:"13px"
              }}>
                <div style={{ marginBottom:"6px", fontWeight:"bold" }}>
                  {label}
                </div>

                {payload.map((p:any)=>(
                  <div
                    key={p.dataKey}
                    style={{ color: p.color }}
                  >
                    {p.name}:
                    {p.value == null
                      ? " Sold Out"
                      : `${Number(p.value).toLocaleString()}`}
                  </div>
                ))}
              </div>
            );
          }}
        />

        <Legend
          content={({ payload }) => {
            if (!payload) return null;

            const sorted = [
              ...payload.filter((p: any) =>
                Number(p.dataKey.replace("hotel_", "")) === baseHotel
              ),
              ...payload.filter((p: any) =>
                Number(p.dataKey.replace("hotel_", "")) !== baseHotel
              ),
            ];

            return (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {sorted.map((entry: any) => {
                  const id = Number(entry.dataKey.replace("hotel_", ""));
                  const isBase = id === baseHotel;

                  return (
                    <div
                      key={entry.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: isBase ? "bold" : "normal",
                        color: isBase ? "#f59e0b" : "#444",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          background: entry.color,
                          borderRadius: "50%",
                          border: isBase ? "2px solid #000" : "none",
                        }}
                      />
                      {entry.value}
                      {isBase && " ★"}
                    </div>
                  );
                })}
              </div>
            );
          }}
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
              activeDot={ {r:6} }
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
}