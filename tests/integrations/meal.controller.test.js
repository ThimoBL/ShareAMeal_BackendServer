process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb';
process.env.LOGLEVEL = "warn";

const chai = require('chai');
const jwt = require('jsonwebtoken');
const chaiHttp = require('chai-http');
const server = require('../../Index');
const database = require("../../Database/dbconnection");
const dbconnection = require("../../Database/dbconnection");

const {jwtSecretKey, logger} = require("../../src/config/config");

chai.should();
chai.use(chaiHttp);

const CLEAR_USERS_TABLE = "DELETE IGNORE FROM `user`;";
const CLEAR_MEAL_TABLE = "DELETE IGNORE FROM `meal`;";
const CLEAR_MEAL_PARTICIPANT_TABLE =
    "DELETE IGNORE FROM `meal_participants_user`;";
const CLEAR_DB =
    CLEAR_MEAL_TABLE + CLEAR_MEAL_PARTICIPANT_TABLE + CLEAR_USERS_TABLE;

const INSERT_USER =
    "INSERT INTO `user` (`id`, `firstName`, `lastName`, `street`, `city`, `isActive`, `password`, `emailAdress`,  `phoneNumber` ) VALUES" +
    '(1, "Thimo", "Luijsterburg", "Teststraat", "Breda", true,  "secret", "thimo@gmail.com", "0612345678"),' +
    '(2, "Romy", "Luijsterburg", "Teststraat", "Breda", false,  "secret", "romy@gmail.com", "0612345678");';

const INSERT_MEAL =
    "INSERT INTO `meal` (`id`, `name`, `description`, `isActive`, `isVega`, `isVegan`, `isToTakeHome`, `dateTime`, `imageUrl`, `allergenes`, `maxAmountOfParticipants`, `price`, `cookId`) VALUES" +
    '(1, "meal A", "meal A description", true, true, true, true, "2021-06-14 12:55:36", "image_url_mealA", "gluten,noten,lactose", 6, 1.35, 1),' +
    '(2, "meal B", "meal B description", true, true, true, true, "2021-11-14 11:48:34", "image_url_mealB", "gluten,noten,lactose", 6, 0.95, 2);';

