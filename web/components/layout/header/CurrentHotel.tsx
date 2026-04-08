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
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.7";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}        
      style={{
        fontSize: "14px",
        fontWeight: 500,
        color: "#333",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        cursor: "pointer",
        transition: "opacity 0.15s ease"
      }}
    >
      <span style={{ color: "#999", marginRight: "6px" }}>
        HOTEL
      </span>
      
      <span>
        {hotelMap[baseHotel]}
      </span>
    </div>
  );
}