"use client";

type Props = {
  name: string;
};

export default function HotelName({ name }: Props) {
  return (
    <span
      style={{
        display: "inline-block",
        maxWidth: "120px",
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