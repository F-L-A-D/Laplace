export function buildSoldOutMap(
  data: any[],
  ids: number[]
) {
  const res: Record<number, {
    rate: number;
    days: number;
    total: number;
  }> = {};

  ids.forEach(id => {
    let sold = 0;
    let total = 0;

    data.forEach(row => {
      const v = row[`hotel_${id}`];

      if (v !== undefined) {
        total++;
        if (v === null) sold++;
      }
    });

    res[id] = {
      rate: total ? sold / total : 0,
      days: sold,
      total
    };
  });

  return res;
}

export function buildSoldOutRows(
  ids: number[],
  map: Record<number, any>,
  max = 5
) {
  const arr: (number | null)[] = ids.slice(0, max);

  while (arr.length < max) arr.push(null);

  return arr.map(id => ({
    id,
    rate: id != null ? map[id]?.rate ?? null : null,
    days: id != null ? map[id]?.days ?? null : null,
    total: id != null ? map[id]?.total ?? null : null
  }));
}