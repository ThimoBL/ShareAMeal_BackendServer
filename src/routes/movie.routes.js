const express = require('express');
const database = require("../../Database/InMemDb");
const router = express.Router();

//GET
router.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        result: "Hello World!"
    });
});

router.get('/api/user', (req, res) => {
    //Check if user is logged in
    database.listUsers((error, result) => {
        console.log(`index.js: all movies shown!`)
        res.status(200).json({
            statusCode: 200,
            result,
        })
    })
})

router.get('/api/user/profile', (req, res) => {
    res.status(401).json({
        statusCode: 401,
        Error: 'Deze functionaliteit is nog niet geimplementeerd'
    });
})

router.get('/api/user/:userId', (req, res) => {
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

//POST
router.post('/api/user', (req, res) => {
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

router.post('/api/auth/login', (req, res) => {
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

//PUT
router.put('/api/user/:userId', (req, res) => {
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
router.delete('/api/user/:userId', (req, res) => {
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

module.exports = router;
