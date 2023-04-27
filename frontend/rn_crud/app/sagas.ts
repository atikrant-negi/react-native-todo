import { all} from 'redux-saga/effects';
import watchCredentials from '../features/credentials/credentialsSagas';
import watchTasks from '../features/task-list/taskListSagas';

export default function* rootSaga() {
    yield all([
        watchCredentials(),
        watchTasks()
    ]);
};