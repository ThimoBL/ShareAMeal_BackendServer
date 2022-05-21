const express = require('express');
const app = express();
require('dotenv').config();

const database = require('./Database/dbconnection')

const port = process.env.PORT

const UserRouter = require('./src/routes/user.routes');
const AuthRouter = require('./src/routes/auth.routes');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(UserRouter);
app.use(AuthRouter);

//ERROR HANDLER
app.use((err, req, res, next) => {
    res.status(err.statusCode).json(err);
})

//ALL METHODS (GET, POST, PUT & DELETE)
app.all('/secret', (req, res, next) => {
    console.log('Accessing the secret section ...')
    next() // pass control to the next handler
})

//NO ENDPOINTS FOUND
app.use((req, res, next) => {
    res.status(404).send({
        status: 404,
        result: "Endpoint not found!"
    })
})

//ERROR OCCURRED
app.use((err, req, res, next) => {
    console.error(err.toString())
    res.status(500).json({
        statusCode: 500,
        message: err.toString(),
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

module.exports = app;