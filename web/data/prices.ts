function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type Params = {
    ids: number[];
    year: string;
    month: string;
};

export async function fetchPrices (
    layer: string,
    { ids, year, month }: Params
){
    const start = `${year}-${month}-01`;

    const endDate = new Date(
      Number(year),
      Number(month),
      1
    );

    const end = formatDate(endDate);
    
    const params = new URLSearchParams({
        hotel_ids: ids.join(","),
        start_date: start,
        end_date: end
    });

    switch (layer) {
        case "raw_rakuten":
            return fetch (`/api/rakuten/prices?${params}`);
        case "raw_jyalan":
            return fetch (`/api/jalan/prices?${params}`);
        case "normalized":
            return fetch (`/api/normalized/prices?${params}`);
        case "model_global":
            return fetch (`/api/model/prices?${params}`);
        default:
            throw new Error("invalid layer");
    }
}