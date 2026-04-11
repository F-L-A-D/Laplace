import { State, Action } from "./types";
import { sync } from "./sync";

export function reducer(state: State, action: Action): State {
    let next: State = state;
    switch (action.type) {
        case "INIT": {
            next = {
                ...state,
                baseHotel: action.baseHotel,
                selected: [],
                pinned: []
            };
            break;
        }
        case "SET_BASE": {
            next = {
                ...state,
                baseHotel: action.id,
                selected: state.selected.filter(id => id !== action.id),
                pinned: state.pinned.filter(id => id !== action.id)
            };
            break;
        }
        case "SELECT_ADD" : {
            next = {
                ...state,
                baseHotel: state.baseHotel,
                selected: state.selected.includes(action.id)
                    ? state.selected
                    : [...state.selected, action.id]
            };
            break;
        }
        case "SELECT_REMOVE": {
            next = {
                ...state,
                selected: state.selected.filter(id => id !== action.id),
                pinned: state.pinned.filter(id => id !== action.id)
            };
            break;
        }
        case "SELECT_SET": {
            const ids = Array.from(new Set(action.ids)).filter(
                id => id !== state.baseHotel
            );
            const isSame =
                ids.length === state.selected.length &&
                ids.every((v, i) => v === state.selected[i]);

            if (isSame) return state;

            next = {
                ...state,
                selected: ids,
                pinned: state.pinned.filter(id => ids.includes(id))
            };
            break;
        }
        case "PIN_ADD": {
            if(!state.selected.includes(action.id)) return state;
            next = {
                ...state,
                pinned: state.pinned.includes(action.id)
                    ? state.pinned
                    : [...state.pinned, action.id]
            }
            break;
        }
        case "PIN_REMOVE": {
            next = {
                ...state,
                pinned: state.pinned.filter(id => id !== action.id)
            };
            break;
        }
        case "PIN_CLEAR": {
            next = {
                ...state,
                pinned: []
            };
            break;
        }
        case "SET_YEAR": {
            next = {
                ...state,
                year: action.year
            };
            break;
        }
        case "SET_MONTH": {
            next = {
                ...state,
                month: action.month
            };
            break;
        }
        case "SET_SOURCE": {
            next = {
                ...state,
                source_id: state.layer == "raw" 
                    ? action.source_id ?? 1
                    : null
            };
            break;
        }
        case "SET_LAYER": {
            next = {
                ...state,
                layer: action.layer,
                source_id: action.layer == "raw" 
                    ? state.source_id ?? 1
                    : null
            };
            break;
        }
        default:
            return state;
    }
    return sync(next);
}