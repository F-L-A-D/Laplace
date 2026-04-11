import { useEffect, useState } from "react";
import { fetchReviews } from "@/data/reviews";

type Review = {
  hotel_id: number;
  score: number;
  review_count: number
};

export function useReviews(
  ids: number[],
  source_id: number | null
){
  if (!source_id) return [];

  const [data, setData] = useState<Record<number, Review>>({});

  useEffect(() => {
    if (!ids.length) return;

    let cancelled = false;

    fetchReviews(ids, source_id)
      .then(res => res.json())
      .then((rows: Review[]) => {
        if (cancelled) return;
        const map: Record<number, Review> = {};
        rows.forEach(r => {
          map[r.hotel_id] = r;
        });
        setData(map);
      })
      .catch(() => {
        if (!cancelled) setData({});
      });
    return() => {
      cancelled = true;
    };
  }, [ids, source_id]);

  return data;
}