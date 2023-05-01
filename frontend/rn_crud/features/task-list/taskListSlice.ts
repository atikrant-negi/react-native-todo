/**
 * Stores all the active tasks ( unfinished )
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState =  Array <TaskState>;

// ---------- slice

const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        set(state, { payload }) {
            return payload;
        },
        add(state, action) {
            state.push({
                ...action.payload,
                addDate: Date.now()
            });
        },
        remove(state, action) {
            return state.filter(x => x.id != action.payload);
        },
        update(state, action) {
            let index = state.findIndex(x => x.id == action.payload.id);
            if (index != -1) {
                state[index] = {
                    ...state[index],
                    title: action.payload.title || state[index].title,
                    desc: action.payload.desc || state[index].desc,
                    priority: action.payload.priority || state[index].priority
                }
            }
        }
    }
});

// exports

export const { set: setTasks, add: addTask, remove: removeTask, update: updateTask } = tasksSlice.actions;
export default tasksSlice.reducer;

export type TaskState = Readonly <{
    id: number,
    title: string,
    desc: string,
    priority: number,
    addDate: number
}>;