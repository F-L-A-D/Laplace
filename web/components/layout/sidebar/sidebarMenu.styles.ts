export const wrap = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "6px"
};

export const btn = (active: boolean) => ({
  padding: "8px",
  fontSize: "12px",
  cursor: "pointer",
  border: "1px solid #eee",
  background: active ? "#f3f4f6" : "#fff",
  transition: "0.15s"
});