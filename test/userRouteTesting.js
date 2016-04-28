process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app');
var should = chai.should();

var Users = require('../src/server/models/users')
var testUtilities = require('./utilities');
var testSeed = require('../src/server/models/seeds/user-seed');

chai.use(chaiHttp);

var token = '';

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

  describe('Route Protection', function() {
    
    it('should prevent users that are not logged in from accessing protected routes', function(done) {
      
      chai.request(server)
      
      .get('/api/meetup')
      
      .end(function(err, res) {
        
        // Check the response code and type
        res.status.should.equal(400);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        
        // Check the keys in the response
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        
        
        // Check the response values
        res.body.status.should.equal('Failure');
        res.body.message.should.equal('No header present or no authorization header.');
        
               
      done();
      
      });
    
    });
    

    it('Create a new user', function(done) {
      
      chai.request(server)
      
      .post('/auth/register')
      
      .send({ email: 'michael@herman.com',
              username: 'Miguel',
              password: 'test'
      })
      
      .end(function(err, res) {
        // Check the response code and type
        res.status.should.equal(200);
               
      done();
      
      });
    
    });
    

    it('Login a user', function(done) {
      
      chai.request(server)
      
      .post('/auth/login')
      
      .send({
        email: 'michael@herman.com',
        password: 'test'
      })
      
      .end(function(err, res) {
        
        // Save the token
        token = res.body.data.token;
        
        // Check the response code and type
        res.status.should.equal(200);
        
        done();
        
      });
    
    });
    
    
    it('should allow a logged in user to access protected routes', function(done) {
      
      chai.request(server)
      
      .get('/api/meetup')
      
      .set('authorization', token )
      
      .end(function(err, res) {
        // Check the response code and type
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        
        // Check the keys in the response
//         res.body.should.have.property('status');
//         res.body.should.have.property('message');
//         
//         // Check the response values
//         res.body.status.should.equal('fail');
//         res.body.message.should.equal('Email does not exist');
        
        done();
      });
    });
    
  });

});