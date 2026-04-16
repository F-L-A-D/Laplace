export function calcBaseRange(data: any[], baseHotel: number) {
  if (!Array.isArray(data) || !data.length) return { baseMin: 0, baseMax: 100, safeMin: 0, safeMax: 100 };

  const allPriceMins = data.map(d => d.price_min).filter(v => v != null);
  
  const marketMin = Math.min(...allPriceMins);
  const marketMax = Math.max(...allPriceMins);

  const baseMins = data.filter(d => d.hotel_id === baseHotel).map(d => d.price_min);
  const baseMin = baseMins.length ? Math.min(...baseMins) : marketMin;

  const range = marketMax - marketMin || 10000;

  return {
    baseMin: baseMin,
    baseMax: marketMax,
    safeMin: Math.max(0, marketMin - range * 0.1),
    safeMax: marketMax + range * 0.2
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

  const latestPrice = data
    .filter(d => d.hotel_id === id)
    .at(-1)?.price_min;

  const isOutOfRange =
    latestPrice != null && (latestPrice < baseMin || latestPrice > baseMax);

  if (isOutOfRange) return "#dc2626";
  if (id === baseHotel) return baseColor;

  return colors[index % colors.length];
}