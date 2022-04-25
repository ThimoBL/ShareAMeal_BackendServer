const express = require('express');
const app = express();

const database = require('./Database/InMemDb')

const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.json());

//POST
app.post('/api/user', (req, res) => {
    database.createUser(req.body, (error, result) => {
        if (error) {
            console.log(`index.js: ${error}`)
            res.status(401).json({
                statusCode: 401,
                error,
            })
        }
        if (result) {
            console.log(`index.js: movie successfully added!`)
            res.status(201).json({
                statusCode: 201,
                result,
            })
        }
    })
});

app.post('/api/auth/login', (req, res) => {
    res.status(401).json({
        statusCode: 401,
        Error: 'Deze functionaliteit is nog niet geimplementeerd'
    });
    // if (req.body.emailAdress && req.body.password) {
    //     database.login(req.body.emailAdress, req.body.password, (error, result) => {
    //         if (error) {
    //             console.log(`index.js: ${error}`)
    //             res.status(401).json({
    //                 statusCode: 401,
    //                 error,
    //             })
    //         }
    //         if (result) {
    //             console.log(`index.js: user successfully logged in!`)
    //             res.status(201).json({
    //                 statusCode: 201,
    //                 result,
    //             })
    //         }
    //     })
    // } else {
    //     res.status(401).json({
    //         statusCode: 401,
    //         error: 'Parameters missing in body',
    //     })
    // }
})

//GET
app.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        result: "Hello World!"
    });
});

app.get('/api/user', (req, res) => {
    //Check if user is logged in
    database.listUsers((error, result) => {
        console.log(`index.js: all movies shown!`)
        res.status(200).json({
            statusCode: 200,
            result,
        })
    })
})

app.get('/api/user/profile', (req, res) => {
    res.status(401).json({
        statusCode: 401,
        Error: 'Deze functionaliteit is nog niet geimplementeerd'
    });
})

app.get('/api/user/:userId', (req, res) => {
    database.getUserById(req.params.userId, (error, result) => {
        if (error) {
            console.log(`index.js: ${error}`)
            res.status(401).json({
                statusCode: 401,
                error,
            })
        }
        if (result) {
            console.log(`index.js: user successfully shown!`)
            res.status(200).json({
                statusCode: 200,
                result,
            })
        }
    })
});

//PUT
app.put('/api/user/:userId', (req, res) => {
    database.updateUser(req.params.userId, req.body, (error, result) => {
        if (error) {
            console.log(`index.js: ${error}`)
            if (error == 'User is allowed to edit id.') {
                res.status(400).json({
                    statusCode: 401,
                    error,
                })
            } else {
                res.status(403).json({
                    statusCode: 403,
                    error,
                })
            }
        }
        if (result) {
            console.log(`index.js: user successfully updated!`)
            res.status(200).json({
                statusCode: 200,
                result,
            })
        }
    })
});

//DELETE
app.delete('/api/user/:userId', (req, res) => {
    database.deleteUser(req.params.userId, (error, result) => {
        if (error) {
            console.log(`index.js: ${error}`)
            res.status(401).json({
                statusCode: 401,
                error,
            })
        }
        if (result) {
            console.log(`index.js: user successfully deleted!`)
            res.status(200).json({
                statusCode: 200,
                result,
            })
        }
    })
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