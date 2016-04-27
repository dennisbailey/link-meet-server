var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../src/server/app');

var should = chai.should();

chai.use(chaiHttp);

describe('Meetup API routes', function() {

  describe('Get All Categories', function() {

      it('should get all of the Meetup categories', function(done) {
          chai.request(server)
          .get('/api/meetup')
          .end(function(err, res) {
              // Check response type
              res.type.should.equal('application/json');
              
              // Check status code and status message
              res.status.should.equal(200);
              res.body.status.should.equal('success');
              
              // Check data type and length
              res.body.data.should.be.a('array');
              res.body.data.length.should.equal(33);
              
              // Check data property names
              res.body.data[0].should.have.property('name');
              res.body.data[0].should.have.property('sort_name');
              res.body.data[0].should.have.property('id');
              res.body.data[0].should.have.property('shortname');
              
              // Check data property values
              res.body.data[0].name.should.equal('Arts & Culture');
              res.body.data[0].sort_name.should.equal('Arts & Culture');
              res.body.data[0].id.should.equal(1);
              res.body.data[0].shortname.should.equal('Arts');               
              
              done();
          
          });
      
      });

  });


  describe('Get Groups for a Category', function() {

      it('should get a list of Meetup groups for a category', function(done) {
          chai.request(server)
          .get('/api/meetup/2/groups')
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

  });
  
  
  describe('Get Meetups for a Group', function() {

      it('should get a list of meetups for a given group', function(done) {
          chai.request(server)
          .get('/api/meetup/groups/womenwhostartupcolorado')
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

  });
  
  
  describe('Get RSVPs for a Meetup', function() {

      it('should get a list of RSVPs for a given meetup', function(done) {
          chai.request(server)
          .get('/api/meetup/groups/womenwhostartupcolorado/events/qlmkplyvgbjc')
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
