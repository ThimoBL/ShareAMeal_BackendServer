const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../Index');
const database = require("../../Database/InMemDb");

chai.should();
chai.use(chaiHttp);

describe('Manage users', () => {
    describe('TC 201 - Should require all required fields', () => {
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
                    statusCode.should.equal(404);
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
                    statusCode.should.equal(404);
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
                    statusCode.should.equal(404);
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
                    statusCode.should.equal(404);
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
                    statusCode.should.equal(404);
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
                    statusCode.should.equal(404);
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
                    statusCode.should.equal(404);
                    result.should.be.a('string').that.equals(`EmailAdress is invalid and must contain '.' after '@'`);
                    done();
                });
        });
    })
})