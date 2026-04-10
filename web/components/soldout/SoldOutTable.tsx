"use client";

import { useMemo } from "react";
import HotelName from "@/components/common/HotelName";
import SectionTitle from "@/components/common/SectionTitle";

import { sortHotels } from "@/utils/pinned";
import {
  buildSoldOutMap,
  buildSoldOutRows
} from "./soldout.logic";

import { getRowBg } from "@/utils/ui";


type Props = {
  data: any[];
  displaySelected: number[];
  hotelMap: Record<number, string>;
  baseHotel: number;
  pinnedIds: number[];
};

export default function SoldOutTable({
  data,
  displaySelected,
  hotelMap,
  baseHotel,
  pinnedIds
}: Props) {

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
    return sortHotels(displaySelected, baseHotel, pinnedIds);
  }, [displaySelected, baseHotel, pinnedIds]);

  // ------------------------
  // 行生成
  // ------------------------
  const rows = useMemo(() => {
    return buildSoldOutRows(sorted, map);
  }, [sorted, map]);

  return (
    <>
      <SectionTitle title="SOLD OUT RATE" />

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
                  background: getRowBg(r.id, baseHotel, pinnedIds)
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