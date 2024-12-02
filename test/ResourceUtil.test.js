const { describe, it, before, after } = require('mocha');
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs').promises;
const { app, server } = require('../index');

chai.use(chaiHttp);

describe('Create Account Tests', () => {
    let baseUrl;

    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address == '::' ? 'localhost' : address}:${port}`;
        await fs.writeFile('utils/accounts.json', '[]', 'utf8');
    });

    after(() => {
        return new Promise((resolve) => {
            server.close(() => resolve());
        });
    });

    it('should create an account successfully with proper inputs', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'user123',
                password: 'password123',
                confirmpassword: 'password123',
                email: 'test123user@gmail.com',
            })
            .end((err, res) => {
                expect(res).to.have.status(201);
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.equal(1);
                done();
            });
    });

    it('should fail with mismatched passwords', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'MismatchUser',
                password: 'SecurePassword123',
                confirmpassword: 'MismatchPassword123',
                email: 'mismatchuser@example.com',
            })
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.message).to.equal('Passwords do not match');
                done();
            });
    });

    it('should fail with a short password', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'ShortPasswordUser',
                password: '123',
                confirmpassword: '123',
                email: 'shortpassword@example.com',
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body.message).to.equal('Validation error');
                done();
            });
    });

    it('should fail with an invalid email format', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'InvalidEmailUser',
                password: 'SecurePassword123',
                confirmpassword: 'SecurePassword123',
                email: 'invalid-email',
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body.message).to.equal('Validation error');
                done();
            });
    });

    it('should fail with missing fields', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: '',
                password: '',
                confirmpassword: '',
                email: '',
            })
            .end((err, res) => {
                expect(res).to.have.status(400);  // Expecting 400 for missing fields
                expect(res.body.message).to.equal('All fields are required');  // Adjusted error message
                done();
            });
    });
    

    it('should fail with missing password', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'NoPasswordUser',
                password: '',
                confirmpassword: '',
                email: 'nopassword@example.com',
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body.message).to.equal('Validation error');
                done();
            });
    });

    it('should fail with missing email', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'ValidUser',
                password: 'SecurePassword123',
                confirmpassword: 'SecurePassword123',
                email: '',  
            })
            .end((err, res) => {
                expect(res).to.have.status(500);
                expect(res.body.message).to.equal('Validation error');
                done();
            });
    });

    it('should fail with missing username', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: '', 
                password: 'SecurePassword123',
                confirmpassword: 'SecurePassword123',
                email: 'missingusername@example.com',
            })
            .end((err, res) => {
                expect(res).to.have.status(500);  
                expect(res.body.message).to.equal('Username is required'); 
                done();
            });
    });

    it('should fail with invalid username (too short)', (done) => {
        chai.request(baseUrl)
            .post('/create-account')
            .send({
                username: 'u',  
                password: 'password123',
                confirmpassword: 'password123',
                email: 'validemail@example.com',
            })
            .end((err, res) => {
                expect(res).to.have.status(400); 
                expect(res.body.message).to.equal('Username must be at least 3 characters long');
                done();
            });
    });
    
});
