"use client";

import YMSelector from "@/components/layout/header/YMSelector";
import CurrentHotel from "@/components/layout/header/CurrentHotel";
import { MenuType } from "@/constants/menu";

import * as s from "@/components/layout/header/header.styles";

type Props = {
  year: string;
  month: string;
  setYear: (v: string) => void;
  setMonth: (v: string) => void;
  baseHotel: number | null;
  hotelMap: Record<number, string>;
  onOpenMenu: (menu: MenuType) => void;
};

export default function Header({
  year,
  month,
  setYear,
  setMonth,
  baseHotel,
  hotelMap,
  onOpenMenu
}: Props) {

  const handleOpenBase = () => {
    if (baseHotel !== null) {
      onOpenMenu("base");
    }
  };

  return (
    <div style={s.wrap}>
      {/* 左 */}
      <div style={s.left}>
        <div style={s.logo}>Laplace</div>

        <div style={s.divider}>|</div>

        <CurrentHotel
          baseHotel={baseHotel}
          hotelMap={hotelMap}
          onClick={handleOpenBase}
        />
      </div>

      {/* 右 */}
      <div style={{ marginLeft: "auto" }}>
        <YMSelector
          year={year}
          month={month}
          setYear={setYear}
          setMonth={setMonth}
        />
      </div>
    </div>
  );
}