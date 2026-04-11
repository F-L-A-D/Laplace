"use client";

import SectionTitle from "@/components/common/SectionTitle";
import { HEADER_HEIGHT } from "@/styles/table";

type Props = {
  title: string;
  legend?: React.ReactNode;
};

export default function SectionHeader({ title, legend }: Props) {
  return (
    <div
      style={{
        height: `${HEADER_HEIGHT}px`,
        display: "flex",
        alignItems: "flex-end",
        gap: 8,
        borderBottom: "1px solid #ddd"
      }}
    >
      {/* 左：タイトル */}
      <SectionTitle title={title} />

      {/* 右：legend（あれば） */}
      {legend && (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center"
          }}
        >
          {legend}
        </div>
      )}
    </div>
  );
}