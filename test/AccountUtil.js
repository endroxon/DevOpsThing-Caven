const { describe, it } = require('mocha');
const { expect } = require('chai');

const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let baseUrl;

describe('Resource API', () => {

    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address == '::' ? 'localhost' : address}:${port}`;
    });
    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    let count = 0;
    let resourceId;

    
    describe('GET /view-accounts', () => {
        it('should return all accounts', (done) => {
            chai.request(baseUrl)
                .get('/view-accounts')
                .end((err, res) => {
                    count = res.body.length;
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('POST /create-account', () => {
        it('should return 400 for validation errors', (done) => {
            chai.request(baseUrl)
                .post('/create-account')
                .send({
                    username: 'cavencavencavven',
                    password: 'password12345',
                    confirmpassword: 'password12345',
                    email: 'cavenhotmail.com'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Invalid email format');
                    done();
                });
        });

        it('should add a new account', (done) => {
            chai.request(baseUrl)
                .post('/create-account')
                .send({
                    username: 'cavencavencaven',
                    password: 'password123',
                    confirmpassword: 'password123',
                    email: 'caven@gmail.com'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.greaterThan(0);
                    done();
                });
        });
    });
    it('should show error message when passwords does not match', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'tommy1235',
                password: 'password123',
                confirmpassword: 'password478',
                email: 'tommy1231@gmail.com',
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('Passwords do not match');
                done();
            });
    });

    describe('POST /create-account', () => {
        it('should show error message when password is too short', (done) => {
            chai.request(baseUrl)
                .post('/create-account')
                .send({
                    username: 'johnny12312',
                    password: '11',
                    confirmpassword: '11',
                    email: 'john2312@gmail.com',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Password must be at least 6 characters long');
                    done();
                });
        });
        it('should fail when email does not contain an @', (done) => {
            chai.request(baseUrl)
                .post('/create-account')
                .send({
                    username: 'dwadada',
                    password: 'password12335',
                    confirmpassword: 'password12335',
                    email: 'dwadadagmail.com',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Invalid email format');
                    done();
                });
        });

        it('should show error message when form fields are missing', (done) => {
            chai.request(baseUrl)
                .post('/create-account')
                .send({
                    username: '',
                    password: '',
                    confirmpassword: '',
                    email: '',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('All fields are required');
                    done();
                });
        });

        it('should show error message when password input is missing', (done) => {
            chai.request(baseUrl)
                .post('/create-account')
                .send({
                    username: 'johnnty123',
                    password: '',
                    confirmpassword: '',
                    email: 'johnnty@gmail.com',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('All fields are required');
                    done();
                });
        });

        it('should show error when email input is missing', (done) => {
            chai.request(baseUrl)
                .post('/create-account')
                .send({
                    username: 'johhny7881',
                    password: 'password12345',
                    confirmpassword: 'password12345',
                    email: '',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('All fields are required');
                    done();
                });
        });

        it('should show error when username input is missing', (done) => {
            chai.request(baseUrl)
                .post('/create-account')
                .send({
                    username: '',
                    password: 'password12345',
                    confirmpassword: 'password123456',
                    email: 'testinguser12345@gmail.com',
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('All fields are required');
                    done();
                });
        });
    });

    it('should show error when username is too short', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'c',
                password: 'password123',
                confirmpassword: 'password123',
                email: 'caven@gmail.com',
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('Username must be at least 3 characters long');
                done();
            });

    });
});
