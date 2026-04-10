"use client";

import { useMemo } from "react";

export function useNormalizedSelected(
  selected: number[],
  baseHotel: number | null
) {
  return useMemo(() => {
    if (!baseHotel) return selected;

    const unique = Array.from(new Set(selected));
    const rest = unique.filter(id => id !== baseHotel);

    return [baseHotel, ...rest];
  }, [selected, baseHotel]);
}