import { createSlice } from "@reduxjs/toolkit";

const initialState: CommonsState = {
    menuIndex: 0, // 0: login / signup, 1: active task, 2: finished task
};

const commonsSlice = createSlice({
    name: 'commons',
    initialState,
    reducers: {
        menu(state, action) {
            state.menuIndex = action.payload
        }
    }
});

export default commonsSlice.reducer;
export const { menu: setMenu } = commonsSlice.actions;

export type CommonsState = {
    menuIndex: 0 | 1 | 2
};