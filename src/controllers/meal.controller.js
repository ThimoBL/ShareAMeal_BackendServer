const dbconnection = require('../../Database/dbconnection')
const logger = require('../../src/config/config').logger
const assert = require('assert');

let mealController = {

    addMeal: (req, res, next) => {
        const allergenes = req.body.allergenes;
        let allergenesString = "";

        for (let index = 0; index < allergenes.length; index++) {
            allergenesString += allergenes[index] + ",";
        }

        if (allergenesString.equals !== "") {
            allergenesString = allergenesString.slice(0, -1);
        }

        let mealReq = req.body;
        let cookId = req.userId;
        let mealObject = { ...mealReq, cookId };

        mealObject.allergenes = allergenesString;

        console.log(mealObject);

        let values = Object.keys(mealObject).map(function (key) {
            return mealObject[key];
        });

        dbconnection.getConnection((err, connection) => {
            if (err) throw (err);

            if (req.body.dateTime.includes("T") || req.body.dateTime.includes("Z")) {
                return res.status(400).json({
                    statusCode: 400,
                    results: `Datetime is not in the right format!`
                })
            }

            const query = `INSERT INTO meal (name, description, isActive, isVega, isVegan, isToTakeHome, dateTime, imageUrl, allergenes, maxAmountOfParticipants, price, cookId) VALUES (?);`;

            connection.query(
                query,
                [values],
                (error, results, fields) => {
                    connection.release();

                    if (error) throw (error);

                    logger.debug(`Query results: ${results}`)

                    if (results.affectedRows > 0) {
                        let meal = {
                            id: results.insertId,
                            ...req.body
                        };
                        return res.status(201).json({
                            statusCode: 201,
                            results: meal
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