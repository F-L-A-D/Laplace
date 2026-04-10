export function alpha(hex: string, opacity: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const THEME = {
  primary: "#3b82f6"
}

export const COLORS = {

  text: {
    primary: "#111",
    secondary: "#444",
    muted: "#999",
    positive: "#dc2626",
    negative: "#2563eb"
  },
  border: {
    base: "#111",
    pinned: THEME.primary,
    default: "transparent"
  },
  bg:{
    base: "#fff8dc",
    pinned: alpha(THEME.primary, 0.08),
    subtle: "#f3f4f6",
    default: "#ffffff"
  }
};