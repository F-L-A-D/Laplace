// web/app/api/hotels/route.ts

import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await query(`
    SELECT id, name 
    FROM hotels
    ORDER BY id
  `);

  return NextResponse.json(rows);
}