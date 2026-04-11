"use client";

import { useMemo } from "react";
import HotelName from "@/components/common/HotelName";
import SectionHeader from "@/components/common/SectionHeader";

import { sortHotels } from "@/utils/pinned";
import { getRowBg } from "@/utils/ui";

import {
  buildSoldOutMap,
  buildSoldOutRows
} from "./soldout.logic";

type Props = {
  data: any[];
  hotelMap: Record<number, string>;
  view:{
    baseHotel: number;
    displaySelected: number[];
    pinned: number[];
  }
};

export default function SoldOutTable({
  data,
  hotelMap,
  view
}: Props) {

  const { baseHotel, displaySelected, pinned } = view;
  // ------------------------
  // 集計
  // ------------------------
  const map = useMemo(() => {
    return buildSoldOutMap(data, displaySelected);
  }, [data, displaySelected]);

  // ------------------------
  // 並び統一
  // ------------------------
  const sorted = useMemo(() => {
    return sortHotels(displaySelected, baseHotel, pinned);
  }, [displaySelected, baseHotel, pinned]);

  // ------------------------
  // 行生成
  // ------------------------
  const rows = useMemo(() => {
    return buildSoldOutRows(sorted, map);
  }, [sorted, map]);

  return (
    <>
      <SectionHeader title="SOLD OUT RATE" />

      <table style={table}>
        <thead>
          <tr>
            <th style={{ width: 140 }}>Hotel</th>
            <th style={{ width: 60 }}>Rate</th>
            <th style={{ width: 60 }}>Days</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => {
            const key = r.id != null ? `row-${r.id}` : `empty-${i}`;

            if (r.id == null) {
              return (
                <tr key={key}>
                  <td style={tdCenter}>-</td>
                  <td style={tdCenter}>-</td>
                  <td style={tdCenter}>-</td>
                </tr>
              );
            }

            return (
              <tr
                key={key}
                style={{
                  background: getRowBg(r.id, baseHotel, pinned)
                }}
              >
                <td>
                  <HotelName id={r.id} hotelMap={hotelMap} />
                </td>

                <td style={tdCenter}>
                  {r.rate != null
                    ? `${(r.rate * 100).toFixed(1)}%`
                    : "-"}
                </td>

                <td style={tdCenter}>
                  {r.days != null && r.total != null
                    ? `${r.days} / ${r.total}`
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

// styles
const table = {
  borderCollapse: "collapse" as const,
  width: "100%",
  tableLayout: "fixed" as const,
  marginTop: "12px"
};

const tdCenter = {
  textAlign: "center" as const
};