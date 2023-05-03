import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLogin, fetchSignup, fetchLogout } from './credentialsApi';

const initialState: CredentialsState = {
    username: '',
    sessionID: '',
    status: '',
    statusText: ''
};

// ---------- thunks

type LoginCredentials = {
    username: string,
    password: string
};
export const login = createAsyncThunk('credentials/login', async (credentials: LoginCredentials) => {
    const res = await fetchLogin(credentials.username, credentials.password);
    return res;
});

type SignupCredentials = LoginCredentials & {
    name: string,
    email: string,
};
export const signup = createAsyncThunk('credentials/signup', async (credentials: SignupCredentials) => {
    const res = await fetchSignup(credentials);
    return res;
});

export const logout = createAsyncThunk('credentials/logout', async (payload: any, thunkAPI) => {
    const state = thunkAPI.getState() as {
        credentials: CredentialsState;
    };

    const res = await fetchLogout(state.credentials.username, state.credentials.sessionID);
    return res;
});

// ---------- slice

const credentialsSlice = createSlice({
    name: 'credentials',
    initialState,
    reducers: {
        resetStatus(state, action) {
            state.status = '';
            state.statusText = '';
        }
    },
    extraReducers(builder) {
        builder
        .addCase(login.pending, (state, action) => setPending(state))
        .addCase(signup.pending, (state, action) => setPending(state))
        .addCase(login.fulfilled, (state, action) => {
            return {
                username: action.payload.username,
                sessionID: action.payload.sessionID,
                status: 'authorized',
                statusText: ''
            };
        })
        .addCase(signup.fulfilled, (state, action) => {
            state.status = 'created';
            state.statusText = action.payload;
        })
        .addCase(logout.fulfilled, (state, action) => {
            state.username = '',
            state.sessionID = '',
            state.status = 'destroyed';
            state.statusText = action.payload;
        })
        .addCase(login.rejected, (state, action) => setRejected(state, action.error.message))
        .addCase(signup.rejected, (state, action) => setRejected(state, action.error.message))
        // in case a logout fails, the application must delete the credentials regardless
        .addCase(logout.rejected, (state, action) => setRejected(state, action.error.message))
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
export const { resetStatus } = credentialsSlice.actions;

export type CredentialsState = Readonly<{
    username: string,
    sessionID: string,
    status: 'pending' | 'authorized' | 'rejected' | 'created' | 'destroyed' | '',
    statusText: string
}>;