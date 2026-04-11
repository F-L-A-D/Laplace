export type DataLayer =
    | "raw_rakuten"
    | "raw_jalan"
    | "normalized"
    | "model_global"
    | "model_private";

export type State = {
    baseHotel: number;
    selected: number[];
    pinned: number[];
    year: string;
    month: string;
    layer: DataLayer;
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
    | { type: "SET_LAYER"; layer:DataLayer }


 