// web/app/api/rakuten/prices/route.ts

import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hotelIds = searchParams.get("hotel_ids");
  const start = searchParams.get("start_date");
  const end = searchParams.get("end_date");
  const sourceId = searchParams.get("source_id");
  const layer = searchParams.get("layer") || "raw";

  if (!hotelIds || !start || !end) {
    return NextResponse.json([], { status: 400 });
  }

  const ids = hotelIds.split(",").map(Number);
  const placeholders = ids.map(() => "?").join(",");
  const useSource = layer === "raw";
  
  const table = 
    layer === "normalized" ? "normalized_prices" :
    layer === "model" ? "model_prices" : 
    "prices";

  const queryParams: any[] = [];

  if (useSource) queryParams.push(Number(sourceId));
  queryParams.push(...ids);
  if (useSource) queryParams.push(Number(sourceId));
  queryParams.push(start, end);

  try {
    const rows = await query(
      `
      SELECT 
        p.hotel_id,
        DATE_FORMAT(p.date, '%Y-%m-%d') AS date,
        p.price_min,
        p.price_max,
        p.status
      FROM ${table} p
      JOIN (
        SELECT 
          hotel_id, 
          date, 
          MAX(collected_at) AS max_ca
        FROM ${table}
        WHERE 1=1
          ${useSource ? "AND source_id = ?" : ""}
        GROUP BY hotel_id, date
      ) latest
        ON p.hotel_id = latest.hotel_id
        AND p.date = latest.date
        AND p.collected_at = latest.max_ca
      WHERE p.hotel_id IN (${placeholders})
        ${useSource ? "AND p.source_id = ?" : ""}
        AND p.date >= ?
        AND p.date < ?
      ORDER BY p.date ASC
      `,
      queryParams
    ) as [RowDataPacket[], any];

    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}