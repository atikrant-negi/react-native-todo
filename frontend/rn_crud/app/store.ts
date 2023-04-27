import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import commonsReducer from '../features/commons/commonsSlice';
import credentialsReducer from '../features/credentials/credentialsSlice';
import tasksReducer from '../features/task-list/taskListSlice';
import finishedReducer from '../features/finished/finishedSlice';

import sagas from './sagas';

const sagaMiddlewares = createSagaMiddleware();
const store = configureStore({
    reducer: {
        commons: commonsReducer,
        credentials: credentialsReducer,
        tasks: tasksReducer,
        finished: finishedReducer,
    },
    middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(sagaMiddlewares)
});
sagaMiddlewares.run(sagas);

export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;