export function getRowBg(
  id: number,
  baseHotel: number,
  pinnedIds: number[]
) {
  if (id === baseHotel) return "#fff8dc";
  if (pinnedIds.includes(id)) return "#eff6ff";
  return "transparent";
}