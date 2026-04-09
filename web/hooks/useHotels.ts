"use client";

import { useEffect, useState } from "react";

export function useHotels() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [hotelMap, setHotelMap] = useState<Record<number, string>>({});
  const [selected, setSelected] = useState<number[]>([]);
  const [baseHotel, setBaseHotel] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/hotels")
      .then(res => res.json())
      .then(list => {
        list.sort((a: any, b: any) =>
          a.name.localeCompare(b.name, "en")
        );

        setHotels(list);

        const map: Record<number, string> = {};
        list.forEach((h: any) => (map[h.id] = h.name));
        setHotelMap(map);

        const ids = list.slice(0, 3).map((h: any) => h.id);
        setSelected(ids);
        setBaseHotel(ids[0]);
      });
  }, []);

  return {
    hotels,
    hotelMap,
    selected,
    setSelected,
    baseHotel,
    setBaseHotel
  };
}