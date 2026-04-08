"use client";

import HotelName from "@/components/common/HotelName";

type Props = {
  active?: boolean;
  payload?: any;
  label?: string | number;
  selected: number[];
  baseHotel: number;
  hotelMap: Record<number, string>;
};

export default function PriceTooltip({
  active,
  payload,
  label,
  selected,
  baseHotel,
  hotelMap
}: Props) {
  if (!active || !payload || !selected) return null;

  const safeSelected = selected ?? [];

  const map = Object.fromEntries(
    payload.map((p: any) => [p.dataKey, p.value])
  );

  const rows = selected.map((id: number) => {
    const key = `hotel_${id}`;
    const entry = payload?.find((p: any) => p.dataKey === key);

    return {
      id,
      value: entry?.value ?? null,
    };
  });

  const base = rows.find(r => r.id === baseHotel)?.value ?? null;

  const enriched = rows.map(r => ({
    ...r,
    diff:
      base != null && r.value != null
        ? r.value - base
        : null
  }));


  const sorted = [...enriched].sort((a, b) => {
    if (a.id === baseHotel) return -1;
    if (b.id === baseHotel) return 1;

    const aNull = a.value == null;
    const bNull = b.value == null;

    if (aNull && !bNull) return -1;
    if (!aNull && bNull) return 1;

    return (b.value ?? -1) - (a.value ?? -1);
  });

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #ddd",
        padding: "10px",
        fontSize: "12px",
        minWidth: "180px"
      }}
    >
      {/* 日付 */}
      <div style={{ marginBottom: "6px", fontWeight: "bold" }}>
        {label}
      </div>

      {/* リスト */}
      {sorted.map((r) => {
        const isBase = r.id === baseHotel;
        const isSoldOut = r.value == null;

        return (
          <div
            key={r.id}
            style={{
              display: "grid",
              gridTemplateColumns: "140px 70px 60px",
              alignItems: "center",
              padding: "2px 4px",
              marginBottom: "2px",
              background: isBase
                ? "#fff8dc"
                : isSoldOut
                ? "#f3f4f6"
                : "transparent"
            }}
          >
            {/* ホテル名 */}
            <div>
              <HotelName id={r.id} hotelMap={hotelMap} width={140} />
            </div>

            {/* 価格 */}
            <div style={{ textAlign: "right" }}>
              {isSoldOut
                ? <span style={{ color: "#999" }}>SOLD OUT</span>
                : r.value.toLocaleString()}
            </div>

            {/* 差分 */}
            <div style={{ textAlign: "right" }}>
              {!isBase && r.diff != null && (
                <span
                  style={{
                    color: r.diff > 0 ? "#dc2626" : "#2563eb"
                  }}
                >
                  {`${r.diff > 0 ? "+" : ""}${(r.diff / 1000).toFixed(1)}K`}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}