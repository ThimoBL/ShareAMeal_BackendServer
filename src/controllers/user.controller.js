const dbconnection = require('../../Database/dbconnection')
const assert = require('assert');

let userController = {
    addUser: (req, res) => {

        dbconnection.getConnection((err, connection) => {
            // if (err) throw err // not connected!

            let user = req.body;

            connection.query(
                `INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) ` +
                `VALUES ('${user.firstName}', '${user.lastName}', '${user.isActive ? 1 : 0}', '${user.emailAdress}', '${user.password}', '${user.phoneNumber ?? ''}', '${user.roles ?? ''}', '${user.street}', '${user.city}');`,
                (error, results, fields) => {
                    // When done with the connection, release it.
                    connection.release()

                    // Handle error after the release.
                    if (error && error.errno === 1062) {
                        return res.status(409).json({
                            statusCode: 409,
                            error: `A user already exists with that Email.`,
                        })
                    } else if (error) {
                        return res.status(400).json({
                            statusCode: 400,
                            error: error,
                        })
                    }

                    res.status(201).json({
                        statusCode: 201,
                        results: `User ${user.firstName} ${user.lastName} has been added!`,
                    })
                }
            )
        })
    },

    getAllUsers: (req, res, next) => {
        console.log(req.query);
        let {firstName, isActive, length} = req.query;
        let queryString = 'SELECT * FROM user';

        if (firstName || isActive) {
            queryString += ' WHERE';
            if (firstName) {
                queryString += ` firstName LIKE '%${firstName}%'`;
            }
            if (firstName && isActive) {
                queryString += ' AND'
            }
            if (isActive) {
                queryString += ` isActive LIKE '%${isActive === 'true' ? 1 : 0}%'`;
            }
        }

        if (length) {
            queryString += ` LIMIT ${length}`
        }

        console.log(queryString);

        dbconnection.getConnection((err, connection) => {
            if (err) next(err); // not connected!

            connection.query(
                queryString,
                [firstName, isActive],
                (error, results, fields) => {
                    // When done with the connection, release it.
                    connection.release()

                    // Handle error after the release.
                    if (error) next(error);

                    // Don't use the connection here, it has been returned to the pool.
                    console.log('#results = ', results.length)
                    for (let i = 0; i < results.length; i++) {
                        results[i].isActive = results[i].isActive === 1;
                    }
                    res.status(200).json({
                        statusCode: 200,
                        results: results,
                    })
                }
            )
        })
    },

    getUserProfile: (req, res, next) => {
        dbconnection.getConnection((err, connection) => {
            if (err) next(err); // not connected!

            connection.query(
                `SELECT * FROM user WHERE id = ${req.userId}`,
                (error, results, fields) => {
                    // When done with the connection, release it.
                    connection.release()

                    // Handle error after the release.
                    if (error) next(error);

                    if (results && results.length > 0) {

                        results[0].isActive = results[0].isActive === 1;
                        return res.status(200).json({
                            statusCode: 200,
                            results: results[0],
                        });
                    } else {
                        return res.status(401).json({
                            statusCode: 401,
                            message: `Can't find profile`,
                        });
                    }
                })
        })
    },

    getUserById: (req, res, next) => {

        dbconnection.getConnection((err, connection) => {
            if (err) throw err // not connected!

            connection.query(
                `SELECT * FROM user WHERE id = ${req.params.id}`,
                (error, results, fields) => {
                    // When done with the connection, release it.
                    connection.release()

                    // Handle error after the release.
                    if (error) throw error;

                    if (results.length === 0) {
                        res.status(404).json({
                            statusCode: 404,
                            error: "Geen gebruiker gevonden voor ingevoerde id"
                        })
                    } else {
                        // Don't use the connection here, it has been returned to the pool.
                        results[0].isActive = results[0].isActive === 1;
                        res.status(200).json({
                            statusCode: 200,
                            results: results,
                        })
                    }
                }
            )
        })
    },

    updateUser: (req, res, next) => {

        if (/^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9])((\s|\s?-\s?)?[0-9])((\s|\s?-\s?)?[0-9])\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]$/.test(req.body.phoneNumber) === false) {
            return res.status(400).json({
                statusCode: 400,
                results: 'PhoneNumber is invalid'
            })
        }

        dbconnection.getConnection((err, connection) => {
            if (err) throw err // not connected!

            let user = req.body;

            connection.query(
                `UPDATE user SET firstName = '${user.firstName}', lastName = '${user.firstName}', isActive = '${user.isActive ? 1 : 0}', emailAdress = '${user.emailAdress}', password = '${user.password}', phoneNumber = '${user.phoneNumber ?? ''}', roles = '${user.roles ?? ''}', street = '${user.street}', city = '${user.city}' WHERE id = ${req.params.id}`,
                (error, results, fields) => {
                    // When done with the connection, release it.
                    connection.release()

                    // Handle error after the release.
                    if (error) {
                        console.log(error)
                        res.status(401).json({
                            statusCode: 401,
                            results: error.sqlMessage,
                        })
                    }

                    // Don't use the connection here, it has been returned to the pool.
                    if (results.affectedRows === 0) {
                        res.status(404).json({
                            statusCode: 404,
                            error: "Geen gebruiker gevonden voor ingevoerde id"
                        })
                    } else {
                        res.status(200).json({
                            statusCode: 200,
                            results: `User ${user.firstName} ${user.lastName} has been updated!`,
                        })
                    }
                }
            )
        })

    },

    deleteUser: (req, res, next) => {

        dbconnection.getConnection((err, connection) => {
            if (err) throw err // not connected!

            if (req.params.id != req.userId) {
                return res.status(403).json({
                    statusCode: 403,
                    results: `Not authorized to delete the user.`,
                });
            }

            connection.query(
                `DELETE FROM user WHERE id = ${req.params.id}`,
                (error, results, fields) => {
                    // When done with the connection, release it.
                    connection.release()

                    // Handle error after the release.
                    if (error && error.errno === 1451) {
                        return res.status(200).json({
                            statusCode: 200,
                            results: `user successfully deleted!`,
                        })
                    } else if (error) {
                        throw error;
                    }

                    // Don't use the connection here, it has been returned to the pool.
                    if (results && results.affectedRows > 0) {
                        return res.status(200).json({
                            statusCode: 200,
                            results: `user successfully deleted!`,
                        })
                    } else {
                        return res.status(400).json({
                            statusCode: 400,
                            error: `No row found`,
                        })
                    }
                }
            )
        })

    },

    validateUser: (req, res, next) => {
        let user = req.body;

        let {
            firstName,
            lastName,
            isActive,
            emailAdress,
            password
        } = user;

        try {
            assert(typeof firstName === 'string', 'FirstName must be string');
            assert(typeof lastName === 'string', 'LastName must be string');
            assert(typeof isActive === 'boolean', 'isActive must be boolean');
            assert(typeof emailAdress === 'string', 'EmailAdress must be string');
            assert(typeof password === 'string', 'Password must be string');

            assert(emailAdress.includes('@'), `EmailAdress is invalid and must contain '@'`);
            assert(emailAdress.substring(emailAdress.indexOf('@') + 1).includes('.'), `EmailAdress is invalid and must contain '.' after '@'`);

            assert(password.length > 5, 'Password should at least contain 6 characters');
            assert(password.length < 30, 'Password should not contain more than 30 characters');

            next();
        } catch (e) {
            const error = {
                statusCode: 400,
                result: e.message
            };
            next(error);
        }
    }
}

module.exports = userController;