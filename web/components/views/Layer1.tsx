// web/componetns/layers/Layer1.tsx

"use client";

import PriceChart from "@/components/price/PriceChart";
import ReviewTable from "@/components/review/ReviewTable";
import SoldOutTable from "@/components/soldout/SoldOutTable";

type Props = {
  data: any[];
  baseHotel: number;
  hotelMap: Record<number, string>;
  selected: number[];
  displaySelected: number[];
  setSelected: React.Dispatch<React.SetStateAction<number[]>>;
  pinnedIds: number[];
  setPinnedIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export default function Layer1({
  data,
  baseHotel,
  hotelMap,
  selected,
  displaySelected,
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
          baseHotel={baseHotel}
          hotelMap={hotelMap}
          selected={selected}
          displaySelected={displaySelected}
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
            data={data}
            displaySelected={displaySelected}
            hotelMap={hotelMap}
            baseHotel={baseHotel}
            pinnedIds={pinnedIds}
          />
        </div>

        <div style={{ flex: 0.8, overflow: "auto" }}>
          <SoldOutTable
            data={data}
            displaySelected={displaySelected}
            hotelMap={hotelMap}
            baseHotel={baseHotel}
            pinnedIds={pinnedIds}
          />
        </div>
      </div>
    </div>
  );
}