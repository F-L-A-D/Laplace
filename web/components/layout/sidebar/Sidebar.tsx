"use client";

import * as s from "@/components/layout/sidebar/sidebar.styles";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export default function Sidebar({ isOpen, onToggle, children }: Props) {
  return (
    <div style={s.wrap(isOpen)}>
      <div onClick={onToggle} style={s.toggle}>
        ☰
      </div>

      {isOpen && <div style={s.content}>{children}</div>}
    </div>
  );
}