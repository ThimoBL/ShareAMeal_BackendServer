const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../Index');
const database = require("../../Database/dbconnection");

chai.should();
chai.use(chaiHttp);

describe('TC Manage users', () => {
    describe('TC 201 - 1 Verplicht veld ontbreekt', () => {
        it('Should require FirstName.', (done) => {
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

    describe('TC 201 - 4 Gebruiker bestaat al', () => {
        it('Should have a unique EmailAdress', (done) => {
            chai.request(server)
                .post('/api/user')
                .send({
                    "firstName": "John",
                    "lastName": "Doe",
                    "isActive": true,
                    "emailAdress": "j.doe@server.com",
                    "password": "secret",
                    "phoneNumber": "06 12425475",
                    "roles": "editor,guest"
                })
                .end((err, res) => {
                    res.should.be.an('object');
                    let {statusCode, error} = res.body;
                    statusCode.should.equal(409);
                    error.should.be.a('string').that.equals("A user already exists with that Email.");
                    done();
                })
        })
    })

    describe('TC 201 - 5 Gebruiker succesvol geregistreerd', () => {
        it('Should add user successfully', (done) => {
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
        })
    })

    describe('TC-204 - 2 Gebruiker-ID bestaat niet', () => {
        it('Should user id not exist in database', (done) => {
            chai.request(server)
                .get('/api/user/1000')
                .end((err, res) => {
                    res.should.be.an('object');
                    let {statusCode, error} = res.body;
                    statusCode.should.equal(404);
                    error.should.be.a('string').that.equals("Geen gebruiker gevonden voor ingevoerde id");
                    done();
                })
        })
    })

    describe('TC-204 - 3 Gebruiker-ID bestaat', () => {
        it('Should user id exist in database', (done) => {
            chai.request(server)
                .get('/api/user/1')
                .end((err, res) => {
                    res.should.be.an('object');
                    let {statusCode, results} = res.body;
                    statusCode.should.equal(200);
                    results.should.be.a('array');
                    done();
                })
        })
    })

    describe('TC-205-1 Verplicht veld ontbreekt', () => {
        it('Should require FirstName.', (done) => {
            chai.request(server)
                .put('/api/user/2')
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

    describe('TC-205-4 Gebruiker bestaat niet', () => {
        it('Should update user successfull.', (done) => {
            chai.request(server)
                .put('/api/user/1000')
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

    describe('TC-205-6 Gebruiker succesvol gewijzigd', () => {
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
                    let {statusCode, results} = res.body
                    statusCode.should.equal(200);
                    results.should.be.a('string').that.equals('User John Doe has been updated!');
                    done();
                });
        });
    })

    describe('TC-206-1 Gebruiker bestaat niet', () => {
        it('Should user id not exist in database', (done) => {
            chai.request(server)
                .delete('/api/user/1000')
                .end((err, res) => {
                    res.should.be.an('object');
                    let {statusCode, error} = res.body;
                    statusCode.should.equal(400);
                    error.should.be.a('string').that.equals('No row found');
                    done();
                })
        })
    })

    describe('TC-206-4 Gebruiker succesvol verwijderd', () => {
        it('Should user id exist in database', (done) => {
            chai.request(server)
                .delete('/api/user/1')
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