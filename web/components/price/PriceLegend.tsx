"use client";

export default function PriceLegend({ payload, baseHotel }: any) {
  if (!payload) return null;

  const sorted = [
    ...payload.filter((p: any) =>
      Number(p.dataKey.replace("hotel_", "")) === baseHotel
    ),
    ...payload.filter((p: any) =>
      Number(p.dataKey.replace("hotel_", "")) !== baseHotel
    ),
  ];

  const MAX = 5;
  const visible = sorted.slice(0, MAX);
  const hidden = sorted.slice(MAX);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
      {visible.map((entry: any) => {
        const id = Number(entry.dataKey.replace("hotel_", ""));
        const isBase = id === baseHotel;

        return (
          <div
            key={entry.dataKey}
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

      {hidden.length > 0 && (
        <div style={{ color: "#999" }}>
          +{hidden.length} AND OTHER
        </div>
      )}
    </div>
  );
}