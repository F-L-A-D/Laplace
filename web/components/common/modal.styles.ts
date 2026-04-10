export const scrollArea = {
  maxHeight: "320px",
  overflowY: "auto" as const,
} as const;

export const overlay = {
  position: "fixed" as const,
  inset: 0,
  background: "rgba(0,0,0,0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 100
};

export const content = {
  position: "absolute",
  top: "80px",
  left: "60px",
  background: "#fff",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "320px",
  maxWidth: "360px", 
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
} as const;

export const close = {
  position: "absolute" as const,
  top: 10,
  right: 14,
  cursor: "pointer"
};