export function buildRows(
  payload: any[],
  displaySelected: number[],
  baseHotel: number
) {
  const rows = displaySelected.map((id: number) => {
    const key = `hotel_${id}`;
    const entry = payload?.find((p: any) => p.dataKey === key);

    return {
      id,
      value: entry?.value ?? null
    };
  });

  const base = rows.find(r => r.id === baseHotel)?.value ?? null;

  return rows.map(r => ({
    ...r,
    diff:
      base != null && r.value != null
        ? r.value - base
        : null
  }));
}

export function sortRows(
  rows: any[],
  baseHotel: number,
  pinnedIds: number[]
) {
  return [...rows].sort((a, b) => {
    if (a.id === baseHotel) return -1;
    if (b.id === baseHotel) return 1;

    const aNull = a.value == null;
    const bNull = b.value == null;

    if (aNull && !bNull) return -1;
    if (!aNull && bNull) return 1;

    const aPinned = pinnedIds.includes(a.id);
    const bPinned = pinnedIds.includes(b.id);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    return (b.value ?? -1) - (a.value ?? -1);
  });
}

export function formatDiff(diff: number) {
  const sign = diff > 0 ? "+" : "";
  return `${sign}${(diff / 1000).toFixed(1)}K`;
}