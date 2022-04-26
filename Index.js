const express = require('express');
const app = express();

const database = require('./Database/InMemDb')

const port = process.env.PORT || 3000;

const UserRouter = require('./src/routes/movie.routes');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(UserRouter);

//ERROR HANDLER
app.use((err, req, res, next) => {
    res.status(err.status).json({
        error: err
    });
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
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});