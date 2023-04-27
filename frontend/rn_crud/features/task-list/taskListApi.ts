import base64 from 'base-64'

const hostname = 'http://192.180.0.211';
const port = 8000;

const createAuth = (username: string, sessionID: string) => base64.encode(username + ':' + sessionID);
/**
 * fetch an array of tasks associated with the username from the server
 * failure triggered in case of invalid credentials or server / network error
 */
export const fetchGetTasks = async (username:string, sessionID: string) => {
    return fetch(`${hostname}:${port}/user/tasks`, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${createAuth(username, sessionID)}`
        }
    })
    .then(res => {
        if (res.status >= 200 && res.status < 300) return res.json();
        else return res.text();
    }).then(res => {
        if (typeof res == 'string') throw res;
        else return res;
    });
};

/**
 * delete all entries of tasks associated with the username from the server
 * failure triggered in case of invalid credentials or network / server error 
 */
export const fetchDeleteTasks = async (username: string, sessionID: string) => {
    return fetch(`${hostname}:${port}/user/removeAllTasks`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${createAuth(username, sessionID)}`
        }
    })
    .then(res => Promise.all([res.text(), Promise.resolve(res.status)]))
    .then(([text, status]) => {
        if (status >= 200 && status < 300) return text;
        else throw text;
    });
}

/**
 * append all tasks currently in state memory to the server
 * failure triggered in case of invalid credentials, invalid request body, network / server error
 */
export const fetchAddTasks = async (username: string, sessionID: string, tasks: Array<{}>) => {
    return fetch(`${hostname}:${port}/user/addTasks`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${createAuth(username, sessionID)}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tasks)
    }).then(res => {
        return Promise.all([res.text(), Promise.resolve(res.status)]);
    }).then(([text, status]) => {
        if (status >= 200 && status < 300) return text;
        else throw text;
    });
}