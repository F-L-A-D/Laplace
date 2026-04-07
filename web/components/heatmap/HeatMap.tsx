"use client";

import HotelName from "@/components/common/HotelName";

const MAX = 5;

export default function HeatMap({ data, selected, hotelMap, baseHotel }: any) {
  const ordered = [...selected].sort((a, b) =>
    hotelMap[a].localeCompare(hotelMap[b])
  );

  while (ordered.length < MAX) ordered.push(-1);

  return (
    <table style={{ borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ width: 90 }}>Date</th>
          {ordered.map((id, i) => (
            <th key={`${id}_${i}`}>
              {id === -1 ? "-" : <HotelName id={id} hotelMap={hotelMap}/>}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row: any) => (
          <tr key={row.date}>
            <td style={{ width: 90 }}>{row.date}</td>

            {ordered.map(id => {
              if (id === -1) return <td key={Math.random()}>-</td>;

              const base = row[`hotel_${baseHotel}`];
              const val = row[`hotel_${id}`];

              const diff = base ? (val - base) / base : 0;

              const color =
                diff > 0
                  ? `rgba(255,0,0,${Math.min(diff * 2, 1)})`
                  : `rgba(0,0,255,${Math.min(-diff * 2, 1)})`;

              const isBase = id === baseHotel;

              return (
                <td
                  key={id}
                  style={{
                    backgroundColor: isBase ? "#fff8dc" : color,
                    border: isBase ? "2px solid #000" : "1px solid #ddd"
                  }}
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}