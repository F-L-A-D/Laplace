export const wrap = {
  position: "relative" as const
};

export const control = {
  display: "flex",
  alignItems: "center",
  background: "#f3f4f6",
  borderRadius: "8px",
  overflow: "hidden"
};

export const arrow = {
  padding: "6px 10px",
  cursor: "pointer",
  border: "none",
  background: "transparent",
  color: "#666"
};

export const center = {
  padding: "6px 14px",
  cursor: "pointer",
  fontWeight: 500,
  color: "#111"
};

export const dropdown = {
  position: "absolute" as const,
  top: "110%",
  left: 0,
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: "8px",
  padding: "10px",
  display: "flex",
  gap: "16px",
  boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  zIndex: 20
};

export const item = (active: boolean) => ({
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
  background: active ? "#f3f4f6" : "transparent",
  color: active ? "#111" : "#444"
});