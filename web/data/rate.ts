type Params = {
    ids: number[];
    year: string;
    month: string;
};

export async function fetchRateMatrix (
    layer: string,
    { ids, year, month }: Params
){
    const qs = `hotel_ids=${ids.join(",")}&year=${year}&month=${month}`;

    switch (layer) {
        case "raw_rakuten":
            return fetch (`/api/rakuten/features?${qs}`);
        case "raw_jyalan":
            return fetch (`/api/jalan/features?${qs}`);
        case "normalized":
            return fetch (`/api/normalized/features?${qs}`);
        case "model_global":
            return fetch (`/api/model/features?${qs}`);
        default:
            throw new Error("invalid layer");
    }
}