export type DataLayer =
    | "raw"
    | "normalized"
    | "model"
    | "forecast";

export type State ={
      layer: DataLayer,
      source_id: number | null,
      baseHotel: number,
      selected: number[],
      pinned: number[],
      year: string,
      month: string
};

export type Action = 
    | { type: "INIT"; baseHotel: number }
    | { type: "SET_BASE"; id: number }
    | { type: "SELECT_ADD"; id: number }
    | { type: "SELECT_REMOVE"; id: number }
    | { type: "SELECT_SET"; ids: number[] }
    | { type: "PIN_ADD"; id: number }
    | { type: "PIN_REMOVE"; id: number }
    | { type: "PIN_CLEAR"; }
    | { type: "SET_YEAR"; year: string }
    | { type: "SET_MONTH"; month: string }
    | { type: "SET_SOURCE"; source_id: number }
    | { type: "SET_LAYER"; layer: DataLayer }