export function sortHotels(
  selected: number[] = [],
  baseHotel: number,
  pinnedIds: number[] = []
) {
  if (!selected.length) return [];

  const pins = pinnedIds ?? [];

  const rest = selected.filter(
    id => id !== baseHotel && !pins.includes(id)
  );

  return [
    baseHotel,
    ...pins.filter(id => id !== baseHotel),
    ...rest
  ];
}