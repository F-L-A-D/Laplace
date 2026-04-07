"use client";

import HotelName from "@/components/common/HotelName";

type Props = {
  hotels: any[];
  selected: number[];
  setSelected: (v:number[]) => void;
  baseHotel: number | null;
  hotelMap: Record<number,string>;
};

export default function SelectHotelMenu({
  hotels,
  selected,
  setSelected,
  baseHotel,
  hotelMap
}: Props) {

  const sorted = [...hotels].sort((a, b) => {
    if (a.id === baseHotel) return -1;
    if (b.id === baseHotel) return 1;

    const aSel = selected.includes(a.id) ? 1 : 0;
    const bSel = selected.includes(b.id) ? 1 : 0;

    if (aSel !== bSel) return bSel - aSel;

    return hotelMap[a.id].localeCompare(hotelMap[b.id]);
  });

  const toggle = (id: number) => {
    if (id === baseHotel) return;

    if (selected.includes(id)) {
      setSelected(selected.filter(v => v !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  return (
    <>
      {sorted.map((h: any) => {
        const isBase = h.id === baseHotel;
        const checked = selected.includes(h.id);

        return (
          <div
            key={h.id}
            onClick={() => toggle(h.id)}
            style={{
              ...row(),
              cursor: isBase ? "not-allowed" : "pointer",
              opacity: isBase ? 0.6 : 1
            }}
          >
            <input
              type="checkbox"
              checked={checked}
              disabled={isBase}
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
  padding: "2px 4px"
});