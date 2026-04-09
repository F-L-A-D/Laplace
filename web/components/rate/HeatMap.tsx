"use client";

import HotelName from "@/components/common/HotelName";
import SectionTitle from "@/components/common/SectionTitle";
import { sortHotels } from "@/utils/sortHotels";

import {
  TABLE,
  TH,
  TH_DAY,
  TD_DAY,
  TD_CELL,
  BASE_BORDER
} from "@/components/common/tableStyles";

type Props = {
  matrix: any[];
  hotelMap: Record<number, string>;
  selected: number[];
  baseHotel: number;
  year: string;
  month: string;
  pinnedIds: number[];
};

export default function HeatMap({
  matrix,
  hotelMap,
  selected,
  baseHotel,
  year,
  month,
  pinnedIds
}: Props) {

  const scale = calcScale(matrix);

  const sorted = sortHotels(selected, baseHotel,pinnedIds);
  const hotels = sorted.slice(0, 5);
  while (hotels.length < 5) hotels.push(null);

  return (
    <div style={{ overflow: "auto", height: "100%" }}>
      <div style={{ marginBottom: "4px" }}>
        <SectionTitle title="HEAT MAP (SCORE)" />

        <div style={legendWrap}>
          <div style={gradientBar} />

          <div style={legendScale}>
            <span>-{formatScale(scale)}</span>
            <span>0</span>
            <span>+{formatScale(scale)}</span>
          </div>
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

                  const bg = cell
                    ? scoreToColor(cell.score, scale)
                    : "transparent";

                  return (
                    <td
                      key={i}
                      style={{
                        ...TD_CELL,
                        background: bg,
                        ...(isBase ? BASE_BORDER : {})
                      }}
                      title={cell ? buildTooltip(cell, hotelMap) : "-"}
                    >
                      {cell && (
                        <div style={{
                            ...scoreText,
                            color: getTextColor(cell.score)
                          }}>
                          {formatScore(cell.score)}  
                        </div>
                      )}
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

function scoreToColor(score: number, scale: number) {
  const v = Math.max(-scale, Math.min(scale, score));
  const gamma = 0.7;
  const ratio = Math.pow(Math.abs(v / scale), gamma);

  if (v > 0) {
    return `rgba(0, 180, 0, ${ratio})`;
  } else {
    return `rgba(220, 0, 0, ${ratio})`;
  }
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

function formatScore(s: number) {
  return s.toFixed(2);
}

function getTextColor(score: number) {
  const abs = Math.abs(score);
  if (abs > 3) return "#fff";
  return "#333";
}

function calcScale(matrix: any[]) {
  const scores: number[] = [];

  matrix.forEach(row => {
    Object.values(row).forEach((cell: any) => {
      if (cell && typeof cell === "object") {
        scores.push(cell.score);
      }
    });
  });

  if (!scores.length) return 0.3;

  scores.sort((a, b) => a - b);

  const p95 = scores[Math.floor(scores.length * 0.95)];
  const p5  = scores[Math.floor(scores.length * 0.05)];

  const max = Math.max(Math.abs(p95), Math.abs(p5));

  return max || 0.3;
}

function formatScale(v: number) {
  return (v).toFixed(2);
}

const scoreText = {
  fontSize: "9px",
  color: "rgba(0,0,0,0.6)",
  textAlign: "center" as const,
  lineHeight: "1",
  userSelect: "none" as const,
  fontVariantNumeric: "tabular-nums"
}
const legendWrap = {
  marginTop: "4px"
};

const gradientBar = {
  height: "6px",
  width: "100%",
  borderRadius: "3px",
  background:
    "linear-gradient(to right, rgb(220,0,0), #fff, rgb(0,180,0))"
};

const legendScale = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "10px",
  color: "#666",
  marginTop: "2px"
};