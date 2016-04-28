process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app');
var should = chai.should();

var Users = require('../src/server/models/users')
var testUtilities = require('./utilities');
var testSeed = require('../src/server/models/seeds/user-seed');

chai.use(chaiHttp);


describe('User Action Routes', function() {
  
  before(function(done) {
    // drop db
    testUtilities.dropDatabase();
    testSeed.runSeed(done);
  });

  after(function(done) {
    // drop db
    testUtilities.dropDatabase(done);
  });
  
  var userID = '';
  var token = '';

  describe('User Save Actions', function() {
    
    it('should create a new user', function(done) {
      
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
    
    
    it('should login a user', function(done) {
      
      chai.request(server)
      
      .post('/auth/login')
      
      .send({
        email: 'michael@herman.com',
        password: 'test'
      })
      
      .end(function(err, res) {
        // Check the response code and type
        
        userID = res.body.data.user._id;
        token = res.body.data.token;
        
        res.status.should.equal(200);
        
        done();
        
      });
    
    });
    
    it('should allow a user to save a group', function(done) {
      
      chai.request(server)
      
      .put('/user/'+ userID +'/group')
      
      .send({
        name: 'Test Group',
        url: 'https://www.test.com/',
        photoUrl: 'https:/test.com/photo.jpg'
      })
      
      .set('authorization', token )
      
      .end(function(err, res) {
        
        // Check the response code and type
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        
        // Check data type
        res.body.should.be.a('object')
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.data.should.have.property('groups');
        res.body.data.groups[0].should.have.property('name');
        res.body.data.groups[0].should.have.property('url');
        res.body.data.groups[0].should.have.property('photoUrl');
        
        // Check data property values
        res.body.status.should.equal('success');
        res.body.data.groups[0].name.should.equal('Test Group');
        res.body.data.groups[0].url.should.equal('https://www.test.com/');
        res.body.data.groups[0].photoUrl.should.equal('https:/test.com/photo.jpg');
        
        done();
        
      });
    
    });
    
       
    it('should allow a user to save a person', function(done) {
      
      chai.request(server)
      
      .put('/user/'+ userID +'/people')
      
      .send({
        name: 'Test Person',
        notes: 'This is a note…'
      })
      
      .set('authorization', token )
      
      .end(function(err, res) {
        
        // Check the response code and type
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        
        // Check data type
        res.body.should.be.a('object')
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.data.should.have.property('people');
        res.body.data.people[0].should.have.property('name');
        res.body.data.people[0].should.have.property('notes');
        
        // Check data property values
        res.body.status.should.equal('success');
        res.body.data.people[0].name.should.equal('Test Person');
        res.body.data.people[0].notes.should.equal('This is a note…');
        
        done();
        
      });
    
    });
    
    
    it('it should get all of a user\'s saved data', function(done) {
      
      chai.request(server)
      
      .get('/user/'+ userID )
            
      .set('authorization', token )
      
      .end(function(err, res) {
        
        // Check the response code and type
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        
        // Check data type
        res.body.should.be.a('object')
        res.body.should.have.property('status');
        res.body.should.have.property('data');
        res.body.data.should.have.property('groups');
        res.body.data.groups[0].should.have.property('name');
        res.body.data.groups[0].should.have.property('url');
        res.body.data.groups[0].should.have.property('photoUrl');
        res.body.data.should.have.property('people');
        res.body.data.people[0].should.have.property('name');
        res.body.data.people[0].should.have.property('notes');
        
        // Check data property values
        res.body.status.should.equal('success');
        res.body.data.groups[0].name.should.equal('Test Group');
        res.body.data.groups[0].url.should.equal('https://www.test.com/');
        res.body.data.groups[0].photoUrl.should.equal('https:/test.com/photo.jpg');
        res.body.data.people[0].name.should.equal('Test Person');
        res.body.data.people[0].notes.should.equal('This is a note…');
        
        done();
        
      });
    
    });
    
    
    it('it should delete a user', function(done) {
      
      chai.request(server)
      
      .delete('/user/'+ userID + '/delete' )
            
      .set('authorization', token )
      
      .end(function(err, res) {
        
        // Check the response code and type
        res.status.should.equal(200);
        res.type.should.equal('application/json');
        
        // Check data type
        res.body.should.be.a('object')
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        
        // Check data property values
        res.body.status.should.equal('success');
        res.body.message.should.equal('You have sent this user to the meet their ancestors.');
        
        done();
        
      });
    
    });
        
  });

});