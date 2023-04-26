const { Router } = require('express');
const bodyParser = require('body-parser');

const fs = require('fs/promises');
const path = require('path');

const { hasEmptyFields } = require('../src/utils');

const router = Router();
const paths = {
    users: path.join(__dirname, '..', 'data', 'users.json'),
    sessions: path.join(__dirname, '..', 'data', 'sessions.json'),
    tasks: path.join(__dirname, '..', 'data', 'tasks.json')
};

router.post('/signup', bodyParser.json(), (req, res, next) => {
    // reject if required fields are empty
    let body = req.body;
    if (hasEmptyFields(body, 'name', 'username', 'email', 'password')) {
        res.status(400).send('body contains missing or empty fields');
        return;
    }

    // read, update and write to user.json
    fs.readFile(paths.users).then(data => {
        data = JSON.parse(data.toString());
        // username and email should not be associated with multiple accounts
        let index = data.findIndex(x => ( x.username === body.username || x.email === body.username ));
        if (index != -1) {
            res.status(400).send('username or email already exists');
            return;
        }
        data.push(body);

        // update and write to the file
        // error can only be triggered in case of a write failure
        fs.writeFile(paths.users, JSON.stringify(data)).then(() => {
            res.status(201).send('user added successfully');
        }).catch((err) => {
            console.log(err);
            res.status(500).send('500, internal error')
        });
    }).catch(err => {
        console.log(err);
        res.status(500).send('500, internal error');
    });
});

router.post('/login', bodyParser.json(), (req, res, next) => {
    // reject if required files are empty
    let body = req.body;
    if (hasEmptyFields(body, 'username', 'password')) {
        res.status(400).send('body contains missing or empty fields');
        return;
    }

    // if there is any session id already associated with a username, append a new key
    // otherwise create a [username, keys] pair
    fs.readFile(paths.users).then(data => {
        // validate credentials
        data = JSON.parse(data.toString());
        let index = data.findIndex(x => x.username == body.username);
        if (index == -1 || data[index].password != body.password) {
            res.status(400).send('invalid credentials');
            return;
        }

        // generate a new key and add it to the list of keys
        let key = Math.round(Math.random() * 1e16).toString(16);
        fs.readFile(paths.sessions).then(sessions => {
            sessions = JSON.parse(sessions.toString());

            if (!sessions[body.username]) sessions[body.username] = [key];
            else sessions[body.username].push(key);

            fs.writeFile(paths.sessions, JSON.stringify(sessions)).then(() => {
                res.status(201).send(key);
            }).catch(err => {
                res.status(500).send('500, internal error');
                console.log(err);
            });
        }).catch(err => {
            res.status(500).send('500, internal error');
            console.log(err);
        });
    });
});

router.post('/logout', bodyParser.json(), (req, res, next) => {
    // reject if required field are empty
    let body = req.body;
    if (hasEmptyFields(body, 'username', 'sessionID')) {
        res.status(400).send('body contains missing or empty fields');
        return;
    }

    // if a userame, key pair is found in the list of active session ids, remove it
    fs.readFile(paths.sessions).then(sessions => {
        // fetch the index of the key associated with the username
        sessions = JSON.parse(sessions.toString());
        if (!sessions[body.username] || !sessions[body.username].find(x => x == body.sessionID)) {
            res.status(401).send('Invalid Credentials');
            return;
        }

        // delete the entry entirely if there is exactly one session key, else remove it
        if (sessions[body.username].length == 1) delete sessions[body.username];
        else sessions[body.username] = sessions[body.username].filter(x => x != body.sessionID);
        
        fs.writeFile(paths.sessions, JSON.stringify(sessions)).then(() => {
            res.status(201).send('logout successful');
        }).catch(err => {
            res.status(500).send('500, internal error');
            console.log(err);
        });
    }).catch(err => {
        res.status(500).send('500, internal error');
        console.log(err);
    });
});

module.exports = router;