export const TABLE = {
  width: "100%",
  borderCollapse: "collapse" as const,
  tableLayout: "fixed" as const
};

export const ROW_HEIGHT = 44;
export const HEADER_HEIGHT = 36;
export const DAY_WIDTH = 40;
export const COL_WIDTH = 120;

// ----- header -----
export const TH_DAY = {
  width: `${DAY_WIDTH}px`,
  height: `${HEADER_HEIGHT}px`,
  padding: "0 6px",
  textAlign: "left" as const,
  borderBottom: "1px solid #ddd"
};

export const TH = {
  width: `${COL_WIDTH}px`,
  height: `${HEADER_HEIGHT}px`,
  padding: "0",
  textAlign: "center" as const,
  borderBottom: "1px solid #ddd"
};

// ----- body -----
export const TD_DAY = {
  height: `${ROW_HEIGHT}px`,
  padding: "0 6px",
  textAlign: "left" as const,
  borderBottom: "1px solid #f0f0f0",
  fontWeight: 600,
  verticalAlign: "middle" as const
};

export const TD_CELL = {
  height: `${ROW_HEIGHT}px`,
  padding: "2px 0",
  textAlign: "center" as const,
  borderBottom: "1px solid #f0f0f0",
  verticalAlign: "middle" as const
};

// ----- base hotel 強調 -----
export const BASE_BORDER = {
  borderLeft: "2px solid #333",
  borderRight: "2px solid #333"
};

export const LEGEND = {
  fontSize: "10px",
  color: "#666",
  marginLeft: "4px"
};