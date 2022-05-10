const express = require('express');
const database = require("../../Database/InMemDb");
const router = express.Router();
const userController = require('../controllers/user.controller');

//GET
router.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        result: "Hello World!"
    });
});

router.get('/api/user', userController.getAllUsers);

router.get('/api/user/profile', (req, res) => {
    res.status(401).json({
        statusCode: 401,
        Error: 'Deze functionaliteit is nog niet geimplementeerd'
    });
})

router.get('/api/user/:id', userController.getUserById);

//POST
router.post('/api/user', userController.validateUser, userController.addUser);

router.post('/api/auth/login', (req, res) => {
    res.status(401).json({
        statusCode: 401,
        Error: 'Deze functionaliteit is nog niet geimplementeerd'
    });
})

//PUT
router.put('/api/user/:id', userController.validateUser, userController.updateUser);

//DELETE
router.delete('/api/user/:id', userController.deleteUser);

module.exports = router;
