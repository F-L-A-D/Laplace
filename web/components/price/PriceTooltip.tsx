"use client";

export default function PriceTooltip({ active, payload, label, baseHotel }: any) {
  if (!active || !payload) return null;

  const sorted = [
    ...payload.filter((p: any) =>
      Number(p.dataKey.replace("hotel_", "")) === baseHotel
    ),
    ...payload.filter((p: any) =>
      Number(p.dataKey.replace("hotel_", "")) !== baseHotel
    ),
  ];

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ccc",
        padding: "10px",
        fontSize: "13px",
      }}
    >
      <div style={{ marginBottom: "6px", fontWeight: "bold" }}>
        {label}
      </div>

      {sorted.map((p: any) => {
        const id = Number(p.dataKey.replace("hotel_", ""));
        const isBase = id === baseHotel;

        return (
          <div
            key={p.dataKey}
            style={{
              color: p.color,
              fontWeight: isBase ? "bold" : "normal",
            }}
          >
            {p.name}
            {isBase && " ★"}:
            {p.value == null
              ? " Sold Out"
              : ` ${Number(p.value).toLocaleString()}`}
          </div>
        );
      })}
    </div>
  );
}