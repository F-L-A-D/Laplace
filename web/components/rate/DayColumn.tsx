"use client";

import { TH_DAY, TD_DAY, TABLE, HEADER_HEIGHT } from "@/styles/table";

type Props = {
  days: string[];
  year: string;
  month: string;
};

export default function DayColumn({ days, year, month }: Props) {
  return (
    <div style= {{ height: "100%" }}>
      <div>
        <div style={{ height: `${HEADER_HEIGHT}px` }} />

        <table style={TABLE}>
          <thead>
            <tr>
              <th style={TH_DAY}>Day</th>
            </tr>
          </thead>

          <tbody>
            {days.map((day, i) => {
              const isWeekend = isSatOrSun(year, month, day);

              return (
                <tr
                  key={i}
                  style={{
                    background: isWeekend ? "#fafafa" : "transparent"
                  }}
                >
                  <td style={TD_DAY}>{day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function isSatOrSun(year: string, month: string, day: string) {
  const d = new Date(`${year}-${month}-${day}`);
  const w = d.getDay();
  return w === 0 || w === 6;
}