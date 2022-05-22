const dbconnection = require('../../Database/dbconnection')
const assert = require('assert');

let mealController = {

    addMeal: (req, res, next) => {
        let allergenesString = "";

        if (req.body.allergenes) {
            for (let i = 0; i < req.body.allergenes.length; i++) {
                allergenesString += req.body.allergenes[i] + ",";
            }

        }
        dbconnection.getConnection((err, connection) => {
            if (err) next(err);

            connection.query(
                `INSERT INTO meal (name, description, isActive, isVega, isVegan, isToTakeHome, dateTime, imageUrl, allergenes, maxAmountOfParticipants, price, cookId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
                [
                    req.body.name,
                    req.body.description,
                    req.body.isActive,
                    req.body.isVega,
                    req.body.isVegan,
                    req.body.isToTakeHome,
                    req.body.dateTime,
                    req.body.imageUrl,
                    allergenesString,
                    req.body.maxAmountOfParticipants,
                    req.body.price,
                    req.userId,
                ],
                (error, results, fields) => {
                    connection.release();

                    if (error) next(error);
console.log(results);
                    if (results) {
                        return res.status(201).json({
                            statusCode: 201,
                            results: {
                                id: results.insertId,
                                ...req.body
                            }
                        })
                    } else {
                        return res.status(500).json({
                            statusCode: 500,
                            results: `Something went terribly wrong!`
                        })
                    }

                })
        })
    },

    getAllMeals: (req, res, next) => {

        dbconnection.getConnection((err, connection) => {
            if (err) next(err);

            connection.query(
                `SELECT * FROM meal`,
                (error, results, fields) => {

                    connection.release();

                    if (error) next(error);

                    return res.status(200).json({
                        statusCode: 200,
                        results: results
                    })
                })
        })
    },

    getMealById: (req, res, next) => {

        dbconnection.getConnection((err, connection) => {
            if (err) next(err);

            connection.query(
                `SELECT * FROM meal WHERE id = (?)`,
                [req.params.mealId],
                (error, results, fields) => {

                    connection.release();

                    if (error) next(error);

                    if (results.length) {
                        return res.status(200).json({
                            statusCode: 200,
                            results: results[0]
                        });
                    } else {
                        return res.status(404).json({
                            statusCode: 404,
                            results: `Maaltijd bestaat niet`
                        })
                    }
                })
        })
    },

    updateMeal: (req, res, next) => {

    },

    deleteMeal: (req, res, next) => {
        dbconnection.getConnection((err, connection) => {
            if (err) next(err);

            connection.query(
                `SELECT * FROM meal WHERE id = ?`,
                [req.params.mealId],
                (error, results, fields) => {

                    connection.release();

                    if (error) next(error);

                    if (results.length && req.userId != results[0].cookId) {
                        return res.status(403).json({
                            statusCode: 403,
                            results: `Niet de eigenaar van de data`,
                        })
                    } else {
                        if (results.length === 0) {
                            return res.status(404).json({
                                statusCode: 404,
                                results: `Maaltijd bestaat niet`,
                            })
                        } else {
                            connection.query(
                                `SELECT * FROM meal WHERE id = ?`,
                                [req.params.mealId],
                                (error, results, fields) => {
                                    connection.release();

                                    if (error) next(error);

                                    if (results.length) {
                                        return res.status(200).json({
                                            statusCode: 200,
                                            results: `Maaltijd succesvol verwijderd`,
                                        })
                                    } else {
                                        return res.status(404).json({
                                            statusCode: 404,
                                            results: `Maaltijd bestaat niet`,
                                        })
                                    }
                                })
                        }
                    }
                })
        })
    },

    validateMeal: (req, res, next) => {
        let meal = req.body;

        let {
            name,
            description,
            isActive,
            isVega,
            isVegan,
            isToTakeHome,
            dateTime,
            imageUrl,
            maxAmountOfParticipants,
            price
        } = meal;

        try {
            assert(typeof name === 'string', 'name must be string');
            assert(typeof description === 'string', 'description must be string');
            assert(typeof isActive === 'boolean', 'isActive must be boolean');
            assert(typeof isVega === 'boolean', 'isVega must be boolean');
            assert(typeof isVegan === 'boolean', 'isVegan must be boolean');
            assert(typeof isToTakeHome === 'boolean', 'isToTakeHome must be boolean');
            assert(typeof dateTime === 'string', 'dateTime must be string');
            assert(typeof imageUrl === 'string', 'imageUrl must be string');
            assert(typeof maxAmountOfParticipants === 'number', 'maxAmountOfParticipants must be number');
            assert(typeof price === 'number', 'price must be number');

            next();
        } catch (e) {
            const error = {
                statusCode: 400,
                results: e.message
            };
            next(error);
        }

    }

};

module.exports = mealController;