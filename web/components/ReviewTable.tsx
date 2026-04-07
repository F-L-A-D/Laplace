"use client";

// ------------------------
// 型定義
// ------------------------
type Review = {
  score: number;
  count: number;
};

type Props = {
  selected: number[];
  hotelMap: Record<number, string>;
  reviewMap: Record<number, Review>;
  baseHotel: number;
};

export default function ReviewTable({
  selected,
  hotelMap,
  reviewMap,
  baseHotel,
}: Props) {

  const baseId = Number(baseHotel);

  // ------------------------
  // 並び順（自社 → score降順）
  // ------------------------
  const ordered: number[] = [
    ...selected.filter((id) => Number(id) === baseId),
    ...selected
      .filter((id) => Number(id) !== baseId)
      .sort((a, b) => {
        const sa = reviewMap[a]?.score ?? 0;
        const sb = reviewMap[b]?.score ?? 0;
        return sb - sa;
      }),
  ];

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>Reviews</h3>

      <table style={table}>
        <thead>
          <tr>
            <th style={{ ...th, width: "60%" }}>Hotel</th>
            <th style={{ ...th, width: "20%" }}>Score</th>
            <th style={{ ...th, width: "20%" }}>Count</th>
          </tr>
        </thead>

        <tbody>
          {ordered.map((id) => {
            const isBase = Number(id) === baseId;
            const r = reviewMap[id];

            return (
              <tr key={id} style={isBase ? baseRow : {}}>
                <td style={nameTd} title={hotelMap[id]}>
                  {hotelMap[id]}
                </td>
                <td style={td}>{r?.score ?? "-"}</td>
                <td style={td}>{r?.count ?? "-"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ------------------------
// style
// ------------------------
const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  tableLayout: "fixed" as const,
};

const th = {
  borderBottom: "2px solid #ccc",
  textAlign: "left" as const,
  padding: "8px",
};

const td = {
  borderBottom: "1px solid #eee",
  padding: "8px",
};

const nameTd = {
  ...td,
  whiteSpace: "nowrap" as const,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const baseRow = {
  backgroundColor: "#eef3ff",
  fontWeight: "bold",
};