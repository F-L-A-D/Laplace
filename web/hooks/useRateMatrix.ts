"use client";

import { useEffect, useState } from "react";
import { fetchRateMatrix } from "@/data/rate";
import { QueryParams } from "@/types/query";

type Row = {
  hotel_id: number;
  date: string;
  price: number;
  score: number;
  market_median_diff: number;
  hotel_median_diff: number;
};

export function useRateMatrix({
  ids = [],
  year,
  month,
  source_id,
  layer
}: QueryParams) {

  const [matrix, setMatrix] = useState<any[]>([]);

  useEffect(() => {
    if (!ids.length) {
      setMatrix(prev => (prev.length === 0 ? prev : []));
      return;
    }

    let cancelled = false;

    fetchRateMatrix({
      ids,
      year,
      month,
      source_id,
      layer
    })
      .then(res => res.json())
      .then((data: Row[]) => {
        if (cancelled) return;

        const map = new Map<string, Row>();

        data.forEach(d => {
          const date = d.date.slice(0, 10);

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

        const hotels = ids.slice(0, 10);
        const mm = String(month).padStart(2, "0");

        const table = days.map(day => {
          const row: any = {
            day,
            cells: {}
          };

          hotels.forEach(hid => {
            if (!hid) return;

            const date = `${year}-${mm}-${day}`;
            const found = map.get(`${hid}_${date}`);

            row.cells[hid] = found || null;
          });

          return row;
        });

        setMatrix(prev => {
          if (JSON.stringify(prev) === JSON.stringify(table)) {
            return prev;
          }
          return table;
        });
      })
      .catch(() => {
        if (!cancelled) setMatrix([]);
      });

    return () => {
      cancelled = true;
    };
  }, [ids, year, month, source_id, layer]);

  return matrix;
}