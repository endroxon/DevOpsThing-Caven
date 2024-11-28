const { describe, it } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index1');
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
    describe('POST /add-movie', () => {
        it('should return 500 for validation errors', (done) => {
            chai.request(baseUrl)
                .post('/add-movie')
                .send({
                    movie: 'Test Resource', location: 'Test Location', description:
                        'Shortieeee', owner: 'invalid-email'
                })
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body.message).to.equal('Validation error');
                    done();
                });
        });

        it('blank test', (done) => {
            chai.request(baseUrl)
                .post('/add-movie')
                .send({
                    movie: '', location: '', description:
                        '', owner: ''
                })
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    expect(res.body.message).to.equal('Validation error');
                    done();
                });
        });

        it('should add a new resource', (done) => {
            chai.request(baseUrl)
                .post('/add-movie')
                .send({
                    movie: 'Test Resource', location: 'Test Location', description:
                        'A short description', owner: 'test@example.com'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(count + 1);
                    resourceId = res.body[res.body.length - 1].id; // Store the ID of the newly added resource
                    done();
                });
        });
    })






});


