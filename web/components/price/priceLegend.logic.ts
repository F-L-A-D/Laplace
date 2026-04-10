export function buildLegendData(
  selected: number[],
  payload: any[],
  data: any[],
  hotelMap: Record<number, string>
) {
  const latest = data[data.length - 1];
  const unique = Array.from(new Set(selected));

  return unique.map((id) => {
    const key = `hotel_${id}`;
    const p = payload.find((x: any) => x.dataKey === key);

    return {
      id,
      name: hotelMap[id],
      color: p?.color ?? "#ccc",
      price: latest?.[key] ?? null
    };
  });
}

export function sortLegend(
  list: any[],
  baseHotel: number,
  pinnedIds: number[]
) {
  return [...list].sort((a, b) => {
    if (a.id === baseHotel) return -1;
    if (b.id === baseHotel) return 1;

    const aPinned = pinnedIds.includes(a.id);
    const bPinned = pinnedIds.includes(b.id);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    return a.name.localeCompare(b.name, "en");
  });
}

export function splitVisible(list: any[], max = 5) {
  return {
    visible: list.slice(0, max),
    hidden: list.slice(max)
  };
}

export function getLegendState(
  id: number,
  baseHotel: number,
  hoveredId: number | null,
  pinnedIds: number[]
) {
  const isBase = id === baseHotel;
  const isPinned = pinnedIds.includes(id);
  const isHovered = hoveredId === id;

  const isActive = isBase || isPinned || isHovered;
  const hasFocus = hoveredId != null || pinnedIds.length > 0;

  const isDimmed = hasFocus ? !isActive : id !== baseHotel;

  return { isBase, isPinned, isHovered, isActive, isDimmed };
}