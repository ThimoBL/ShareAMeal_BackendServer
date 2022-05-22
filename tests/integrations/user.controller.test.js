process.env.DB_DATABASE = process.env.DB_DATABASE || 'share-a-meal-testdb';
process.env.LOGLEVEL = "warn"; //warn

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

describe('TC Manage users', () => {
    describe('TC 201', () => {
        beforeEach((done) => {
            console.log("beforeEach called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err; // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER,
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

        //TC 201 - 1, 2 & 3
        it('TC 201 - 1 Verplicht veld ontbreekt', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    //FirstName ontbreekt
                    "lastName": "Doe",
                    "isActive": true,
                    "street": "Lovensdijkstraat 61",
                    "city": "Breda",
                    "password": "secret",
                    "emailAdress": "j.doe@server.con"
                })
                .end((err, res) => {
                    res.should.be.an('object');
                    let {statusCode, result} = res.body
                    statusCode.should.equal(400);
                    result.should.be.a('string').that.equals('FirstName must be string');
                    done();
                });

            it('Should require LastName.', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        "firstName": "John",
                        // "lastName": "Doe",
                        "isActive": true,
                        "street": "Lovensdijkstraat 61",
                        "city": "Breda",
                        "password": "secret",
                        "emailAdress": "j.doe@server.con"
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals('LastName must be string');
                        done();
                    });
            });

            it('Should require isActive.', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        // "isActive": true,
                        "street": "Lovensdijkstraat 61",
                        "city": "Breda",
                        "password": "secret",
                        "emailAdress": "j.doe@server.con"
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals('isActive must be boolean');
                        done();
                    });
            });

            it('Should require Password.', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        "isActive": true,
                        "street": "Lovensdijkstraat 61",
                        "city": "Breda",
                        // "password": "secret",
                        "emailAdress": "j.doe@server.con"
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals('Password must be string');
                        done();
                    });
            });

            it('Should require EmailAddress.', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        "isActive": true,
                        "street": "Lovensdijkstraat 61",
                        "city": "Breda",
                        "password": "secret",
                        // "emailAdress": "j.doe@server.con"
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals('EmailAdress must be string');
                        done();
                    });
            });

            it('Should require @ in EmailAddress.', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        "isActive": true,
                        "street": "Lovensdijkstraat 61",
                        "city": "Breda",
                        "password": "secret",
                        "emailAdress": "j.doeserver.con"
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals(`EmailAdress is invalid and must contain '@'`);
                        done();
                    });
            });

            it('Should require . in EmailAddress.', (done) => {
                chai.request(server)
                    .post('/api/user')
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        "isActive": true,
                        "street": "Lovensdijkstraat 61",
                        "city": "Breda",
                        "password": "secret",
                        "emailAdress": "j.doe@servercon"
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals(`EmailAdress is invalid and must contain '.' after '@'`);
                        done();
                    });
            });
        })

        it('TC 201 - 4 Gebruiker bestaat al', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    "firstName": "Thimo",
                    "lastName": "Luijsterburg",
                    "isActive": true,
                    "emailAdress": "thimo@gmail.com",
                    "password": "secret",
                    "phoneNumber": "0612345678",
                    "roles": "editor,guest",
                    "street": "Teststraat",
                    "city": "Breda"
                })
                .end((err, res) => {
                    res.should.be.an('object');
                    let {statusCode, error} = res.body;
                    statusCode.should.equal(409);
                    error.should.be.a('string').that.equals("A user already exists with that Email.");
                    done();
                })
        })

        it('TC 201 - 5 Gebruiker succesvol geregistreerd', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    "firstName": "Thimo",
                    "lastName": "Luijsterburg",
                    "isActive": true,
                    "emailAdress": "thimo.test@server.com",
                    "password": "secret",
                    "phoneNumber": "06 12425475",
                    "roles": "editor,guest"
                })
                .end((err, res) => {
                    res.should.be.an('object');
                    let {statusCode, results} = res.body;
                    statusCode.should.equal(201);
                    results.should.be.a('string').that.equals("User Thimo Luijsterburg has been added!");
                    done();
                })
            after((done) => {
                dbconnection.getConnection((err, connection) => {
                    if (err) throw err;
                    connection.query(`DELETE FROM user WHERE emailAdress = 'thimo.test@server.com'`,
                        (err, res, fields) => {
                            connection.release()

                            if (err) {
                                throw err;
                            } else {
                                done();
                            }
                        })
                })
            })
        })
    })

    describe('TC 202', () => {
        beforeEach((done) => {
            console.log("beforeEach called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err; // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER,
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

        it("TC 202 - 1 show zero users.", (done) => {
            chai.request(server)
                .get("/api/user?length=0")
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.an("array").that.is.empty;
                    done();
                });
        });

        it("TC 202 - 2 show two users.", (done) => {
            chai.request(server)
                .get("/api/user?length=2")
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.an("array");
                    results.length.should.be.eql(2);
                    done();
                });
        });

        it("TC 202 - 3 Show users with non existing name.", (done) => {
            chai
                .request(server)
                .get("/api/user?firstName=abcasdfwe")
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.an("array");
                    results.length.should.be.eql(0);
                    done();
                });
        });

        it("TC 202 - 4 Show users with isActive = false.", (done) => {
            chai
                .request(server)
                .get("/api/user?isActive=false")
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.an("array");
                    results.length.should.be.eql(1);
                    done();
                });
        });

        it("TC 202 - 5 Show users with isActive = true.", (done) => {
            chai
                .request(server)
                .get("/api/user?isActive=true")
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.an("array");
                    results.length.should.be.eql(1);
                    done();
                });
        });


        it("TC 202 - 6 Show users with existing name.", (done) => {
            chai
                .request(server)
                .get("/api/user?firstName=Thimo")
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.an("array");
                    results.length.should.be.eql(1);
                    done();
                });
        });
    })

    describe('TC 203', () => {
        beforeEach((done) => {
            console.log("beforeEach called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err; // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER,
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

        it("TC-203-1 invalid token", (done) => {
            chai.request(server)
                .get(`/api/user/profile`)
                .set(
                    "authorization",
                    "Bearer " + jwt.sign({userId: 2}, jwtSecretKey) + "BlaBla"
                )
                .end((err, res) => {
                    res.should.be.an("object");
                    let {error, datetime} = res.body;
                    res.should.have.status(401);
                    error.should.be.a("string").that.equals('Not authorized');
                    done();
                });
        });

        it("TC-203-2 valid token", (done) => {
            chai.request(server)
                .get(`/api/user/profile`)
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.a("object").that.contains({
                        id: results.id,
                        firstName: "Thimo",
                        lastName: "Luijsterburg",
                        isActive: true,
                        emailAdress: "thimo@gmail.com",
                        password: "secret",
                        phoneNumber: "0612345678",
                        roles: "editor,guest",
                        street: "Teststraat",
                        city: "Breda",
                    });
                    done();
                });
        });
    })

    describe('TC-204', () => {
        beforeEach((done) => {
            console.log("beforeEach called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err; // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER,
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

        it("TC-204-1 Invalid token.", (done) => {
            chai
                .request(server)
                .get(`/api/user/1`)
                .set(
                    "authorization",
                    "Bearer " + jwt.sign({userId: 1}, jwtSecretKey + "BlaBla")
                )
                .end((err, res) => {
                    res.should.be.an("object");
                    let {error, datetime} = res.body;
                    res.should.have.status(401);
                    error.should.be.a("string").that.equals(`Not authorized`);
                    done();
                });
        });

        it("TC-204-2 Used id doesnt exist.", (done) => {
            chai.request(server)
                .get(`/api/user/999`)
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, error} = res.body;
                    statusCode.should.equals(404);
                    error.should.be.a("string").that.equals(`Geen gebruiker gevonden voor ingevoerde id`);
                    done();
                });
        });

        it("TC-204-3 Used id does exists.", (done) => {
            chai.request(server)
                .get("/api/user/1")
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    statusCode.should.equals(200);
                    results.should.be.an("array");
                    results.length.should.be.eql(1);
                    done();
                });
        });
    })

    describe('TC-205', () => {
        describe('TC-205-1 Verplicht veld ontbreekt', () => {
            beforeEach((done) => {
                console.log("beforeEach called");
                dbconnection.getConnection(function (err, connection) {
                    if (err) throw err; // not connected!
                    connection.query(
                        CLEAR_DB + INSERT_USER,
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

            it('Should require FirstName.', (done) => {
                chai.request(server)
                    .put('/api/user/2')
                    .set("authorization", "Bearer " + jwt.sign({userId: 2}, jwtSecretKey))
                    .send({
                        //FirstName ontbreekt
                        "lastName": "Doe",
                        "isActive": false,
                        "emailAdress": "j.doe@server.com",
                        "password": "secret",
                        "phoneNumber": "06 12425475",
                        "roles": "editor,guest",
                        "street": "",
                        "city": ""
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals('FirstName must be string');
                        done();
                    });
            });

            it('Should require LastName.', (done) => {
                chai.request(server)
                    .put('/api/user/2')
                    .set("authorization", "Bearer " + jwt.sign({userId: 2}, jwtSecretKey))
                    .send({
                        "firstName": "John",
                        //lastName ontbreekt
                        "isActive": false,
                        "emailAdress": "j.doe@server.com",
                        "password": "secret",
                        "phoneNumber": "06 12425475",
                        "roles": "editor,guest",
                        "street": "",
                        "city": ""
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals('LastName must be string');
                        done();
                    });
            });

            it('Should require isActive.', (done) => {
                chai.request(server)
                    .put('/api/user/2')
                    .set("authorization", "Bearer " + jwt.sign({userId: 2}, jwtSecretKey))
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        //isActive ontbreekt
                        "emailAdress": "j.doe@server.com",
                        "password": "secret",
                        "phoneNumber": "06 12425475",
                        "roles": "editor,guest",
                        "street": "",
                        "city": ""
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals('isActive must be boolean');
                        done();
                    });
            });

            it('Should require emailAdress.', (done) => {
                chai.request(server)
                    .put('/api/user/2')
                    .set("authorization", "Bearer " + jwt.sign({userId: 2}, jwtSecretKey))
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        "isActive": false,
                        //emailAdress ontbreekt
                        "password": "secret",
                        "phoneNumber": "06 12425475",
                        "roles": "editor,guest",
                        "street": "",
                        "city": ""
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals('EmailAdress must be string');
                        done();
                    });
            });

            it('Should require password.', (done) => {
                chai.request(server)
                    .put('/api/user/2')
                    .set("authorization", "Bearer " + jwt.sign({userId: 2}, jwtSecretKey))
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        "isActive": false,
                        "emailAdress": "j.doe@server.com",
                        //password ontbreekt
                        "phoneNumber": "06 12425475",
                        "roles": "editor,guest",
                        "street": "",
                        "city": ""
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals('Password must be string');
                        done();
                    });
            });
        })

        describe('TC-205-3 Niet-valide telefoonnummer', () => {
            beforeEach((done) => {
                console.log("beforeEach called");
                dbconnection.getConnection(function (err, connection) {
                    if (err) throw err; // not connected!
                    connection.query(
                        CLEAR_DB + INSERT_USER,
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

            it('Invalid phone number.', (done) => {
                chai.request(server)
                    .put('/api/user/2')
                    .set("authorization", "Bearer " + jwt.sign({userId: 2}, jwtSecretKey))
                    .send({
                        "firstname": "john",
                        "lastName": "Doe",
                        "isActive": false,
                        "emailAdress": "j.doe@server.com",
                        "password": "secret",
                        "phoneNumber": "InvalidPhoneNumber",
                        "roles": "editor,guest",
                        "street": "",
                        "city": ""
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, result} = res.body
                        statusCode.should.equal(400);
                        result.should.be.a('string').that.equals('FirstName must be string');
                        done();
                    });
            });
        })

        describe('TC-205-4 Gebruiker bestaat niet', () => {
            it('Should update user successfull.', (done) => {
                chai.request(server)
                    .put('/api/user/1000')
                    .set("authorization", "Bearer " + jwt.sign({userId: 2}, jwtSecretKey))
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        "isActive": false,
                        "emailAdress": "j.doe@server.com",
                        "password": "secret",
                        "phoneNumber": "06 12425475",
                        "roles": "editor,guest",
                        "street": "",
                        "city": ""
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, error} = res.body
                        statusCode.should.equal(404);
                        error.should.be.a('string').that.equals('Geen gebruiker gevonden voor ingevoerde id');
                        done();
                    });
            });
        })

        describe('TC-205-5 Niet ingelogd', () => {
            it('Should update user successfull.', (done) => {
                chai.request(server)
                    .put('/api/user/2')
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        "isActive": false,
                        "emailAdress": "j.doe@server.com",
                        "password": "secret",
                        "phoneNumber": "06 12425475",
                        "roles": "editor,guest",
                        "street": "",
                        "city": ""
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {error, datetime} = res.body
                        res.should.have.status(401);
                        error.should.be.a('string').that.equals('Authorization header missing!');
                        done();
                    });
            });
        })

        describe('TC-205-6 Gebruiker succesvol gewijzigd', () => {
            it('Should update user successfull.', (done) => {
                chai.request(server)
                    .put('/api/user/2')
                    .set("authorization", "Bearer " + jwt.sign({userId: 2}, jwtSecretKey))
                    .send({
                        "firstName": "John",
                        "lastName": "Doe",
                        "isActive": false,
                        "emailAdress": "j.doe@server.com",
                        "password": "secret",
                        "phoneNumber": "06 12425475",
                        "roles": "editor,guest",
                        "street": "",
                        "city": ""
                    })
                    .end((err, res) => {
                        res.should.be.an('object');
                        let {statusCode, results} = res.body
                        statusCode.should.equal(200);
                        results.should.be.a('string').that.equals('User John Doe has been updated!');
                        done();
                    });
            });
        })
    })

    describe('TC-206', () => {
        beforeEach((done) => {
            console.log("beforeEach called");
            dbconnection.getConnection(function (err, connection) {
                if (err) throw err; // not connected!
                connection.query(
                    CLEAR_DB + INSERT_USER,
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

        it('TC-206-1 Gebruiker bestaat niet', (done) => {
            chai.request(server)
                .delete('/api/user/1000')
                .set("authorization", "Bearer " + jwt.sign({userId: 1000}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an('object');
                    let {statusCode, error} = res.body;
                    statusCode.should.equal(400);
                    error.should.be.a('string').that.equals('No row found');
                    done();
                })
        });

        it("TC-206-2 Niet ingelogd", (done) => {
            chai
                .request(server)
                .delete('/api/user/2')
                .end((err, res) => {
                    res.should.be.an("object");
                    let {error, datetime} = res.body;
                    res.should.have.status(401);
                    error.should.be.a("string").that.equals('Authorization header missing!');
                    done();
                });
        });

        it("TC-206-3  Actor is geen eigenaar", (done) => {
            chai
                .request(server)
                .delete(`/api/user/2`)
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an("object");
                    let {statusCode, results} = res.body;
                    res.should.have.status(403);
                    results.should.be.a("string").that.equals(`Not authorized to delete the user.`);
                    done();
                });
        });

        it('TC-206-4 Gebruiker succesvol verwijderd', (done) => {
            chai.request(server)
                .delete('/api/user/1')
                .set("authorization", "Bearer " + jwt.sign({userId: 1}, jwtSecretKey))
                .end((err, res) => {
                    res.should.be.an('object');
                    let {statusCode, results} = res.body;
                    statusCode.should.equal(200);
                    results.should.be.a('string').that.equals('user successfully deleted!');
                    done();
                })
        })
    })
})


