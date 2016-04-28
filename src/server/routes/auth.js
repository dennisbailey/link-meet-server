var express = require('express');
var router = express.Router();
var http = require('http');
var request = require('request-promise');

// *** Require Helpers *** //
var authHelpers = require('./helpers/authHelpers');

// *** Require MongoDB *** //
var User = require('../models/users');
var config = require('../../_config');


// Add a new user to the users collection
router.post('/register', function(req, res, next) {
  
  // Check and see if the user already exists
  User.findOne( {email: req.body.email} )
  
  .then(function (existingUser) {
    
    // Return an error message if the email address already exists
    if (existingUser) { return res.status(409).json({ status: 'fail',
                                                      message: 'Email already exists' });
    }
    
    // If the email address does not exist, add the user to the collection
    // req.body should contain {email, username and password}
    var newUser = new User (req.body);
        
    newUser.save(function () {
    
      // create a jwt token
      var token = authHelpers.generateToken(newUser);

      // Send a 'success' status code and message when a new user is added
      res.status(200).json({ status: 'success',
                             data: { token: token,
                                     user: newUser }
                          });
    
    });
  
  })
  
  // Return an error if necessary
  .catch(function (err) { return next(err); });

});


// Login an exisiting user
router.post('/login', function (req, res, next) {
  
  // Check for the user in the collection by finding their email address
  User.findOne({email: req.body.email})
  
  
  .then(function (user) {
    // If there isn't an email match, return an error
    if (!user) { return res.status(401).json({ status: 'fail',
                                               message: 'Email does not exist' });
    }
    
    // If the email is present, compare the passwords 
    else
    user.comparePassword(req.body.password, function (err, match) {
      if (err) { return next(err); }
      
      //If the password provided is incorrect
      if (!match) { return res.status(401).json({ status: 'fail',
                                                  message: 'This email and password combination is not correct' });
      }
      
      // Create a user object
      user = user.toObject();
    
      // delete user.password;
      var token = authHelpers.generateToken(user);
      
      res.status(200).json({ status: 'success',
                             data: { token: token,
                                     user: user }
      });
  
    });
  
  })
  
  // Return an error if necessary
  .catch(function (err) { return next(err); });

});


module.exports = router;
