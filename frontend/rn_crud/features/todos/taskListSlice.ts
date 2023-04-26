/**
 * Stores all the active tasks ( unfinished )
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import base64 from 'base-64';

const initialState =  {
    tasks: [] as Array <TaskState>,
    syncStatus: '' as '' | 'pending' | 'synced' | 'fetched' | 'rejected',
    syncStatusText: ''
}

// ---------- thunks

type Credentials = {
    username: string,
    sessionID: string
};
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (payload, thunkAPI) => {
    const state = thunkAPI.getState() as {
        credentials: Credentials
    };
    const cred = state.credentials;
    const res = await fetch('http://192.180.0.211:8000/user/tasks', {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${base64.encode(cred.username + ':' + cred.sessionID)}`
        }
    }).then(res => {
        if (res.status >= 200 && res.status < 300)
            return res.json();
        else return res.text();
    });

    return res;
});

export const syncTasks = createAsyncThunk('tasks/syncTasks', async (payload, thunkAPI) => {
    const state = thunkAPI.getState() as {
        credentials: Credentials,
        tasks: typeof initialState
    };
    const cred = state.credentials;

    await fetch('http://192.180.0.211:8000/user/removeAllTasks', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${base64.encode(cred.username + ':' + cred.sessionID)}`
        }
    }).then(res => {
        return Promise.all([res.text(), Promise.resolve(res.status)]);
    }).then(([text, status]) => {
        if (!(status >= 200 && status < 300)) throw text;
        else return text;
    });

    const res = await fetch('http://192.180.0.211:8000/user/addTasks', {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${base64.encode(cred.username + ':' + cred.sessionID)}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.tasks.tasks)
    }).then(res => {
        return Promise.all([res.text(), Promise.resolve(res.status)]);
    }).then(([text, status]) => {
        if (!(status >= 200 && status < 300)) throw text;
        else return text;
    });

    return res;
});

// ---------- slice

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        add(state, action) {
            state.tasks.push({
                ...action.payload,
                addDate: Date.now()
            });
        },
        remove(state, action) {
            state.tasks = state.tasks.filter(x => x.id != action.payload);
        },
        update(state, action) {
            let index = state.tasks.findIndex(x => x.id == action.payload.id);
            if (index != -1) {
                state.tasks[index] = {
                    ...state.tasks[index],
                    title: action.payload.title || state.tasks[index].title,
                    desc: action.payload.desc || state.tasks[index].desc,
                    priority: action.payload.priority || state.tasks[index].priority
                }
            }
        },
        resetStatus(state, action) {
            state.syncStatus = '';
            state.syncStatusText = '';
        }
    },
    extraReducers(builder) {
        builder
        .addCase(fetchTasks.pending, (state, action) => {
            state.syncStatus = 'pending';
            state.syncStatusText = ''
        })
        .addCase(syncTasks.pending, (state, payload) => {
            state.syncStatus = 'pending';
            state.syncStatusText = ''
        })
        
        .addCase(fetchTasks.fulfilled, (state, action) => {
            state.syncStatus = 'fetched';
            state.tasks = action.payload;
        })
        .addCase(syncTasks.fulfilled, (state, action) => {
            state.syncStatus = 'synced';
            state.syncStatusText = action.payload;
        })

        .addCase(fetchTasks.rejected, (state, action) => {
            state.syncStatus = 'rejected';
            state.syncStatusText = action.error.message || '';
        })
        .addCase(syncTasks.rejected, (state, action) => {
            state.syncStatus = 'rejected';
            state.syncStatusText = action.error.message || '';
        })
    }
});

export const { add: addTask, remove: removeTask, update: updateTask, resetStatus: resetSyncStatus } = tasksSlice.actions;
export default tasksSlice.reducer;

export type TaskState = Readonly <{
    id: number,
    title: string,
    desc: string,
    priority: number,
    addDate: number
}>;