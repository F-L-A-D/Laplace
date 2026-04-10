import { useEffect, useMemo, useState } from "react";

type Review = {
  score: number;
  review_count: number;
};

export function useReviews(ids: number[]) {
  const [data, setData] = useState<Record<number, Review>>({});
  const key = useMemo(() => ids.join(","), [ids]);

  useEffect(() => {
    if (!key) {
      setData({});
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/reviews?hotel_ids=${key}`,
          { signal: controller.signal }
        );

        const rows = await res.json();

        const map: Record<number, Review> = {};

        rows.forEach((r: any) => {
          map[r.hotel_id] = {
            score: r.score,
            review_count: r.review_count
          };
        });

        setData(map);
      } catch (e: any) {
        if (e.name === "AbortError") return;
        console.error(e);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, [key]);

  return data;
}