"use client";

import * as s from "@/components/layout/header/currentHotel.styles"

type Props = {
  baseHotel: number | null;
  hotelMap: Record<number, string>;
  onClick?: () => void;
};

export default function CurrentHotel({
  baseHotel,
  hotelMap,
  onClick
}: Props) {
  if (!baseHotel) return null;

  return (
    <div
      onClick={onClick}
      style={s.wrap}
    >
      <span style={s.label}>BASE</span>

      <span style={s.name}>
        {hotelMap[baseHotel]}
      </span>
    </div>
  );
}