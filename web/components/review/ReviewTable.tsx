"use client";

import { useMemo } from "react";
import HotelName from "@/components/common/HotelName";
import SectionTitle from "@/components/common/SectionTitle";
import { sortHotels } from "@/utils/pinned";

import { useReviews } from "@/hooks/useReviews";
import { buildReviewRows } from "@/components/review/review.logic";
import { getRowBg } from "@/utils/ui";

type Props = {
  displaySelected: number[];
  hotelMap: Record<number, string>;
  baseHotel: number;
  pinnedIds: number[];
};

export default function ReviewTable({
  displaySelected,
  hotelMap,
  baseHotel,
  pinnedIds
}: Props) {

  const reviewData = useReviews(displaySelected);

  const sorted = useMemo(() => {
    return sortHotels(displaySelected, baseHotel, pinnedIds);
  }, [displaySelected, baseHotel, pinnedIds]);

  const rows = useMemo(() => {
    return buildReviewRows(sorted, reviewData);
  }, [sorted, reviewData]);

  console.log("sorted", sorted);
  console.log("rows", rows);

  return (
    <>
      <SectionTitle title="RAKUTEN REVIEWS" />

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
                  background: getRowBg(r.id, baseHotel, pinnedIds)
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
  tableLayout: "fixed" as const
};

const tdCenter = {
  textAlign: "center" as const
};