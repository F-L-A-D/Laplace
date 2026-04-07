"use client";

type Props = {
  baseHotel: number | null;
  hotelMap: Record<number, string>;
  onClick?: () => void;
};

export default function CurrentHotel({ baseHotel, hotelMap, onClick }: Props) {
  if (!baseHotel) return null;

  return (
    <div
      onClick={onClick}
      style={{
        fontSize: "20px",
        display: "flex",
        alignItems: "center",
        cursor: "pointer"
      }}
    >
      {hotelMap[baseHotel]}
    </div>
  );
}