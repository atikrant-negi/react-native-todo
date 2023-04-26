const express = require('express');

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const app = express();

app.use('/auth', authRouter);
app.use('/user', userRouter);

app.use((err, req, res, next) => {
    res.status(500).send("500, internal error");
    console.log(err);
});

app.listen(8000);