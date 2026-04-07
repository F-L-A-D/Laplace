"use client";

import HotelName from "@/components/common/HotelName";

type Props = {
  hotels: any[];
  selected: number[];
  setSelected: (v:number[]) => void;
  baseHotel: number | null;
  setBaseHotel: (v:number[]) => void;
  hotelMap: Record<number,string>;
};

export default function BaseHotelMenu({
  hotels,
  selected,
  setSelected,
  baseHotel,
  setBaseHotel,
  hotelMap
}: Props) {

  return (
    <>
      {hotels.map((h: any) => {
        const isSelected = selected.includes(h.id);

        return (
          <div
            key={h.id}
            onClick={() => {
              setBaseHotel(h.id);

              if (!isSelected) {
                setSelected([h.id, ...selected]);
              }
            }}
            style={row()}
          >
            <input
              type="radio"
              checked={baseHotel === h.id}
              onClick={e => e.stopPropagation()}
              readOnly
            />

            <HotelName id={h.id} hotelMap={hotelMap} width={180} />
          </div>
        );
      })}
    </>
  );
}

const row = () => ({
  display: "flex",
  alignItems: "center",
  gap: 6,
  marginBottom: 3,
  cursor: "pointer",
  padding: "2px 4px"
});