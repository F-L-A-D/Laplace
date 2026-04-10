"use client";

import { useState, useMemo } from "react";
import HotelRow from "./HotelRow";

type Hotel = {
  id: number;
  name: string;
};

type Props = {
  hotels: Hotel[];
  baseHotel: number;
  setBaseHotel: (id: number) => void;
  hotelMap: Record<number, string>;
  pinnedIds: number[];
};

export default function BaseHotelMenu({
  hotels,
  baseHotel,
  setBaseHotel,
  hotelMap,
  pinnedIds
}: Props) {
  const [keyword, setKeyword] = useState("");

  const filtered = useMemo(() => {
    return hotels.filter(h =>
      h.name.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [hotels, keyword]);

  const sorted = useMemo(() => {
    const safePinned = pinnedIds ?? [];

    const base = filtered.find(h => h.id === baseHotel);

    const pinned = filtered.filter(
      h => safePinned.includes(h.id) && h.id !== baseHotel
    );

    const others = filtered.filter(
      h =>
        !safePinned.includes(h.id) &&
        h.id !== baseHotel
    );

    return [
      ...(base ? [base] : []),
      ...pinned,
      ...others
    ];
  }, [filtered, pinnedIds, baseHotel]);

  return (
    <div>
      <div style={title}>Base Hotel</div>

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search..."
        style={search}
      />

      <div style={list} className="modal-scroll">
        {sorted.map(h => (
          <HotelRow
            key={h.id}
            id={h.id}
            hotelMap={hotelMap}
            isBase={h.id === baseHotel}
            isPinned={pinnedIds.includes(h.id)}
            onClick={() => setBaseHotel(h.id)}
          />
        ))}
      </div>
    </div>
  );
}

const title = { fontSize: "13px", fontWeight: 600, marginBottom: 8 };

const search = {
  width: "100%",
  padding: "6px 8px",
  marginBottom: "8px",
  border: "1px solid #ddd",
  borderRadius: "4px"
};

const list = {
  maxHeight: "320px",
  overflowY: "auto",
  overflowX: "hidden"
} as const;