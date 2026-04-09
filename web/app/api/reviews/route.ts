// web/app/api/reviews/route.ts

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hotel_ids = searchParams.get("hotel_ids");

  if (!hotel_ids) return Response.json([]);

  const ids = hotel_ids.split(",").map(id => Number(id));
  const placeholders = ids.map(() => "?").join(",");

  const rows = await query(
    `
    SELECT r.hotel_id, r.score, r.review_count
    FROM reviews r
    INNER JOIN (
        SELECT hotel_id, MAX(collected_at) AS latest
        FROM reviews
        WHERE hotel_id IN (${placeholders})
        GROUP BY hotel_id
    ) latest_reviews
    ON r.hotel_id = latest_reviews.hotel_id
    AND r.collected_at = latest_reviews.latest
    `,
    ids
  );

  return NextResponse.json(rows);
}