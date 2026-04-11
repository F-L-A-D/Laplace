export function calcBaseRange(data: any[], baseHotel: number) {
  const values = data
    .filter(d => d.hotel_id === baseHotel)
    .map(d => d.price)
    .filter(v => v != null);

  if (!values.length) {
    return {
      baseMin: 0,
      baseMax: 100,
      safeMin: 0,
      safeMax: 100
    };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1000;

  return {
    baseMin: min,
    baseMax: max,
    safeMin: min - range * 0.1,
    safeMax: max + range * 0.1
  };
}

export function getLineState(
  id: number,
  baseHotel: number,
  hoveredId: number | null,
  pinnedIds: number[]
) {
  const isBase = id === baseHotel;
  const isHovered = hoveredId === id;
  const isPinned = pinnedIds.includes(id);

  const isActive = isBase || isHovered || isPinned;

  const isDimmed =
    hoveredId === null && pinnedIds.length === 0
      ? id !== baseHotel
      : !isActive;

  return { isBase, isHovered, isPinned, isActive, isDimmed };
}

export function getStroke(
  id: number,
  index: number,
  data: any[],
  baseMin: number,
  baseMax: number,
  baseHotel: number,
  colors: string[],
  baseColor: string
) {
  const latest = data
    .filter(d => d.hotel_id === id)
    .at(-1)?.price;

  const isOutOfRange =
    latest != null && (latest < baseMin || latest > baseMax);

  if (isOutOfRange) return "#dc2626";
  if (id === baseHotel) return baseColor;

  return colors[index % colors.length];
}