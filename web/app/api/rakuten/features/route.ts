// web/app/api/rakuten/features/route.ts

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const hotelIds = searchParams.get("hotel_ids");
  const year = searchParams.get("year");
  const month = searchParams.get("month");

  if (!hotelIds || !year || !month) {
    return NextResponse.json(
      { error: "missing params" },
      { status: 400 }
    );
  }

  const ids = hotelIds.split(",");

  const start = new Date(Number(year), Number(month) - 1, 1);
  const end   = new Date(Number(year), Number(month), 1);

  const startStr = formatDate(start);
  const endStr   = formatDate(end);

  function formatDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const rows1: any = await query(`
    SELECT MAX(collected_at) as max_collected_at
    FROM features
  `);

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
        FROM features
        WHERE collected_at = ?
          AND hotel_id IN (${ids.map(() => "?").join(",")})
          AND date >= ?
          AND date < ?
        ORDER BY date ASC
      `,
      [latest, ...ids, startStr, endStr]
    );

    return NextResponse.json(rows2);

  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "db error"},
      { status: 500}
    );
  }  
}