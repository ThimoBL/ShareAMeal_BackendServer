const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../Index');
const database = require("../../Database/dbconnection");
const dbconnection = require("../../Database/dbconnection");

chai.should();
chai.use(chaiHttp);

describe('TC Manage login', () => {
    describe('TC 101 - 1 Verplicht veld ontbreekt', () => {
        it('Should require Email.', (done) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({
                    "password": "secret"
                })
                .end((err, res) => {
                    res.should.be.an('object');
                    res.should.have.status(400);
                    let {error, datetime} = res.body
                    error.should.be.a('string').that.equals('AssertionError [ERR_ASSERTION]: email must be a string.');
                    done();
                });
        });
        it('Should require Password.', (done) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({
                    "emailAdress": "j.doe@server.com"
                })
                .end((err, res) => {
                    res.should.be.an('object');
                    res.should.have.status(400);
                    let {error, datetime} = res.body
                    error.should.be.a('string').that.equals('AssertionError [ERR_ASSERTION]: password must be a string.');
                    done();
                });
        });
    })
    describe('TC 101 - 2 Niet-valide email adres', () => {
        it('Should require valid Email.', (done) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({
                    "emailAdress": "j.doeserver.com",
                    "password": "secret"
                })
                .end((err, res) => {
                    res.should.be.an('object');
                    res.should.have.status(400);
                    let {message, datetime} = res.body
                    message.should.be.a('string').that.equals('Email or password invalid');
                    done();
                });
        });
    })
    describe('TC 101 - 3 Niet-valide wachtwoord', () => {
        it('Should require valid password.', (done) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({
                    "emailAdress": "j.doe@server.com",
                    "password": "notsecret"
                })
                .end((err, res) => {
                    res.should.be.an('object');
                    res.should.have.status(400);
                    let {message, datetime} = res.body
                    message.should.be.a('string').that.equals('Password is invalid');
                    done();
                });
        });
    })
    describe('TC 101 - 4 Gebruiker bestaat niet', () => {
        it('Should exist in database.', (done) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({
                    "emailAdress": "nonExistantUser@server.com",
                    "password": "secret"
                })
                .end((err, res) => {
                    res.should.be.an('object');
                    res.should.have.status(404);
                    let {message, datetime} = res.body
                    message.should.be.a('string').that.equals('User not found');
                    done();
                });
        });
    })
    describe('TC 101 - 5 Gebruiker succesvol ingelogd', () => {
        it('Should exist in database.', (done) => {
            chai.request(server)
                .post('/api/auth/login')
                .send({
                    "emailAdress": "j.doe@server.com",
                    "password": "secret"
                })
                .end((err, res) => {
                    res.should.be.an('object');
                    res.should.have.status(200);
                    let {statusCode, results} = res.body
                    results.emailAdress.should.be.a('string').that.equals('j.doe@server.com');
                    done();
                });
        });
    })
})