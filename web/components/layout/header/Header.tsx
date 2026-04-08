"use client";

import YearMonthSelector from "@/components/layout/header/YearMonthSelector";
import CurrentHotel from "@/components/layout/header/CurrentHotel";

type MenuType = "base" | "select" | null;

type Props = {
  year: string;
  month: string;
  setYear: (v: string) => void;
  setMonth: (v: string) => void;
  baseHotel: number | null;
  hotelMap: Record<number, string>;
  isOpen: boolean;
  menu: MenuType;
  setIsOpen: (v: boolean) => void;
  setMenu: (v: MenuType) => void;
};

export default function Header({
  year,
  month,
  setYear,
  setMonth,
  baseHotel,
  hotelMap,
  isOpen,
  menu,
  setIsOpen,
  setMenu
}: Props) {

  const toggleMenu = (target: Exclude<MenuType, null>) => {
    if (isOpen && menu === target) {
      setMenu(null);
      setIsOpen(false);
    } else {
      setMenu(target);
      setIsOpen(true);
    }
  };

  return (
    <div
      style={{
        height: "56px",
        display: "flex",
        alignItems: "center",
        padding: "0 16px",
        borderBottom: "1px solid #eee",
        background: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}
    >
      {/* 左ブロック */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ fontWeight: 600, color: "#111" }}>
          Laplace
        </div>

        <div style={{ margin: "0 12px", color: "#ccc" }}>|</div>

        <CurrentHotel
          baseHotel={baseHotel}
          hotelMap={hotelMap}
          onClick={() => toggleMenu("base")}
        />
      </div>

      {/* 右ブロック */}
      <div style={{ marginLeft: "auto" }}>
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