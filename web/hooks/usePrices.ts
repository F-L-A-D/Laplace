import { useEffect, useState } from "react";
import { fetchPrices } from "@/data/prices";

export function usePrices(
  ids: number[],
  year: string,
  month: string,
  layer: string
){
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!ids.length) {
      setData([]);
      return;
    }

    let cancelled = false;

    fetchPrices(layer, { ids, year, month })
      .then(res => res.json())
      .then(d => {
        if (!cancelled) setData(d);
      })
      .catch(() => {
        if (cancelled) setData([]);
      });
    return() => {
      cancelled = true;
    };
  }, [ids, year, month, layer]);

  return data;
}