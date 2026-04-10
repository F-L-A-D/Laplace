import { useEffect, useState } from "react";

export function useReviews(ids: number[]) {
  const [data, setData] = useState<Record<number, any>>({});

  useEffect(() => {
    if (!ids.length) return;

    fetch(`/api/reviews?hotel_ids=${ids.join(",")}`)
      .then(res => res.json())
      .then(rows => {
        const map: Record<number, any> = {};

        rows.forEach((r: any) => {
          map[r.hotel_id] = {
            score: r.score,
            review_count: r.review_count
          };
        });

        setData(map);
      });
  }, [ids]);

  return data;
}