// web/app/api/rakuten/prices/route.ts

import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const hotelIds = searchParams.get("hotel_ids");
  const start = searchParams.get("start_date");
  const end = searchParams.get("end_date");

  if (!hotelIds || !start || !end) {
    return NextResponse.json([]);
  }

  const ids = hotelIds.split(",").map(Number);
  const placeholders = ids.map(() => "?").join(",");

  const rows = await query(
    `
    SELECT 
      p.hotel_id,
      DATE_FORMAT(p.date, '%Y-%m-%d') AS date,
      p.price
    FROM prices p
    JOIN (
      SELECT 
        hotel_id,
        date,
        MAX(collected_at) AS max_ca
      FROM prices
      GROUP BY hotel_id, date
    ) latest
      ON p.hotel_id = latest.hotel_id
      AND p.date = latest.date
      AND p.collected_at = latest.max_ca
    WHERE p.hotel_id IN (${placeholders})
      AND p.date >= ?
      AND p.date < ?
    ORDER BY p.date ASC
    `,
    [...ids, start, end]
  ) as [RowDataPacket[], any];

  return NextResponse.json(rows);
}