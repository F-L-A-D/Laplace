export const wrap = (isOpen: boolean) => ({
  position: "absolute" as const,
  left: 0,
  top: 0,
  bottom: 0,
  width: isOpen ? "200px" : "30px",
  transition: "0.2s",
  borderRight: "1px solid #eee",
  background: "#fff",
  zIndex: 20
});

export const toggle = {
  padding: "8px",
  cursor: "pointer",
  textAlign: "center" as const,
  borderBottom: "1px solid #eee"
};

export const content = {
  padding: "10px"
};