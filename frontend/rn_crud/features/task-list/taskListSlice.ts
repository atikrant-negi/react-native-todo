/**
 * Stores all the active tasks ( unfinished )
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState =  {
    tasks: [] as Array <TaskState>,
    syncStatus: '' as '' | 'pending' | 'synced' | 'fetched' | 'rejected',
    syncStatusText: ''
}

// ---------- slice

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        set(state, { payload }) {
            if (payload.syncStatus != undefined) state.syncStatus = payload.syncStatus;
            if (payload.syncStatusText != undefined) state.syncStatusText = payload.syncStatusText;
            if (payload.tasks != undefined) state.tasks = payload.tasks;
        },
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
    }
});

// exports

export const { set: setTaskData, add: addTask, remove: removeTask, update: updateTask, resetStatus: resetSyncStatus } = tasksSlice.actions;
export default tasksSlice.reducer;

export type TaskState = Readonly <{
    id: number,
    title: string,
    desc: string,
    priority: number,
    addDate: number
}>;