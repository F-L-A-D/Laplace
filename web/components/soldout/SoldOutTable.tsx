// web/components/soldout/SoldOuteTable.tsx

"use client";

import { useMemo } from "react";
import HotelName from "@/components/common/HotelName";
import SectionTitle from "@/components/common/SectionTitle";

const MAX = 5;
const NAME_WIDTH = 140;

type Props = {
  data: any[];
  selected: number[];
  hotelMap: Record<number, string>;
  baseHotel: number | null;
};

export default function SoldOutTable({
  data,
  selected,
  hotelMap,
  baseHotel
}: Props) {

  const map = useMemo(() => {
    const res: Record<number, { rate: number; days: number; total: number }> = {};

    selected.forEach(id => {
      let sold = 0;
      let total = 0;

      data.forEach((row: any) => {
        const v = row[`hotel_${id}`];

        if (v !== undefined) {
          total++;
          if (v === null) sold++;
        }
      });

      res[id] = {
        rate: total ? sold / total : 0,
        days: sold,
        total
      };
    });

    return res;
  }, [data, selected]);

  const ordered = useMemo(() => {
    const arr = [...selected]
    .sort((a, b) => {

      if (a === baseHotel) return -1;
      if (b === baseHotel) return 1;

      return (map[b]?.rate ?? 0) - (map[a]?.rate ?? 0);
    })
    .slice(0, MAX)
    ;

    while (arr.length < MAX) arr.push(-1);
    return arr;
  }, [selected, map, baseHotel]);

  return (
    <>
      <SectionTitle title="SOLD OUT RATE" />
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          tableLayout: "fixed",
          marginTop: "12px"
        }}
      >
        <thead>
          <tr>
            <th style={{ width: NAME_WIDTH }}>Hotel</th>
            <th style={{ width: 60 }}>Rate</th>
            <th style={{ width: 60 }}>Days</th>
          </tr>
        </thead>

        <tbody>
          {ordered.map((id, i) => {
            if (id === -1) {
              return (
                <tr key={`empty_${i}`}>
                  <td style={{ textAlign: "center" }}>-</td>
                  <td style={{ textAlign: "center" }}>-</td>
                  <td style={{ textAlign: "center" }}>-</td>
                </tr>
              );
            }

            const isBase = id === baseHotel;

            return (
              <tr
                key={id}
                style={{
                  backgroundColor: isBase ? "#fff8dc" : "transparent"
                }}
              >
                <td>
                  <HotelName id={id} hotelMap={hotelMap} />
                </td>

                <td style={{ textAlign: "center" }}>
                  {(map[id]?.rate * 100).toFixed(1)}%
                </td>

                <td style={{ textAlign: "center" }}>
                  {map[id]?.days} / {map[id]?.total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}