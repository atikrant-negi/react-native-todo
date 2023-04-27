import { takeEvery, call, put, select } from 'redux-saga/effects';
import { fetchLogin, fetchSignup, fetchLogout } from './credentialsApi';
import { setCredentials } from './credentialsSlice';

export default function* watchCredentials() {
    yield takeEvery('LOGIN', login);
    yield takeEvery('SIGNUP', signup);
    yield takeEvery('LOGOUT', logout);
};

function* login({ payload: { username, password }}: any): Generator <any> {
    try {
        // try a login and store the sessionID 
        const res = yield call(fetchLogin, username, password);
        yield put(setCredentials({
            ...res as {},
            status: 'authorized',
            statusText: 'login successful'
        }));
    }
    catch (err) {
        yield put(setCredentials({
            status: 'rejected',
            statusText: err
        }));
    }
};

// assumes, payload is in the correct format
function* signup({ payload } : any): Generator <any> {
    try {
        const res = yield fetchSignup(payload);
        yield put(setCredentials({
            status: 'created',
            statusText: res
        }));
    }
    catch (err) {
        yield put(setCredentials({
            status: 'rejected',
            statusText: err
        }));
    }
};

function* logout(): Generator <any> {
    try {
        // reset credentials, and mark status as destroyed
        const cred: any = yield select(state => state.credentials);
        const res = yield call(fetchLogout, cred.username, cred.sessionID);
        yield put(setCredentials({
            username: '',
            sessionID: '',
            status: 'destroyed',
            statusText: res
        }));
    }
    catch (err) {
        yield put(setCredentials({
            status: 'rejected',
            statusText: err
        }));
    }
};