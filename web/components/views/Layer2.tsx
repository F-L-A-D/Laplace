"use client";

import { COL_WIDTH, DAY_WIDTH } from "@/styles/table";
import HeatMap from "@/components/rate/HeatMap";
import RateTable from "@/components/rate/RateTable";
import DayColumn from "@/components/rate/DayColumn";
import { sortHotels } from "@/utils/pinned";

type Props = {
  rateMatrix: any[];
  hotelMap: Record<number, string>;
  year: string;
  month: string;
  view: {
    baseHotel: number;
    displaySelected: (number | null)[];
    pinned: number[];
  };
};

export default function Layer2({
  rateMatrix,
  hotelMap,
  year,
  month,
  view,
}: Props) {
  const { baseHotel, displaySelected, pinned } = view;
  const sorted = sortHotels(
    displaySelected,
    baseHotel,
    pinned
  );
  const padded = [...sorted];
  while (padded.length < 5) {
    padded.push(null);
  }
  const days = rateMatrix.map(r => r.day);
  const MIN_COLS = 5;
  const baseWidth =
    DAY_WIDTH + COL_WIDTH * MIN_COLS * 2;

  return (
    <div
      style={{
        height: "100%",
        marginTop: "24px",
        overflowX: "auto",
        overflowY: "hidden",
        display: "flex"
      }}
    >
      <div
        style={{
          display: "flex",
          width: `${baseWidth}px`,
          minWidth: `${baseWidth}px`,
        }}
      >
        {/* Day */}
        <div style={{ width: `${DAY_WIDTH}px`, flexShrink: 0 }}>
          <DayColumn days={days} year={year} month={month} />
        </div>

        {/* HeatMap */}
        <div
          style={{
            width: `${COL_WIDTH * padded.length}px`,
            flexShrink: 0
          }}
        >
          <HeatMap
            matrix={rateMatrix}
            hotelMap={hotelMap}
            columns={padded}
            year={year}
            month={month}
            view={view}
          />
        </div>

        {/* RateTable */}
        <div
          style={{
            width: `${COL_WIDTH * padded.length}px`,
            flexShrink: 0
          }}
        >
          <RateTable
            matrix={rateMatrix}
            hotelMap={hotelMap}
            columns={padded}
            year={year}
            month={month}
            view={view}
          />
        </div>
      </div>
    </div>
  );
}