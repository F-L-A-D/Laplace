"use client";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export default function Sidebar({ isOpen, onToggle, children }: Props) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: isOpen ? "200px" : "30px",
        zIndex: 20,
        transition: "0.2s",
        borderRight: "1px solid #ddd",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(6px)",
        boxShadow: isOpen ? "2px 0 8px rgba(0,0,0,0.1)" : "none",
        overflow: "hidden"
      }}
    >
      <div
        onClick={onToggle}
        style={{
          cursor: "pointer",
          padding: "8px",
          textAlign: "center",
          borderBottom: "1px solid #eee"
        }}
      >
        ☰
      </div>

      {isOpen && <div style={{ padding: "10px" }}>{children}</div>}
    </div>
  );
}