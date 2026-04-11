"use client";

import { useEffect, useState } from "react";
import { fetchRateMatrix } from "@/data/rate";
import { start } from "repl";

type Row = {
  hotel_id: number;
  date: string;
  price: number;
  score: number;
  market_median_diff: number;
  hotel_median_diff: number;
};

export function useRateMatrix(
  selected: number[],
  year: string,
  month: string,
  layer: string
) {
  const [matrix, setMatrix] = useState<any[]>([]);

  useEffect(() => {
    if (!selected.length) {
      setMatrix([]);
      return;
    }

    let cancelled = false;

    fetchRateMatrix(layer, { ids: selected, year, month })
      .then(res => res.json())
      .then((data: Row[]) => {
        if (cancelled) return;

        // --- map化 ---
        const map = new Map<string, Row>();

        data.forEach(d => {
          const date = d.date.slice(0, 10);

          map.set(`${d.hotel_id}_${date}`, {
            ...d,
            date
          });
        });

        // --- 日付生成 ---
        const lastDay = new Date(
          Number(year),
          Number(month),
          0
        ).getDate();

        const days = Array.from({ length: lastDay }, (_, i) =>
          String(i + 1).padStart(2, "0")
        );

        const hotels = selected.slice(0, 10);
        const mm = String(month).padStart(2, "0");

        // --- table生成  ---
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

        setMatrix(table);
      })
      .catch(() => {
        if (!cancelled) setMatrix([]);
      });

    return () => {
      cancelled = true;
    };
  }, [selected, year, month, layer]);

  return matrix;
}