/**
 * Stores all the finished tasks
 */

import { createSlice } from "@reduxjs/toolkit";

const initialState: Array<FinishedState> = [];

function getNextID(state: Array<FinishedState>): number {
    let maxID = state.reduce((res: number, x: FinishedState) => Math.max(res, x.id), 0);
    return maxID + 1;
};

const finishedSlice = createSlice({
    name: 'finished',
    initialState,
    reducers: {
        add(state, action) {
            state.push({
                ...action.payload,
                id: getNextID(state),
                endDate: Date.now()
            });
        },
        remove(state, action) {
            return state.filter(x => x.id != action.payload);
        }
    }
});

export const { add: addFinished, remove: removeFinished } = finishedSlice.actions;
export default finishedSlice.reducer;

export type FinishedState = Readonly<{
    id: number,
    title: string,
    desc: string,
    addDate: number,
    endDate: number
}>;