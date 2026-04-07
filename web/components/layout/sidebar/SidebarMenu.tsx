"use client";

import { useState } from "react";
import BaseHotelMenu from "@/components/layout/sidebar/BaseHotelMenu";
import SelectHotelMenu from "@/components/layout/sidebar/SelectHotelMenu";

export default function SidebarMenu({
    menu,
    setMenu,
    ...props
}: any) {

  const MENU_COMPONENT: any = {
    base: BaseHotelMenu,
    select: SelectHotelMenu
  };

  const Component = menu ? MENU_COMPONENT[menu] : null;

  return (
    <div style={{ width: "100%" }}>
      {/* メニュー */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div
          style={btn(menu === "base")}
          onClick={() => setMenu("base")}
        >
          自社ホテル選択
        </div>

        <div
          style={btn(menu === "select")}
          onClick={() => setMenu("select")}
        >
          表示ホテル選択
        </div>
      </div>

      {/* 中身 */}
      {Component && (
        <div style={{ marginTop: 10 }}>
          <Component {...props} />
        </div>
      )}
    </div>
  );
}

const btn = (active: boolean) => ({
  border: "1px solid #ccc",
  padding: "6px",
  cursor: "pointer",
  background: active ? "#eee" : "#fff",
  fontSize: "11px",
  textAlign: "center"
} as const);