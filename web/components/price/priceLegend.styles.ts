export const wrap = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: "12px"
};

export const item = {
  display: "flex",
  alignItems: "center",
  gap: "6px"
};

export const dot = {
  width: "6px",
  height: "6px",
  opacity: "0.76", 
  borderRadius: "50%"
};

export const dropdown = {
  position: "absolute" as const,
  top: "100%",
  left: 0,
  background: "#fff",
  border: "1px solid #ddd",
  padding: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  zIndex: 999,
  display: "flex",
  flexDirection: "column" as const,
  gap: "6px",
  whiteSpace: "nowrap" as const,
  minWidth: "max-content",
  maxHeight: "220px",
  overflowY: "auto" as const
};