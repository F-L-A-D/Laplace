"use client";

import { useMemo } from "react";
import HotelName from "@/components/common/HotelName";
import SectionHeader from "@/components/common/SectionHeader";
import { sortHotels } from "@/utils/pinned";

import { buildReviewRows } from "@/components/review/review.logic";
import { getRowBg } from "@/utils/ui";


type Props = {
  reviewData: Record<number, any>;
  hotelMap: Record<number, string>;
  view: {
    baseHotel: number;
    displaySelected: (number | null)[];
    pinned: number[];
  }
};

export default function ReviewTable({
  reviewData,
  hotelMap,
  view
}: Props) {
  const { baseHotel, displaySelected, pinned } = view;

  const sorted = useMemo(() => {
    return sortHotels(displaySelected, baseHotel, pinned);
  }, [displaySelected, baseHotel, pinned]);

  const rows = useMemo(() => {
    return buildReviewRows(sorted, reviewData);
  }, [sorted, reviewData]);

  return (
    <>
      <SectionHeader title="RAKUTEN REVIEWS" />

      <table style={table}>
        <thead>
          <tr>
            <th style={{ width: 140 }}>Hotel</th>
            <th style={{ width: 60 }}>Score</th>
            <th style={{ width: 60 }}>Count</th>
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
                  {r.score ?? "-"}
                </td>

                <td style={tdCenter}>
                  {r.count ?? "-"}
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