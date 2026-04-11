"use client";

import { useState, useMemo } from "react";
import HotelRow from "./HotelRow";

type Hotel = {
  id: number;
  name: string;
};

type Props = {
  hotels: Hotel[];
  selected: number[];
  baseHotel: number;
  hotelMap: Record<number, string>;
  pinnedIds: number[];
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
};

export default function SelectHotelMenu({
  hotels,
  selected,
  baseHotel,
  hotelMap,
  pinnedIds,
  onAdd,
  onRemove
}: Props) {
  const [keyword, setKeyword] = useState("");

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const pinnedSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);

  const filtered = useMemo(() => {
    const k = keyword.toLowerCase();
    return hotels.filter(h =>
      h.name.toLowerCase().includes(k)
    );
  }, [hotels, keyword]);

  // -------- grouping --------
  const base = filtered.find(h => h.id === baseHotel);

  const pinned = filtered.filter(
    h => pinnedSet.has(h.id) && h.id !== baseHotel
  );

  const selectedItems = filtered.filter(
    h =>
      selectedSet.has(h.id) &&
      !pinnedSet.has(h.id) &&
      h.id !== baseHotel
  );

  const others = filtered.filter(
    h =>
      !selectedSet.has(h.id) &&
      !pinnedSet.has(h.id) &&
      h.id !== baseHotel
  );

  // -------- action --------
  const toggle = (id: number) => {
    if (id === baseHotel) return;

    if (selectedSet.has(id)) {
      onRemove(id);
    } else {
      onAdd(id);
    }
  };

  return (
    <div>
      <div style={title}>Select Hotels</div>

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search..."
        style={search}
      />

      <div style={list}>
        
        {/* BASE */}
        {base && (
          <>
            <div style={section}>BASE</div>
            <HotelRow
              id={base.id}
              hotelMap={hotelMap}
              checked
              isBase
            />
          </>
        )}

        {/* PINNED */}
        {pinned.length > 0 && (
          <>
            <div style={section}>PINNED</div>
            {pinned.map(h => (
              <HotelRow
                key={h.id}
                id={h.id}
                hotelMap={hotelMap}
                checked={selectedSet.has(h.id)}
                isPinned
                onClick={() => toggle(h.id)}
              />
            ))}
          </>
        )}

        {/* SELECTED */}
        {selectedItems.length > 0 && (
          <>
            <div style={section}>SELECTED</div>
            {selectedItems.map(h => (
              <HotelRow
                key={h.id}
                id={h.id}
                hotelMap={hotelMap}
                checked
                onClick={() => toggle(h.id)}
              />
            ))}
          </>
        )}

        {/* HOTELS */}
        <div style={section}>HOTELS</div>
        {others.map(h => (
          <HotelRow
            key={h.id}
            id={h.id}
            hotelMap={hotelMap}
            checked={false}
            onClick={() => toggle(h.id)}
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

const section = {
  fontSize: "10px",
  color: "#999",
  padding: "6px 8px"
};