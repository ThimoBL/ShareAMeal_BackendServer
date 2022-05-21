const express = require('express');
const database = require("../../Database/dbconnection");
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

//GET
router.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        result: "Hello World!"
    });
});

router.get('/api/user', authController.validateToken, userController.getAllUsers);

router.get('/api/user/profile', authController.validateToken, userController.getUserProfile);

router.get('/api/user/:id', authController.validateToken, userController.getUserById);

//POST
router.post('/api/user', userController.validateUser, userController.addUser);

//PUT
router.put('/api/user/:id', authController.validateToken, userController.validateUser, userController.updateUser);

//DELETE
router.delete('/api/user/:id', authController.validateToken, userController.deleteUser);

module.exports = router;
