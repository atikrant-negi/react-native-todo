import { createSlice } from '@reduxjs/toolkit';

const initialState: CredentialsState = {
    username: '',
    sessionID: '',
    status: '',
    statusText: ''
};

// ---------- slice

const credentialsSlice = createSlice({
    name: 'credentials',
    initialState,
    reducers: {
        resetStatus(state, action) {
            state.status = '';
            state.statusText = '';
        },
        setCredentials(state, { payload }) {
            if (payload.username != undefined) state.username = payload.username;
            if (payload.sessionID != undefined) state.sessionID = payload.sessionID;
            if (payload.status != undefined) state.status = payload.status;
            if (payload.statusText != undefined) state.statusText = payload.statusText;
        }
    }
});

// ---------- helper functions

function setPending(state: CredentialsState): CredentialsState {
    return {
        username: state.username,
        sessionID: state.sessionID,
        status: 'pending',
        statusText: ''
    };
}

function setRejected(state: CredentialsState, message: string | undefined): CredentialsState {
    return {
        username: state.username,
        sessionID: state.sessionID,
        status: 'rejected',
        statusText: message || ''
    };
}

// --------- exports

export default credentialsSlice.reducer;
export const { resetStatus, setCredentials } = credentialsSlice.actions;

export type CredentialsState = Readonly<{
    username: string,
    sessionID: string,
    status: 'pending' | 'authorized' | 'rejected' | 'created' | 'destroyed' | '',
    statusText: string
}>;