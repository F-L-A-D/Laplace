"use client";

import HotelName from "@/components/common/HotelName";

type Props = {
  id: number;
  hotelMap: Record<number, string>;
  checked?: boolean;
  isBase?: boolean;
  isPinned?: boolean;
  onClick?: () => void;
};

export default function HotelRow({
  id,
  hotelMap,
  checked,
  isBase,
  isPinned,
  onClick
}: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "6px 8px",
        cursor: isBase ? "default" : "pointer",
        opacity: isBase ? 0.5 : 1,
        background: checked ? "#eef2ff" : "transparent"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          minWidth: 0
        }}
      >
        {checked !== undefined && (
          <input type="checkbox" checked={checked} readOnly />
        )}

        {/* テキスト制御 */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          <HotelName id={id} hotelMap={hotelMap} />
        </div>

        {isBase && <span style={tag}>BASE</span>}
        {isPinned && <span style={pin}>PIN</span>}
      </div>
    </div>
  );
}

const tag = {
  fontSize: "10px",
  color: "#999"
};

const pin = {
  fontSize: "10px",
  color: "#3b82f6"
};