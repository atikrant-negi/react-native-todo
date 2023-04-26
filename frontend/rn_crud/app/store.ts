import {  configureStore } from '@reduxjs/toolkit';

import commonsReducer from '../features/commons/commonsSlice';
import credentialsReducer from '../features/login/credentialsSlice';
import tasksReducer from '../features/todos/taskListSlice';
import finishedReducer from '../features/finished/finishedSlice';

const store = configureStore({
    reducer: {
        commons: commonsReducer,
        credentials: credentialsReducer,
        tasks: tasksReducer,
        finished: finishedReducer,
    }
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;