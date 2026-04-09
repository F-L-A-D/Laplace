"use client";

import HeatMap from "@/components/rate/HeatMap";
import RateTable from "@/components/rate/RateTable";

type Props = {
  rateMatrix: any[];
  selected: number[];
  baseHotel: number;
  hotelMap: Record<number, string>;
  year: string;
  month: string;
  pinnedIds: number[];
};

export default function Layer2({
  rateMatrix,
  selected,
  baseHotel,
  hotelMap,
  year,
  month,
  pinnedIds
}: Props) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        gap: "24px",
        minHeight: 0,
        marginTop: "24px"
      }}
    >
      {/* 左：ヒートマップ */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0
        }}
      >
        <HeatMap
          matrix={rateMatrix}
          hotelMap={hotelMap}
          selected={selected}
          baseHotel={baseHotel}
          year={year}
          month={month}
          pinnedIds={pinnedIds}
        />
      </div>

      {/* 右：テーブル */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          minHeight: 0
        }}
      >
        <RateTable
          matrix={rateMatrix}
          hotelMap={hotelMap}
          selected={selected}
          baseHotel={baseHotel}
          year={year}
          month={month}
        />
      </div>
    </div>
  );
}