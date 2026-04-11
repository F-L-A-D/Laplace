import { State } from "./types";

export function sync(state: State): State {
    const selected = state.selected.filter(id => id !== state.baseHotel);

    const pinned = state.pinned
        .filter(id => id !== state.baseHotel)
        .filter(id => selected.includes(id));

    const sameSelected =
        selected.length === state.selected.length &&
        selected.every((v, i) => v === state.selected[i]);

    const samePinned =
        pinned.length === state.pinned.length &&
        pinned.every((v, i) => v === state.pinned[i]);

    if (sameSelected && samePinned) {
        return state;
    }

    return {
        ...state,
        selected,
        pinned
    };
}