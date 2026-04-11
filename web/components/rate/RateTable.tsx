"use client";

import HotelName from "@/components/common/HotelName";
import SectionHeader from "@/components/common/SectionHeader";

import {
  TABLE,
  TH,
  TH_DAY,
  TD_DAY,
  TD_CELL,
  BASE_BORDER,
  LEGEND
} from "@/styles/table";


type Props = {
  matrix: any[];
  hotelMap: Record<number, string>;
  columns: (number | null)[];
  year: string;
  month: string;
  view: {
    baseHotel: number;
    displaySelected: (number | null)[];
    pinned: number[]
  };
};

export default function RateTable({
  matrix,
  hotelMap,
  columns,
  year,
  month,
  view
}: Props) {
  const { baseHotel } = view;
  const hotels = columns;


  return (
    <div style={{ height: "100%" }}>

       <SectionHeader 
        title="RATE (PRICE / DIFF)"
        legend={
          <div style={LEGEND}>
            <span>M = market_median_diff</span>
            <span style={{ marginLeft: "12px" }}>H = hotel_median_diff</span>
          </div>
        }
       />

      <table style={TABLE}>

        <thead>
          <tr>
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
                {hotels.map((hid, i) => {
                  if(!hid){
                    return <td key={i} style={TD_CELL}>-</td>;
                  }
                  const cell = hid ? row.cells?.[hid] : null;
                  const isBase = hid === baseHotel;
                  const bg = cell 
                    ? scoreToColor(cell.score)
                    : "#f9fafb"; 

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
