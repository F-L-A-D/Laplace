"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

import * as s from "@/components/common/modal.styles"


export default function Modal({ open, onClose, children }: Props) {
  if (!open) return null;

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.content} onClick={(e) => e.stopPropagation()}>
        <div style={s.close} onClick={onClose}>×</div>
        {children}
      </div>
    </div>
  );
}