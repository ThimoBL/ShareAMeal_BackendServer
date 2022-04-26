const database = require("../../Database/InMemDb");
const assert = require('assert');

let userController = {
    validateUser: (req, res, next) => {
        let user = req.body;

        let {
            firstName,
            lastName,
            street,
            city,
            password,
            emailAdress
        } = user;

        try {
            assert(typeof firstName === 'string', 'FirstName must be string');
            assert(typeof lastName === 'string', 'LastName must be string');
            assert(typeof street === 'string', 'Street must be string');
            assert(typeof city === 'string', 'City must be string');
            assert(typeof password === 'string', 'Password must be string');
            assert(typeof emailAdress === 'string', 'EmailAdress must be string');
        } catch (e) {
            const error = {
                status: 400,
                result: e.message
            };
            next(error);
        }
    },

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

    getUserById: (req, res, next) => {
        database.getUserById(req.params.userId, (err, result) => {
            if (err) {
                console.log(`index.js: ${err}`)

                const error = {
                    status: 404,
                    error: err
                }

                next(error);
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