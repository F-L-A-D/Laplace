// web/app/api/reviews/route.ts

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const hotel_ids = searchParams.get("hotel_ids");
  const source_id = searchParams.get("source_id");

  if (!hotel_ids) return NextResponse.json([]);

  const ids = hotel_ids.split(",").map(Number);
  const placeholders = ids.map(() => "?").join(",");

  const latestRows: any = await query(
    `
    SELECT MAX(collected_at) AS latest
    FROM reviews
    ${source_id ? "WHERE source_id = ?" : ""}
    `,
    source_id ? [Number(source_id)] : []
  );

  const latest = latestRows?.[0]?.latest;

  if (!latest) {
    return NextResponse.json([]);
  }

  const rows: any = await query(
    `
    SELECT hotel_id, score, review_count
    FROM reviews
    WHERE collected_at = ?
      AND hotel_id IN (${placeholders})
      ${source_id ? "AND source_id = ?" : ""}
    `,
    source_id
      ? [latest, ...ids, Number(source_id)]
      : [latest, ...ids]
  );

  return NextResponse.json(rows);
}