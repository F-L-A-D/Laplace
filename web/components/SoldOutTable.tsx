"use client";

// ------------------------
// 型定義
// ------------------------
type SoldOutItem = {
  id: number;
  sold: number;
  rate: number;
};

type Props = {
  data: any[];
  selected: number[];
  hotelMap: Record<number, string>;
  baseHotel: number;
};

export default function SoldOutTable({
  data,
  selected,
  hotelMap,
  baseHotel,
}: Props) {

  const baseId = Number(baseHotel);
  const totalDays = data.length;

  // ------------------------
  // 集計
  // ------------------------
  const list: SoldOutItem[] = selected.map((id) => {
    let sold = 0;

    data.forEach((row) => {
      if (row[`hotel_${id}`] === null) sold++;
    });

    return {
      id: Number(id),
      sold,
      rate: totalDays ? sold / totalDays : 0,
    };
  });

  // ------------------------
  // 並び順（自社 → rate降順）
  // ------------------------
  const ordered: SoldOutItem[] = [
    ...list.filter((x) => x.id === baseId),
    ...list
      .filter((x) => x.id !== baseId)
      .sort((a, b) => b.rate - a.rate),
  ];

  return (
    <div>
      <h3>Sold Out</h3>

      <table style={table}>
        <thead>
          <tr>
            <th style={{ ...th, width: "60%" }}>Hotel</th>
            <th style={{ ...th, width: "20%" }}>Rate</th>
            <th style={{ ...th, width: "20%" }}>Days</th>
          </tr>
        </thead>

        <tbody>
          {ordered.map((r) => {
            const isBase = r.id === baseId;

            return (
              <tr key={r.id} style={isBase ? baseRow : {}}>
                <td style={nameTd} title={hotelMap[r.id]}>
                  {hotelMap[r.id]}
                </td>
                <td style={td}>{(r.rate * 100).toFixed(1)}%</td>
                <td style={td}>{r.sold}/{totalDays}</td>
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