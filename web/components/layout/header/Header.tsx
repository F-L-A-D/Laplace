"use client";

import YearMonthSelector from "./YearMonthSelector";
import CurrentHotel from "./CurrentHotel";

type Props = {
  year: string;
  month: string;
  setYear: (v: string) => void;
  setMonth: (v: string) => void;
  baseHotel: number | null;
  hotelMap: Record<number, string>;
  setIsOpen: (v: boolean) => void;
  setMenu: (v: "base" | "select" | null) => void;
};

export default function Header({
  year,
  month,
  setYear,
  setMonth,
  baseHotel,
  hotelMap,
  setIsOpen,
  setMenu
}: Props) {
  return (
    <div
      style={{
        height: "56px",
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        borderBottom: "1px solid #ddd",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}
    >
      {/* 左：タイトル */}
      <div style={{ fontSize: "16px", fontWeight: "600", letterSpacing: "0.5px", color: "#222" }}>
        Laplace 
      </div>

      {/* 中央：自社ホテル */}
      <div style={{ marginLeft: "24px", display: "flex", alignItems: "center", height: "100%" }}>
        <div>
          <CurrentHotel 
            baseHotel={baseHotel} 
            hotelMap={hotelMap}
            onClick={() => {
              setIsOpen(true);
              setMenu("base");
            }} 
          />
        </div>        

      </div>

      {/* 右：年月 */}
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", height: "100%"  }}>
        <YearMonthSelector
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
        />
      </div>
    </div>
  );
}