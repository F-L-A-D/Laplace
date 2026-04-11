// web/app/api/rakutnen/pickup/route.ts

import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const baseHotel = searchParams.get("base_hotel");

    const rows = await query(
      `
      SELECT
        date,
        collected_at,
        pickup_7d,
        DATEDIFF(date, collected_at) AS lead
      FROM pickups
      WHERE hotel_id = ?
        AND collected_at >= NOW() - INTERVAL 30 DAY
        AND pickup_7d IS NOT NULL;
      `,
      [baseHotel]
    ) as [RowDataPacket[], any];

    return NextResponse.json(rows);
}
