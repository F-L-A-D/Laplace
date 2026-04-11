// web/componetns/layers/Layer1.tsx

"use client";

import PriceChart from "@/components/price/PriceChart";
import ReviewTable from "@/components/review/ReviewTable";
import SoldOutTable from "@/components/soldout/SoldOutTable";

type Props = {
  data: any[];
  reviewData: Record<number, any>;
  hotelMap: Record<number, string>;
  view: {
    baseHotel: number;
    displaySelected: number[];
    pinned: number[];
  };
  actions: {
    pin: (id: number) => void;
    unpin: (id: number) => void;
  }
};


export default function Layer1({
  data,
  reviewData,
  hotelMap,
  view,
  actions
}: Props) {
  const { baseHotel, displaySelected, pinned } = view;
  const { pin, unpin } = actions;
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
          hotelMap={hotelMap}
          view={view}
          actions={actions}
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
            reviewData={reviewData}
            hotelMap={hotelMap}
            view={view}
          />
        </div>

        <div style={{ flex: 0.8, overflow: "auto" }}>
          <SoldOutTable
            data={data}
            hotelMap={hotelMap}
            view={view}
          />
        </div>
      </div>
    </div>
  );
}