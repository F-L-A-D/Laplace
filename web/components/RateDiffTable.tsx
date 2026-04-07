"use client";

import { useMemo } from "react";
import HotelName from "./HotelName";

type Props = {
  data: any[];
  selected: number[];
  hotelMap: Record<number, string>;
  baseHotel: number;
};

const MAX_COLS = 5;

export default function RateDiffTable({
  data,
  selected,
  hotelMap,
  baseHotel,
}: Props) {

  // ------------------------
  // 並び順
  // ------------------------
  const ordered = useMemo(() => {
    return [
      baseHotel,
      ...selected
        .filter((id) => id !== baseHotel)
        .sort((a, b) =>
          hotelMap[a].localeCompare(hotelMap[b], "en")
        ),
    ];
  }, [selected, baseHotel, hotelMap]);

  // ------------------------
  // 5枠（ダミー含む）
  // ------------------------
  const padded = useMemo(() => {
    return [
      ...ordered.slice(0, MAX_COLS),
      ...Array(Math.max(0, MAX_COLS - ordered.length)).fill(null),
    ];
  }, [ordered]);

  // ------------------------
  // 中央値
  // ------------------------
  const median = (arr: number[]) => {
    const s = [...arr].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
  };

  // ------------------------
  // データ
  // ------------------------
  const rows = useMemo(() => {
    return data.map((row) => {

      const prices = ordered
        .map((id) => row[`hotel_${id}`])
        .filter((v) => v != null);

      const med = prices.length ? median(prices) : null;

      const values = padded.map((id) => {
        if (id == null) return null; // ← ダミー

        const price = row[`hotel_${id}`];
        return price != null && med != null
          ? (price - med) / med
          : null;
      });

      return {
        date: row.date.slice(8, 10),
        values,
      };
    });
  }, [data, ordered, padded]);

  return (
    <div>
      <h3>Daily Position (vs Median)</h3>

      <table style={{ 
          borderCollapse: "collapse" as const,
          tableLayout: "fixed",
          width: "100%"
        }}
      >
        <thead>
          <tr>
            <th style={th}>Date</th>

            {padded.map((id, i) => (
              <th key={i} style={th}>
                {id ? <HotelName name={hotelMap[id]} /> : "-"}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td style={td}>{row.date}</td>

              {row.values.map((v, j) => (
                <td key={j} style={td}>
                  {v == null ? "-" : (
                    <span style={{ color: v > 0 ? "red" : "blue" }}>
                      {(v * 100).toFixed(0)}%
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { padding: "6px", borderBottom: "2px solid #ccc" };
const td = { padding: "6px", borderBottom: "1px solid #eee", textAlign: "center" as const };