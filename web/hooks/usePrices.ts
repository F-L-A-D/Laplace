//web/hooks/usePrices.ts

import { useEffect, useState } from "react";
import { fetchPrices } from "@/data/prices";
import { QueryParams } from "@/types/query";

export function usePrices({ ids = [], year, month, source_id, layer = "raw" }: QueryParams) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!ids.length) {
      setData([]);
      return;
    }

    let cancelled = false;

    fetchPrices({ ids, year, month, source_id, layer })
      .then((res) => res.json())
      .then((d: any[]) => {
        if (!cancelled) {
          setData(d); 
        }
      })
      .catch(() => {
        if (!cancelled) setData([]);
      });

    return () => {
      cancelled = true;
    };
  }, [ids, year, month, source_id, layer]);

  return data;
}