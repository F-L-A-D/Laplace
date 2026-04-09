"use client";

import HotelName from "@/components/common/HotelName";
import SectionTitle from "@/components/common/SectionTitle";

import {
  TABLE,
  TH,
  TH_DAY,
  TD_DAY,
  TD_CELL,
  BASE_BORDER,
  LEGEND
} from "@/components/common/tableStyles";

type Props = {
  matrix: any[];
  hotelMap: Record<number, string>;
  selected: number[];
  baseHotel: number;
  year: string;
  month: string;
};

export default function RateTable({
  matrix,
  hotelMap,
  selected,
  baseHotel,
  year,
  month
}: Props) {

  const safeSelected = selected ?? [];

  const sorted = [
    baseHotel,
    ...safeSelected.filter(h => h !== baseHotel)
  ];

  const hotels = sorted.slice(0, 5);
  while (hotels.length < 5) hotels.push(null);

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      <div style={{ marginBottom: "4px" }}>
        <SectionTitle title="RATE (PRICE / DIFF)" />
        <div style={LEGEND}>
          <span>M = market</span>
          <span style={{ marginLeft: "12px" }}>H = hotel</span>
        </div>
      </div>

      <table style={TABLE}>

        <thead>
          <tr>
            <th style={TH_DAY}>Day</th>

            {hotels.map((hid, i) => {
              const isBase = hid === baseHotel;

              return (
                <th
                  key={i}
                  style={{
                    ...TH,
                    ...(isBase ? BASE_BORDER : {})
                  }}
                >
                  {hid ? (
                    <HotelName
                      id={hid}
                      hotelMap={hotelMap}
                      width={120}
                    />
                  ) : "-"}
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {matrix.map((row, idx) => {

            const isWeekend = isSatOrSun(year, month, row.day);

            return (
              <tr
                key={idx}
                style={{
                  background: isWeekend ? "#fafafa" : "transparent"
                }}
              >
                <td style={TD_DAY}>{row.day}</td>

                {hotels.map((hid, i) => {
                  const cell = Object.values(row).find(
                    (c: any) => c?.hotel_id === hid
                  ) as any | undefined;
                  const isBase = hid === baseHotel;
                  const bg = cell ? scoreToColor(cell.score): "transparent"; 

                  return (
                    <td
                      key={i}
                      style={{
                        ...TD_CELL,
                        backgroundColor: bg,
                        ...(isBase ? BASE_BORDER : {})
                      }}
                      title={
                        cell
                          ? buildTooltip(cell, hotelMap)
                          : "-"
                      }
                    >
                      {cell ? (
                        <div style={cellWrap}>
                          <div style={priceText}>
                            {formatPrice(cell.price)}
                          </div>

                          <div style={diffText}>
                            M:{formatPct(cell.market_median_diff)}{" "}
                            H:{formatPct(cell.hotel_median_diff)}
                          </div>
                        </div>
                      ) : "-"}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------
// utils
// ------------------------

function formatPrice(p: number) {
  return `¥${p.toLocaleString()}`;
}

function formatPct(v: number) {
  const sign = v > 0 ? "+" : "";
  return `${sign}${(v * 100).toFixed(0)}%`;
}

function buildTooltip(cell: any, hotelMap: Record<number, string>) {
  return `
Price: ¥${cell.price.toLocaleString()}
Score: ${cell.score.toFixed(3)}
M: ${(cell.market_median_diff * 100).toFixed(1)}%
H: ${(cell.hotel_median_diff * 100).toFixed(1)}%
`;
}

function isSatOrSun(year: string, month: string, day: string) {
  const d = new Date(`${year}-${month}-${day}`);
  const w = d.getDay();
  return w === 0 || w === 6;
}

function scoreToColor(score: number) {
  const max = 0.5;
  const v = Math.max(-max, Math.min(max, score));

  if (v > 0) {
    return `rgba(0, 180, 0, ${(v / max*0.15)})`;
  } else {
    return `rgba(220, 0, 0, ${(-v / max*0.15)})`;
  }
}

const cellWrap = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  overflow: "hidden"
};

const priceText = {
  fontWeight: 700,
  lineHeight: "13px",
  fontVariantNumeric: "tabular-nums"
};

const diffText = {
  fontSize: "10px",
  color: "#666",
  lineHeight: "12px",
  marginTop: "2px",
  fontVariantNumeric: "tabular-nums"
};
