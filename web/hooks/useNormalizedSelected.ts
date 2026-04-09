"use client";

import { useMemo } from "react";

export function useNormalizedSelected(
  selected: number[],
  baseHotel: number | null
) {
  return useMemo(() => {
    if (!baseHotel) return selected;

    return selected.includes(baseHotel)
      ? selected
      : [baseHotel, ...selected];
  }, [selected, baseHotel]);
}