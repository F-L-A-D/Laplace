// web/utils/strDate.ts

export function dateRangeBuilder(
  year: string | null, month: string | null
) :{start: string, end: string} {
  const start = `${year}-${month}-01`;

  const d = new Date(
    Number(year),
    Number(month),
    1
  );
  
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  
  const end = `${y}-${m}-${day}`;

  return { start , end };
}