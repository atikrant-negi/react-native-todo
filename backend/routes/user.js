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

// parse authorization credentials
router.use((req, res, next) => {
    if (!req.headers.authorization) {
        res.status(401).json({
            message: 'Credentials invalid'
        });
        return;
    }

    let auth = Buffer.from(req.headers.authorization.split(' ')[1], 'base64');
    let [username, token] = auth.toString('ascii').split(':');
    
    // check if the token belongs to the active token list associated with the username
    fs.readFile(paths.sessions).then(sessions => {
        sessions = JSON.parse(sessions.toString());
        if (!sessions[username] || !sessions[username].find(x => x == token)) {
            res.status(401).json({
                message: 'Invalid credentials'
            });
            return;
        }
        req.auth = { username, token };

        next();
    }).catch(err => {
        res.status(500).json({
            message: '500, internal error'
        });
        console.log(err);
    });
});

// fetch user data from username
router.get('/info', (req, res, next) => {
    fs.readFile(paths.users).then(users => {
        users = JSON.parse(users.toString());
        let user = users.find(x => x.username == req.auth.username);
        if (user === undefined)
            throw "unhandled exception at /user/info";

        delete user.password;
        res.json(user);
    }).catch(err => {
        res.status(500).json({
            message: '500, internal error'
        });
        console.log(err);
    });
});

// fetch all the tasks associated with the user
router.get('/tasks', (req, res, next) => {
    fs.readFile(paths.tasks).then(tasks => {
        tasks = JSON.parse(tasks.toString());
        tasks = tasks[req.auth.username] || [];

        res.json(tasks);
    }).catch(err => {
        res.status(500).json({
            message: '500, internal error'
        });
        console.log(err);
    });
});

// add a single task or a list of tasks
router.post('/addTasks', bodyParser.json(), (req, res, next) => {
    // reject if required fields are empty
    let body = req.body;
    if (!Array.isArray(body) && hasEmptyFields(body, 'id', 'title', 'priority', 'addDate')) {
        res.status(400).json({
            message: 'body contains missing or empty fields'
        });
        return;
    }
    for (let i = 0; i < body.length; i++) {
        if (hasEmptyFields(body[i], 'id', 'title', 'priority', 'addDate')) {
            res.status(400).json({
                message: 'body contains missing or empty fields'
            });
            return;
        }
    }

    fs.readFile(paths.tasks).then(tasks => {
        tasks = JSON.parse(tasks.toString());
        if (!tasks[req.auth.username]) tasks[req.auth.username] = [];

        // add a single task
        if (!Array.isArray(body)) {
            tasks[req.auth.username].push({
                id: body.id,
                title: body.title, desc: body.desc || '',
                priority: body.priority, addDate: body.addDate
            });
        }
        // add a list of tasks
        else {
            body.forEach(x => {
                tasks[req.auth.username].push({
                    id: x.id,
                    title: x.title, desc: x.desc || '',
                    priority: x.priority, addDate: x.addDate
                });
            });
        }

        // update data
        fs.writeFile(paths.tasks, JSON.stringify(tasks)).then(() => {
            res.status(201).json({
                message: 'Task added successfully'
            });
        }).catch(err => {
            res.status(500).json({
                message: '500, internal error'
            });
            console.log(err);
        });

    }).catch(err => {
        res.status(500).json({
            message: '500, internal error'
        });
        console.log(err);
    });
});

// remove task using its unique id
router.post('/removeAllTasks', (req, res, next) => {
    fs.readFile(paths.tasks).then(tasks => {
        tasks = JSON.parse(tasks.toString());

        if (tasks[req.auth.username] != undefined) {
            tasks[req.auth.username] = [];

            fs.writeFile(paths.tasks, JSON.stringify(tasks)).then(() => {
                res.status(201).json({
                    message: 'Tasks removed successfully'
                });
            }).catch(err => {
                res.status(500).json({
                    message: '500, internal error'
                });
                console.log(err);
            });
        }
        else {
            res.status(201).json({
                message: 'Tasks removed successfully'
            });
        }
    }).catch(err => {
        res.status(500).json({
            message: '500, internal error'
        });
        console.log(err);
    });
});

// router.post('/finished', (req, res, next) => {

// });

// router.get('/finished', (req, res, next) => {

// });

module.exports = router;