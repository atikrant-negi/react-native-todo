const hostname = "http://192.180.0.211";
const port = 8000;

export const fetchLogin = async (username: string, password: string) => {
    return fetch(`${hostname}:${port}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(x => Promise.all([x.text(), Promise.resolve(x.status)]))
    .then(([text, status]) => {
        if (status >= 200 && status < 300) return {
            username,
            sessionID: text
        };
        else throw text;
    });
};

type SignupPayload = {
    name: string,
    email: string,
    username: string,
    password: string,
};
export const fetchSignup = async (data: SignupPayload) => {
    return fetch(`${hostname}:${port}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(x => Promise.all([x.text(), Promise.resolve(x.status)]))
    .then(([text, status]) => {
        if (status >= 200 && status < 300) return text;
        else throw text;
    });
};

export const fetchLogout = async (username: string, sessionID: string) => {
    return fetch(`${hostname}:${port}/auth/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, sessionID })
    })
    .then(x => Promise.all([x.text(), Promise.resolve(x.status)]))
    .then(([text, status]) => {
        if (status >= 200 && status < 300) return text;
        else throw text;
    });
};