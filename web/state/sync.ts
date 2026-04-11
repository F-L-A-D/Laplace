import { State } from "./types";

export function sync(state: State): State {
    const selected = state.selected.filter(id => id !== state.baseHotel);

    const pinned = state.pinned
        .filter(id => id !== state.baseHotel)
        .filter(id => selected.includes(id));

    return {
        ...state,
        selected,
        pinned
    };
}