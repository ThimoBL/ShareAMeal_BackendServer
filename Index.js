const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

let database = [];
let id = 0;

//GET
app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        result: "Hello World!"
    });
});
app.get('/api/movie', (req, res) => {
    res.status(200).json({
        status: 200,
        result: database
    });
});
app.get('/api/movie/:movieId', (req, res) => {
    let movie = database.filter(item => item.id == req.params.movieId);
    if (movie.length > 0 ) {
        console.log(movie);
        res.status(200).json({
            status: 200,
            result: movie
        })
    } else {
        res.status(404).json({
            status: 404,
            result: `Movie with id ${req.params.movieId} not found`
        })
    }

})

//POST
app.post('/api/movie', (req, res, next) => {
    let movie = req.body;
    console.log(movie);
    id++;

    movie = {
        id,
        ...movie,
    };

    database.push(movie);
    res.status(201).json({
        status: 201,
        result: database
    });
})

//PUT
app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user');
});

//DELETE
app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user');
});

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