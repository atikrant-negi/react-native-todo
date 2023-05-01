import {  configureStore } from '@reduxjs/toolkit';

import commonsReducer from '../features/commons/commonsSlice';
import credentialsReducer from '../features/credentials/credentialsSlice';
import tasksReducer from '../features/task-list/taskListSlice';
import finishedReducer from '../features/finished/finishedSlice';
import apiSlice from '../features/api/apiSlice';

const store = configureStore({
    reducer: {
        commons: commonsReducer,
        credentials: credentialsReducer,
        tasks: tasksReducer,
        finished: finishedReducer,
        [apiSlice.reducerPath]: apiSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;