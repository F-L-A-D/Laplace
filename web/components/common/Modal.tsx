"use client";

import * as s from "@/components/common/modal.styles"
import { use, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};


export default function Modal({ open, onClose, children }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.content} onClick={(e) => e.stopPropagation()}>
        <div 
          style={{
            ...s.close,
            cursor: "pointer",
            padding: "4px 8px"
          }}
          onClick={onClose}
        >
          ×
        </div>
        {children}
      </div>
    </div>
  );
}