// web/componetns/layers/Layer1.tsx

"use client";

import PriceChart from "@/components/price/PriceChart";
import ReviewTable from "@/components/review/ReviewTable";
import SoldOutTable from "@/components/soldout/SoldOutTable";

type Props = {
  data: any[];
  selected: number[];
  baseHotel: number;
  hotelMap: Record<number, string>;
  setSelected: (v: number[]) => void;
  pinnedIds: number[];
  setPinnedIds: (v: number[]) => void
};

export default function Layer1({
  data,
  selected,
  baseHotel,
  hotelMap,
  setSelected,
  pinnedIds,
  setPinnedIds
}: Props) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        gap: "24px",
        minHeight: 0
      }}
    >
      {/* 左 */}
      <div
        style={{
          flex: 7,
          maxWidth: "1000px",
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0
        }}
      >
        <PriceChart
          data={data}
          selected={selected}
          baseHotel={baseHotel}
          hotelMap={hotelMap}
          setSelected={setSelected}
          pinnedIds={pinnedIds}
          setPinnedIds={setPinnedIds}
        />
      </div>

      {/* 右 */}
      <div
        style={{
          flex: 3,
          maxWidth: "520px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          paddingBottom: "8px",
          minHeight: 0
        }}
      >
        <div style={{ flex: 0.8, overflow: "auto" }}>
          <ReviewTable
            selected={selected}
            hotelMap={hotelMap}
            baseHotel={baseHotel}
          />
        </div>

        <div style={{ flex: 0.8, overflow: "auto" }}>
          <SoldOutTable
            data={data}
            selected={selected}
            hotelMap={hotelMap}
            baseHotel={baseHotel}
          />
        </div>
      </div>
    </div>
  );
}