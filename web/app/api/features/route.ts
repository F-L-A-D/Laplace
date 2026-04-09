// web/app/api/features/route.ts

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

  const start = `${year}-${month}-01`;
  const lastDay = new Date(
    Number(year),
    Number(month),
    0
  ).getDate();

  const end = `${year}-${month}-${String(lastDay).padStart(2, "0")}`;

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
        date,
        price,
        score,
        market_median_diff,
        hotel_median_diff
      FROM features
      WHERE collected_at = ?
        AND hotel_id IN (${ids.map(() => "?").join(",")})
        AND date BETWEEN ? AND ?
      ORDER BY date ASC
      `,
      [latest, ...ids, start, end]
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