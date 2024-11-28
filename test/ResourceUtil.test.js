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
});

let count = 0;
let resourceId; // Variable to store the ID of the resource
// Test Suite for viewing resources
describe('GET /view-accounts', () => {
    it('should return all resources', (done) => {
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
// Test Suite for adding resources
describe('POST /create-account', () => {
    it('should return 500 for validation errors', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'Test Resource', password: 'Test Location', confirmpassword:
                    'Short', email: 'invalid-email'
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body.message).to.equal('Validation error');
                done();
            });
    });
    it('should add a new resource', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'Test Resource', password: 'Test Location', confirmpassword:
                    'A short description', email: 'test@example.com'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.equal(count + 1);
                resourceId = res.body[res.body.length - 1].id; // Store the ID of
                done();
            });
    });
});
// Test Suite for editing resources
describe('PUT /update-account/:id', () => {
    it('should update an existing resource', (done) => {
        chai.request(baseUrl)
            .put(`/update-account/${resourceId}`)
            .send({
                username: 'Updated Resource', password: 'Updated password',
                confirmpassword: 'Updated password'
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.message).to.equal('Resource modified successfully!');
                done();
            });
    });
});
// Test Suite for deleting resources
describe('DELETE /delete-account/:id', () => {
    it('should delete an existing resource', (done) => {
        chai.request(baseUrl)
            .delete(`/delete-account/${resourceId}`)
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body.message).to.equal('Resource deleted successfully!');
                done();
            });
    });
});
