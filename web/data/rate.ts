import { dateRangeBuilder } from "@/utils/strDate";
import { QueryParams } from "@/types/query";

export async function fetchRateMatrix ({
  ids, 
  year, 
  month,
  source_id, 
}: QueryParams){
  const { start, end } = dateRangeBuilder(year, month);
  
  const params = new URLSearchParams({
      hotel_ids: ids.join(","),
      start_date: start,
      end_date: end,
  });

  if(source_id !== undefined){
    params.append("source_id", String(source_id));
  }

  return fetch(`api/features?${params}`);
}