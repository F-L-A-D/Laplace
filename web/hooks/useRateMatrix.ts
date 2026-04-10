"use client";

import { useEffect, useState } from "react";

type Row = {
  hotel_id: number;
  date: string;
  price: number;
  score: number;
};

export function useRateMatrix(
  selected: number[],
  year: string,
  month: string
) {
  const [matrix, setMatrix] = useState<any[]>([]);

  useEffect(() => {
    if (!selected.length) return;

    fetch(
      `/api/features?hotel_ids=${selected.join(",")}&year=${year}&month=${month}`
    )
      .then(res => {
        return res.json();
      })
      .then((data: Row[]) => {
        const map = new Map<string, Row>();

        data.forEach(d => {
          const date =
            typeof d.date === "string"
              ? d.date.slice(0, 10)
              : new Date(d.date).toISOString().slice(0, 10);

          map.set(`${d.hotel_id}_${date}`, {
            ...d,
            date
          });
        });

        const lastDay = new Date(
          Number(year),
          Number(month),
          0
        ).getDate();

        const days = Array.from({ length: lastDay }, (_, i) =>
          String(i + 1).padStart(2, "0")
        );

        const hotels = [...selected].slice(0, 5);

        while (hotels.length < 5) {
          hotels.push(null);
        }

        const mm = String(month).padStart(2, "0");
        console.log([...map.keys()].slice(0, 10));
        
        const table = days.map(day => {
          const row: any = { day };

          hotels.forEach((hid, i) => {
            if (!hid) {
              row[`h${i}`] = null;
              return;
            }
            
            const date = `${year}-${mm}-${day}`;
            const found = map.get(`${hid}_${date}`);
            console.log(`${hid}_${year}-${mm}-${day}`);

            row[`h${i}`] = found || null;
          });

          return row;
        });

        setMatrix(table);
      });
  }, [selected, year, month]);

  return matrix;
}