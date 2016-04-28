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
    
    it('should prevent users that are not logged in from accessing categories', function(done) {
      
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
    
    it('should not allow a user that is not logged in to access groups', function(done) {
      
      chai.request(server)
      
      .get('/api/meetup/2/groups')
      
      .set('authorization', token )
      
      .end(function(err, res) {

        // Check the response code and type
        res.status.should.equal(400);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        
        
        done();
      
      });
    
    });

    it('should not allow a user that is not logged in to access meetups', function(done) {
      
      chai.request(server)
      
      .get('/api/meetup/groups/womenwhostartupcolorado')
      
      .set('authorization', token )
      
      .end(function(err, res) {

        // Check the response code and type
        res.status.should.equal(400);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');        
        
        done();
      
      });
    
    });

    it('should not allow a user that is not logged in to access RSVPs', function(done) {
      
      chai.request(server)
      
      .get('/api/meetup/groups/womenwhostartupcolorado')
      
      .set('authorization', token )
      
      .end(function(err, res) {

        // Check the response code and type
        res.status.should.equal(400);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
            
        done();
      
      });
    
    });

// Create and login a user to test authorization
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
        
    it('should allow a logged in user to access categories', function(done) {
      
      chai.request(server)
      
      .get('/api/meetup')
      
      .set('authorization', token )
      
      .end(function(err, res) {

        // Check the response code and type
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        res.body.should.be.a('object');
        
        // Check data type and length
        res.body.data.should.be.a('array');
        res.body.data.length.should.equal(33);
        
        // Check data property names
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.data[0].should.have.property('name');
        res.body.data[0].should.have.property('sort_name');
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('shortname');
        
        // Check data property values
        res.body.status.should.equal('success')
        res.body.data[0].name.should.equal('Arts & Culture');
        res.body.data[0].sort_name.should.equal('Arts & Culture');
        res.body.data[0].id.should.equal(1);
        res.body.data[0].shortname.should.equal('Arts');
        
        done();
      
      });
    
    });
    
    it('should allow a logged in user to access groups', function(done) {
      
      chai.request(server)
      
      .get('/api/meetup/2/groups')
      
      .set('authorization', token )
      
      .end(function(err, res) {

        // Check response type
        res.type.should.equal('application/json');
        
        // Check status code and status message
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        
        // Check data type and length
        res.body.data.should.be.a('array');
        res.body.data.length.should.equal(20);
        
        // Check data property names
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('name');
        res.body.data[0].should.have.property('urlname');
        res.body.data[0].should.have.property('city');
        res.body.data[0].should.have.property('state');
                      
        // Check data property values
        // The Meetup API geolocates your API request. This test will fail if the IP is not in Denver, CO
        res.body.data[0].id.should.equal(1189940);
        res.body.data[0].name.should.equal('Denver Founders');
        res.body.data[0].urlname.should.equal('Denver-Founders-Network');
        res.body.data[0].city.should.equal('Denver');
        res.body.data[0].state.should.equal('CO'); 
        
        
        done();
      
      });
    
    });

    it('should allow a logged in user to access meetups', function(done) {
      
      chai.request(server)
      
      .get('/api/meetup/groups/womenwhostartupcolorado')
      
      .set('authorization', token )
      
      .end(function(err, res) {

        // Check response type
        res.type.should.equal('application/json');
        
        // Check status code and status message
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        
        // Check data type              
        res.body.data.should.be.a('array');
        
        // Check data property names
        res.body.data[0].should.have.property('id');
        res.body.data[0].should.have.property('name');
        res.body.data[0].should.have.property('yes_rsvp_count');
        res.body.data[0].should.have.property('group');
        res.body.data[0].group.should.have.property('name');
                      
        // Check data property values
        // The Meetup API geolocates your API request. This test will fail if the IP is not in Denver, CO
        // This test will also fail as the date changes
        res.body.data[0].id.should.equal('rpscmlyvjbcc');
        res.body.data[0].name.should.equal('Basecamp Denver, Women Who Startup Monthly Event');
        res.body.data[0].group.name.should.equal('Women Who Startup');
        
        done();

      
      });
    
    });

    it('should allow a logged in user to access RSVPs', function(done) {
      
      chai.request(server)
      
      .get('/api/meetup/groups/womenwhostartupcolorado/events/qlmkplyvgbjc')
      
      .set('authorization', token )
      
      .end(function(err, res) {

        // Check response type
        res.type.should.equal('application/json');
        
        // Check status code and status message
        res.status.should.equal(200);
        res.body.status.should.equal('success');
        
        // Check data type              
        res.body.data.should.be.a('array');
        
        // Check data property names
        res.body.data[0].should.have.property('name');
        res.body.data[0].should.have.property('photo');
                      
        // Check data property values
        // This test could fail as the RSVPs change
        res.body.data[0].name.should.equal('Aiko C.');
        res.body.data[0].id.should.equal(14176278);
        
        done();      
      });
    
    });


  });

});