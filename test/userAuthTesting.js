process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app');
var should = chai.should();

var Users = require('../src/server/models/users')
var testUtilities = require('./utilities');
var testSeed = require('../src/server/models/seeds/user-seed');

chai.use(chaiHttp);


describe('Auth Routes', function() {
  
  before(function(done) {
    // drop db
    testUtilities.dropDatabase();
    testSeed.runSeed(done);
  });

  after(function(done) {
    // drop db
    testUtilities.dropDatabase(done);
  });

  describe('/POST auth/register', function() {
    
    it('should create a new user', function(done) {
      
      chai.request(server)
      
      .post('/auth/register')
      
      .send({ email: 'michael@herman.com',
              username: 'Miguel',
              password: 'test'
      })
      
      .end(function(err, res) {
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        
        res.body.should.have.property('status');
        res.body.status.should.equal('success');
        
        res.body.should.have.property('data');
        res.body.data.should.be.a('object');
        
        res.body.data.should.have.property('token');
        res.body.data.token.should.be.a('string');
        
        res.body.data.should.have.property('user');
        res.body.data.user.should.be.a('object');
        
      done();
      
      });
    
    });
    
    it('should prevent an existing user from registering a second time', function(done) {
      
      chai.request(server)
      
      .post('/auth/register')
      
      .send({ email: 'michael@herman.com',
              username: 'Miguel',
              password: 'test'
      })
      
      .end(function(err, res) {
        res.status.should.equal(409);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        res.body.status.should.equal('fail');
        res.body.message.should.equal('Email already exists');
        
      done();
      
      });
    
    });
    
    
  it('should login a user', function(done) {
    chai.request(server)
    .post('/auth/login')
    .send({
      email: 'michael@herman.com',
      password: 'test'
    })
    .end(function(err, res) {
      res.status.should.equal(200);
      res.type.should.equal('application/json');
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.should.have.property('data');
      
      res.body.status.should.equal('success');
      
      res.body.data.should.be.a('object');
      res.body.data.token.should.be.a('string');
      res.body.data.user.email.should.equal('michael@herman.com');
      done();
    });
  });
  
  it('should not login an unknown user', function(done) {
    chai.request(server)
    .post('/auth/login')
    .send({
      email: 'michael2@herman.com',
      password: 'test'
    })
    .end(function(err, res) {
      res.status.should.equal(401);
      res.type.should.equal('application/json');
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.should.have.property('message');
      
      res.body.status.should.equal('fail');
      res.body.message.should.equal('Email does not exist');
      
      done();
    });
  });
  
  it('should not login a user with a bad passwordr', function(done) {
    chai.request(server)
    .post('/auth/login')
    .send({
      email: 'michael@herman.com',
      password: 'test2'
    })
    .end(function(err, res) {
      res.status.should.equal(401);
      res.type.should.equal('application/json');
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.should.have.property('message');
      
      res.body.status.should.equal('fail');
      res.body.message.should.equal('Password is not correct');
      
      done();
    });
  });
  
});

});