"use client";

import { COLORS } from "@/styles/theme";

type Item = {
  id: number;
  label: string;
};

type Props = {
  items: Item[];
  selected: number[];
  onToggle: (id: number) => void;
  single?: boolean;
};

export default function SelectList({
  items,
  selected,
  onToggle,
  single
}: Props) {
  return (
    <div style={wrap}>
      {items.map((item) => {
        const isActive = selected.includes(item.id);

        return (
          <div
            key={item.id}
            onClick={() => onToggle(item.id)}
            style={{
              ...row,
              background: isActive
                ? COLORS.bg.pinned
                : COLORS.bg.default
            }}
          >
            {/* チェック */}
            <div style={{
              ...checkbox,
              background: isActive ? COLORS.border.pinned : "transparent"
            }} />

            {/* 名前 */}
            <span style={label}>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const wrap = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "4px"
};

const row = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "6px 8px",
  cursor: "pointer",
  borderRadius: "4px"
};

const checkbox = {
  width: "10px",
  height: "10px",
  border: "1px solid #ccc",
  borderRadius: "2px"
};

const label = {
  fontSize: "12px",
  color: "#333"
};