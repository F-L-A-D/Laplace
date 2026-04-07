"use client";

type Props = {
  id: number;
  hotelMap: Record<number, string>;
  width?: number;
};

export default function HotelName({ id, hotelMap, width }: Props) {
  const name = hotelMap[id] ?? "";

  return (
    <span
      style={{
        display: "inline-block",
        width: width? `${width}px`: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        verticalAlign: "bottom",
      }}
      title={name}
    >
      {name}
    </span>
  );
}