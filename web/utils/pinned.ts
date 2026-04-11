export function reorderPinned(
  prev: number[],
  fromIndex: number,
  toIndex: number
) {
  const next = [...prev];

  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);

  return next;
}

export function sortHotels(
  selected: (number | null)[],
  baseHotel: number,
  pinnedIds: (number | null)[] = []
) {
  const selectedSet = new Set(selected);
  const pinned = pinnedIds.filter(id => selectedSet.has(id));

  const rest = selected.filter(
    id => id !== baseHotel && !pinned.includes(id)
  );

  return [
    baseHotel,
    ...pinned,
    ...rest
  ];
}