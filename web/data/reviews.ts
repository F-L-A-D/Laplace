type Params = {
    ids: number[];
};

export async function fetchReviews (
    layer: string,
    { ids }: Params
){
    const qs = `hotel_ids=${ids.join(",")}`;
    
    switch (layer) {
        case "raw_rakuten":
            return fetch (`/api/rakuten/reviews?${qs}`);
        case "raw_jyalan":
            return fetch (`/api/jalan/reviews?${qs}`);
        case "normalized":
            return fetch (`/api/normalized/reviews?${qs}`);
        case "model_global":
            return fetch (`/api/model/reviews?${qs}`);
        default:
            throw new Error("invalid layer");
    }
}