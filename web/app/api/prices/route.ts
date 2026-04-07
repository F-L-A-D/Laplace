import { db } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const hotelIds = searchParams.get("hotel_ids");
  const start = searchParams.get("start_date");
  const end = searchParams.get("end_date");

  if (!hotelIds || !start || !end) return Response.json([]);

  const ids = hotelIds.split(",").map(Number);
  const placeholders = ids.map(() => "?").join(",");

  const [rows] = await db.query(
    `
    SELECT p.hotel_id, p.date, p.price
    FROM prices p
    JOIN (
      SELECT hotel_id, date, MAX(collected_at) AS max_ca
      FROM prices
      GROUP BY hotel_id, date
    ) latest
    ON p.hotel_id = latest.hotel_id
    AND p.date = latest.date
    AND p.collected_at = latest.max_ca
    WHERE p.hotel_id IN (${placeholders})
      AND p.date BETWEEN ? AND ?
    `,
    [...ids, start, end]
  ) as [RowDataPacket[], any];

  return Response.json(rows);
}