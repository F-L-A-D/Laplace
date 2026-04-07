import { db } from "@/lib/db";

export async function GET() {
  const [rows] = await db.query(`
    SELECT id, name 
    FROM hotels
    ORDER BY id
  `);

  return Response.json(rows);
}