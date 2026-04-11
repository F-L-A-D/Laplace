export const TABLE = {
  width: "max-content" as const,
  borderCollapse: "collapse" as const,
  tableLayout: "fixed" as const
};

export const ROW_HEIGHT = 44;
export const HEADER_HEIGHT = 36;
export const DAY_WIDTH = 40;
export const COL_WIDTH = 150;

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

const BASE_CELL = {
  height: `${ROW_HEIGHT}px`,
  padding: "2px 0",
  borderBottom: "1px solid #f0f0f0",
  verticalAlign: "middle" as const
}

export const TD_DAY = {
  ...BASE_CELL,
  textAlign: "left" as const,
  fontWeight: 400,
  verticalAlign: "middle" as const
};

export const TD_CELL = {
  ...BASE_CELL,
  textAlign: "center" as const,
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