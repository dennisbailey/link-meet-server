var express = require('express');
var router = express.Router();
var http = require('http');
var rp = require('request-promise');

// *** Require Helpers *** //
var authHelpers = require('./helpers/authHelpers')

// Environment variable and base URL
var API_KEY = process.env.API_KEY;
var meetupAPI = 'https://api.meetup.com/';

// Get ALL Meetup categories
router.get('/', function(req, res, next) {
  
  authHelpers.ensureAuthenticated(req, res, next)
  
  .then( function (result) { 
  

    // Query the Meetup API to return all available categories
    rp(meetupAPI + '/2/categories?key=' + API_KEY + '&sign=true&photo-host=public&page=40')
    
    // Return the results and a success message
    .then(function(data){ res.status(200).json({ status: 'success',
                                                 data: JSON.parse(data).results })
    })
    
    .catch(function(error){ return error });
  
   })
   
   .catch( function (error) { return error; })

});

// Get groups with a specific category ID. There are currently 34 categories
router.get('/:id/groups', function(req, res, next) {

  // Query the Meetup API to return the first 20 groups for a given category
	rp(meetupAPI + 'find/groups?key=' + API_KEY + '&sign=true&photo-host=public&category=' + req.params.id + '&page=20')

	.then(function(data){ res.status(200).json({ status: 'success',
                                               data: JSON.parse(data) })
  })

	.catch(function(error){ return error })

});

// Get events for a specific group. The group name is the `urlname` of the group
router.get('/groups/:urlname', function(req, res, next) {

  // Query the Meetup API to return the first 20 events for a given group name
	rp(meetupAPI + req.params.urlname + '/events?key=' + API_KEY + '&sign=true&photo-host=public&page=20')

	.then(function(data){ res.status(200).json({ status: 'success',
                                               data: JSON.parse(data) })
  })

	.catch(function(error) { return error });

});

// Get RSVP's for a given eventID
router.get('/groups/:name/events/:event_id', function(req, res, next) {

  // Query the Meetup API to return the RSVPs
  rp(meetupAPI + req.params.name + '/events/' + req.params.event_id + '/rsvps?' + API_KEY + '&sign=true&photo-host=public')

  .then(function(data){ res.status(200).json({ status: 'success',
                                               data: JSON.parse(data).map(function(element) { return element.member; }) })
  })

  .catch(function(error) { return error })

}); 


module.exports = router;
