// web/data/reviews.ts

export async function fetchReviews(
  ids: number[],
  source_id: number
) {
  const params = new URLSearchParams({
    hotel_ids: ids.join(","),
    source_id: String(source_id)
  });

  return fetch(`/api/reviews?${params}`);
}