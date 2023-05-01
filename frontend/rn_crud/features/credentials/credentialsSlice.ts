import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState: CredentialsState = {
    username: '',
    sessionID: ''
};

// ---------- slice

const credentialsSlice = createSlice({
    name: 'credentials',
    initialState,
    reducers: {
        set(state, { payload }) {
            state.username = payload.username;
            state.sessionID = payload.sessionID;
        }
    }
});

// --------- exports

export default credentialsSlice.reducer;
export const { set: setCredentials } = credentialsSlice.actions;

export type CredentialsState = Readonly<{
    username: string,
    sessionID: string
}>;