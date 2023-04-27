import { takeEvery, select, put } from 'redux-saga/effects';
import { fetchGetTasks, fetchDeleteTasks, fetchAddTasks } from './taskListApi';
import { setTaskData } from './taskListSlice';

export default function* watchTasks() {
    yield takeEvery('LOAD_TASKS', loadTasks);
    yield takeEvery('SYNC_TASKS', syncTasks);
};

function* loadTasks(): Generator <any> {
    try {
        const cred: any = yield select(state => state.credentials);
        const res = yield fetchGetTasks(cred.username, cred.sessionID);
        
        yield put(setTaskData({
            syncStatus: 'fetched',
            tasks: res
        }));
    }
    catch (err) {
        yield put(setTaskData({
            syncStatus: 'rejected',
            syncStatusText: err
        }));
    }
};

function* syncTasks(): Generator <any> {
    try {
        const cred: any = yield select(state => state.credentials);
        const tasks: any = yield select(state => state.tasks.tasks);

        yield fetchDeleteTasks(cred.username, cred.sessionID);
        const res = yield fetchAddTasks(cred.username, cred.sessionID, tasks);
        yield put(setTaskData({
            syncStatus: 'synced',
            syncStatusText: res
        }));
    }
    catch (err) {
        yield put(setTaskData({
            syncStatus: 'rejected',
            syncStatusText: err
        }));
    }
};