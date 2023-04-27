/**
 * Stores all the active tasks ( unfinished )
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGetTasks, fetchDeleteTasks, fetchAddTasks } from './taskListApi';

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
export const loadTasks = createAsyncThunk('tasks/loadTasks', async (payload, thunkAPI) => {
    const state = thunkAPI.getState() as {
        credentials: Credentials
    };
    const cred = state.credentials;
    const res = await fetchGetTasks(cred.username, cred.sessionID);
    
    return res;
});

export const syncTasks = createAsyncThunk('tasks/syncTasks', async (payload, thunkAPI) => {
    const state = thunkAPI.getState() as {
        credentials: Credentials,
        tasks: typeof initialState
    };

    await fetchDeleteTasks(state.credentials.username, state.credentials.sessionID);
    const res = await fetchAddTasks(
        state.credentials.username, 
        state.credentials.sessionID, 
        state.tasks.tasks
    );

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
        .addCase(loadTasks.pending, (state, action) => {
            state.syncStatus = 'pending';
            state.syncStatusText = ''
        })
        .addCase(syncTasks.pending, (state, payload) => {
            state.syncStatus = 'pending';
            state.syncStatusText = ''
        })
        
        .addCase(loadTasks.fulfilled, (state, action) => {
            state.syncStatus = 'fetched';
            state.tasks = action.payload;
        })
        .addCase(syncTasks.fulfilled, (state, action) => {
            state.syncStatus = 'synced';
            state.syncStatusText = action.payload;
        })

        .addCase(loadTasks.rejected, (state, action) => {
            state.syncStatus = 'rejected';
            state.syncStatusText = action.error.message || '';
        })
        .addCase(syncTasks.rejected, (state, action) => {
            state.syncStatus = 'rejected';
            state.syncStatusText = action.error.message || '';
        })
    }
});

// exports

export const { add: addTask, remove: removeTask, update: updateTask, resetStatus: resetSyncStatus } = tasksSlice.actions;
export default tasksSlice.reducer;

export type TaskState = Readonly <{
    id: number,
    title: string,
    desc: string,
    priority: number,
    addDate: number
}>;