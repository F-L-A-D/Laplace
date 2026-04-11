// web/app/api/features/route.ts

import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const hotelIds = searchParams.get("hotel_ids");
  const start = searchParams.get("start_date");
  const end = searchParams.get("end_date");
  const sourceId = searchParams.get("source_id") || null;
  const layer = searchParams.get("layer") || "raw";
  
  if (!hotelIds || !start || !end) {
    return NextResponse.json([], { status: 400 });
  }

  const ids = hotelIds.split(",").map(Number);
  const placeholders = ids.map(() => "?").join(",");
  
  let table = "features";
  const useSource = layer === "raw";

  if (layer == "normalized") table = "normalized_features"
  if (layer == "model") table = "model_features"
  

  const rows1: any = await query(`
    SELECT MAX(collected_at) as max_collected_at
    FROM ${table}
    ${useSource ? "WHERE source_id = ?" : ""} 
  `,
  useSource ? [Number(sourceId)] : []
  );

  const latest = rows1?.[0]?.max_collected_at;

  if (!latest) {
    throw new Error("No collected_at found");
  }

  try{
    const rows2: any = await query(
      `
        SELECT
          hotel_id,
          DATE_FORMAT(date, '%Y-%m-%d') AS date,
          price,
          score,
          market_median_diff,
          hotel_median_diff
        FROM ${table}
        WHERE collected_at = ?
          AND hotel_id IN (${placeholders})
          ${useSource ? "AND source_id = ?" : ""}
          AND date >= ?
          AND date < ?
        ORDER BY date ASC
      `,
      useSource
      ? [latest, ...ids, Number(sourceId), start, end]
      : [latest, ...ids, start, end]
    ) as [RowDataPacket[], any];

    return NextResponse.json(rows2);

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }  
}