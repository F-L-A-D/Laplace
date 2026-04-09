import { query } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const hotelIds = searchParams.get("hotel_ids");

  if (!hotelIds) return Response.json([]);

  const ids = hotelIds.split(",").map(Number);
  const placeholders = ids.map(() => "?").join(",");

  const [rows] = await query(
    `
    SELECT p.hotel_id, p.date, p.collected_at, p.price
    FROM prices p
    JOIN (
      SELECT hotel_id, MAX(collected_at) AS max_ca
      FROM prices
      GROUP BY hotel_id
    ) latest
    ON p.hotel_id = latest.hotel_id
    WHERE p.hotel_id IN (${placeholders})
      AND p.collected_at >= DATE_SUB(latest.max_ca, INTERVAL 30 DAY)
    `,
    [...ids]
  ) as [RowDataPacket[], any];

  return new Response(JSON.stringify(rows), {
    headers: {
      "Cache-Control": "public, max-age=300",
    },
  });
}