const { describe, it } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let baseUrl;
let count = 0;
let accountId; // Variable to store the ID of the created account

describe('Account API', () => {
    // Set up the base URL before tests
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    });

    // Clean up after tests
    after(() => {
        return new Promise((resolve) => {
            server.close(() => {
                resolve();
            });
        });
    });

    // Test suite for viewing accounts
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

    // Test suite for adding accounts
    describe('POST /create-account', () => {
        it('should return 500 for validation errors', (done) => {
            chai.request(baseUrl)
                .post('/create-account')
                .send({
                    username: 'Test User',
                    password: 'short',
                    confirmpassword: 'short',
                    email: 'invalid-email',
                })
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body.message).to.equal('Validation error');
                    done();
                });
        });

        it('should add a new account', (done) => {
            chai.request(baseUrl)
                .post('/create-account')
                .send({
                    username: 'Test User',
                    password: 'securepassword',
                    confirmpassword: 'securepassword',
                    email: 'test@example.com',
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(count + 1);
                    accountId = res.body[res.body.length - 1].id; // Store the ID of the created account
                    done();
                });
        });
    });

    // Test suite for updating accounts
    describe('PUT /update-account/:id', () => {
        it('should update an existing account', (done) => {
            chai.request(baseUrl)
                .put(`/update-account/${accountId}`)
                .send({
                    username: 'Updated User',
                    password: 'updatedpassword',
                    confirmpassword: 'updatedpassword',
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal('Account modified successfully!');
                    done();
                });
        });
    });

    // Test suite for deleting accounts
    describe('DELETE /delete-account/:id', () => {
        it('should delete an existing account', (done) => {
            chai.request(baseUrl)
                .delete(`/delete-account/${accountId}`)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.message).to.equal('Account deleted successfully!');
                    done();
                });
        });
    });
});
