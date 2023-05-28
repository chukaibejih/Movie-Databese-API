const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const User = require('../models/User');

const assert = chai.assert;
chai.use(chaiHttp);

describe('User Registration', () => {

  it('should register a new user', (done) => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      age: 25,
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(newUser)
      .end((err, res) => {
        assert.equal(res.status, 201);
        assert.equal(res.body.message);
        assert.exists(res.body.user);
        assert.exists(res.body.user._id);
        assert.equal(res.body.user.name, newUser.name);
        assert.equal(res.body.user.email, newUser.email);
        assert.equal(res.body.user.age, newUser.age);
        assert.exists(res.body.user.createdAt);
        done();
      });
  });

  it('should return an error if required fields are missing', (done) => {
    const newUser = {
      name: 'John Doe',
      password: 'password123',
      age: 25,
    };

    chai
      .request(app)
      .post('/api/users/register')
      .send(newUser)
      .end((err, res) => {
        assert.equal(res.status, 400);
        assert.exists(res.body.error);
        done();
      });
  });
});

describe('Login', () => {

  it('should login a user', (done) => {
    const loginUser = {
      email: 'asake2@gmail.com',
      password: '2000money',
    };

    chai
      .request(app)
      .post('/api/users/login')
      .send(loginUser)
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.message, 'Logged in');
        assert.exists(res.body.accessToken);
        done();
      });
  });
});
