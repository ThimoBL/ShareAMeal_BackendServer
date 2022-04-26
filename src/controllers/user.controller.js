const database = require("../../Database/InMemDb");

let userController = {

    addUser: (req, res) => {
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
    },

    getAllUsers: (req, res) => {
        //Check if user is logged in
        database.listUsers((error, result) => {
            console.log(`index.js: all movies shown!`)
            res.status(200).json({
                statusCode: 200,
                result,
            })
        })
    },

    getUserById: (req, res) => {
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
    }
}

module.exports = userController;