const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const assert = chai.assert;

chai.use(chaiHttp);

describe('Get Movies', () => {
  it('should get a list of all the movies in the database', (done) => {
    chai
      .request(app)
      .get('/api/movies')
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body); 
        done();
      });
  });
});
