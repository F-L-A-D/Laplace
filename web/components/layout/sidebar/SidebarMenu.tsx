"use client";

import { MENU, MenuType } from "@/constants/menu";
import * as s from "@/components/layout/sidebar/sidebarMenu.styles";

type Props = {
  activeMenu: MenuType | null;
  setActiveMenu: (v: MenuType | null) => void;
};

export default function SidebarMenu({
  activeMenu,
  setActiveMenu
}: Props) {
  return (
    <div style={s.wrap}>
      {Object.values(MENU).map((m) => (
        <div
          key={m.key}
          onClick={() => {
            if (activeMenu == m.key) {
              setActiveMenu(null);
            } else {
              setActiveMenu(m.key)
            }
          }}
          style={s.btn(activeMenu === m.key)}
        >
          {m.label}
        </div>
      ))}
    </div>
  );
}