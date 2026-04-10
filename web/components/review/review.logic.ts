export function buildReviewRows(
  ids: number[],
  data: Record<number, any>,
  max = 5
) {
  const arr: (number | null)[] = ids.slice(0, max);

  while (arr.length < max) arr.push(null);

  return arr.map(id => ({
    id,
    score: id ? data[id]?.score ?? null : null,
    count: id ? data[id]?.review_count ?? null : null
  }));
}