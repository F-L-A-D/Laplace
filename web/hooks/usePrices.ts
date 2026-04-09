"use client";

import { useEffect, useState } from "react";

export function usePrices(
  selected: number[],
  year: string,
  month: string
) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!selected.length) return;

    const lastDay = new Date(
      Number(year),
      Number(month),
      0
    ).getDate();

    const start = `${year}-${month}-01`;
    const end = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

    fetch(
      `/api/prices?hotel_ids=${selected.join(",")}&start_date=${start}&end_date=${end}`
    )
      .then(res => res.json())
      .then(json => {
        const grouped: any = {};

        json.forEach((r: any) => {
          const date = new Date(r.date)
            .toLocaleDateString("sv-SE");

          if (!grouped[date]) grouped[date] = { date };

          grouped[date][`hotel_${r.hotel_id}`] = r.price;
        });

        setData(Object.values(grouped));
      });
  }, [selected, year, month]);

  return data;
}