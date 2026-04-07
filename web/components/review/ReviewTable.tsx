"use client";

import { useEffect, useState, useMemo } from "react";
import HotelName from "@/components/common/HotelName";
import SectionTitle from "@/components/common/SectionTitle";

const MAX = 5;
const NAME_WIDTH = 140;

export default function ReviewTable({ selected, hotelMap, baseHotel }: any) {
  const [data, setData] = useState<any>({});

  useEffect(() => {
    if (!selected.length) return;

    fetch(`/api/reviews?hotel_ids=${selected.join(",")}`)
      .then(res => res.json())
      .then(setData);
  }, [selected]);

  const ordered = useMemo(() => {
    const arr = [...selected]
      .sort((a, b) => {

        if (a === baseHotel) return -1;
        if (b === baseHotel) return 1;

        return (data[b]?.score ?? 0) - (data[a]?.score ?? 0);
      })
      .slice(0, MAX);

    while (arr.length < MAX) arr.push(-1);
    return arr;
  }, [selected, data, baseHotel]);

  return (
    <>
      <SectionTitle title="REVIEWS" />
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          tableLayout: "fixed"
        }}
      >
        <thead>
          <tr>
            <th style={{ width: NAME_WIDTH }}>Hotel</th>
            <th style={{ width: 80 }}>Score</th>
            <th style={{ width: 80 }}>Count</th>
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
                  {data[id]?.score ?? "-"}
                </td>

                <td style={{ textAlign: "center" }}>
                  {data[id]?.count ?? "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}