describe('TC Manage Meals', () => {
    describe('TC 301', () => {
        beforeEach((done) => {
            console.log("beforeEach called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err; // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEAL,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release();

                        // Handle error after the release.
                        if (error) throw error;
                        done();
                    }
                );
            });
        });

        it('Verplicht veld ontbreekt', (done) => {
            chai.request(server)
                .post("/api/meal")
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .send({
                    // name: "Spaghetti Bolognese",
                    description: "Dé pastaklassieker bij uitstek.",
                    isActive: true,
                    isVega: true,
                    isVegan: true,
                    isToTakeHome: true,
                    dateTime: "2022-05-21T11:13:11.932Z",
                    imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                    allergenes: [
                        "gluten",
                        "noten",
                        "lactose"
                    ],
                    maxAmountOfParticipants: 6,
                    price: 6.75,
                    cookId: 1
                })
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(400);
                    results.should.be.a("string").that.equals("name must be string");
                    done();
                });
        })

        it("Niet ingelogd", (done) => {
            chai.request(server)
                .post("/api/meal")
                .send({
                    name: "Spaghetti Bolognese",
                    description: "Dé pastaklassieker bij uitstek.",
                    isActive: true,
                    isVega: true,
                    isVegan: true,
                    isToTakeHome: true,
                    dateTime: "2022-05-21T11:13:11.932Z",
                    imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                    allergenes: [
                        "gluten",
                        "noten",
                        "lactose"
                    ],
                    maxAmountOfParticipants: 6,
                    price: 6.75,
                    cookId: 1
                })
                .end((err, res) => {
                    res.should.be.an("object");
                    let {error, datetime} = res.body;
                    res.should.have.status(401);
                    error.should.be.a("string").that.equals("Authorization header missing!");
                    done();
                });
        });

        it("Maaltijd succesvol toegevoegd", (done) => {
            chai.request(server)
                .post("/api/meal")
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .send({
                    name: "Spaghetti Bolognese",
                    description: "Dé pastaklassieker bij uitstek.",
                    isActive: true,
                    isVega: true,
                    isVegan: true,
                    isToTakeHome: true,
                    dateTime: "2022-05-21T11:13:11.932Z",
                    imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                    allergenes: [
                        "gluten",
                        "noten",
                        "lactose"
                    ],
                    maxAmountOfParticipants: 6,
                    price: 6.75,
                    cookId: 1
                })
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(201);
                    results.should.be.a("object").that.contains({
                        id: results.id,
                        name: "Spaghetti Bolognese",
                        description: "Dé pastaklassieker bij uitstek.",
                        isActive: results.isActive,
                        isVega: results.isVega,
                        isVegan: results.isVegan,
                        isToTakeHome: results.isToTakeHome,
                        dateTime: "2022-05-21T11:13:11.932Z",
                        imageUrl: "https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg",
                        allergenes: results
                            .allergenes,
                        maxAmountOfParticipants: 6,
                        price: 6.75,
                    });
                    done();
                });
        });
    })

    describe('TC 303', () => {
        beforeEach((done) => {
            console.log("beforeEach called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err; // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEAL,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release();

                        // Handle error after the release.
                        if (error) throw error;
                        done();
                    }
                );
            });
        });

        it("Lijst van maaltijden geretourneerd", (done) => {
            chai
                .request(server)
                .get("/api/meal")
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.an("array");
                    done();
                });
        });
    })

    describe('TC 304', () => {
        beforeEach((done) => {
            console.log("beforeEach called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err; // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEAL,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release();

                        // Handle error after the release.
                        if (error) throw error;
                        done();
                    }
                );
            });
        });

        it("Maaltijd bestaat niet", (done) => {
            chai.request(server)
                .get(`/api/meal/0`)
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(404);
                    results.should.be.a("string").that.equals(`Maaltijd bestaat niet`);
                    done();
                });
        });

        it("Details van maaltijd geretourneerd", (done) => {
            chai.request(server)
                .get(`/api/meal/1`)
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.a("object").that.contains({
                        id: 1,
                        isActive: 1,
                        isVega: 1,
                        isVegan: 1,
                        isToTakeHome: 1,
                        dateTime: results.dateTime,
                        maxAmountOfParticipants: 6,
                        price: results.price,
                        imageUrl: "image_url_mealA",
                        cookId: 1,
                        createDate: results.createDate,
                        updateDate: results.updateDate,
                        name: "meal A",
                        description: "meal A description",
                        allergenes: results.allergenes,
                    });
                    done();
                });
        });
    })

    describe('TC 305', () => {
        beforeEach((done) => {
            console.log("beforeEach called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err; // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER + INSERT_MEAL,
                    function (error, results, fields) {
                        // When done with the connection, release it.
                        connection.release();

                        // Handle error after the release.
                        if (error) throw error;
                        done();
                    }
                );
            });
        });

        it("Niet ingelogd", (done) => {
            chai.request(server)
                .delete("/api/meal/1")
                .end((err, res) => {
                    res.should.be.an("object");
                    let {error, datetime} = res.body;
                    res.should.have.status(401);
                    error.should.be.a("string").that.equals("Authorization header missing!");
                    done();
                });
        });

        it("Niet de eigenaar van de data", (done) => {
            chai.request(server)
                .delete("/api/meal/1")
                .set("authorization", "Bearer " + jwt.sign({userId: 2}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(403);
                    results.should.be.a("string").that.equals("Niet de eigenaar van de data");
                    done();
                });
        });

        it("Maaltijd bestaat niet", (done) => {
            chai.request(server)
                .delete("/api/meal/0")
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(404);
                    results.should.be.a("string").that.equals("Maaltijd bestaat niet");
                    done();
                });
        });

        it("Maaltijd succesvol verwijderd", (done) => {
            chai.request(server)
                .delete("/api/meal/2")
                .set("authorization", "Bearer " + jwt.sign({userId: 2}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.a("string").that.equals("Maaltijd succesvol verwijderd");
                    done();
                });
        });

    })
})