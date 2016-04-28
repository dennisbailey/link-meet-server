var moment = require('moment');
var jwt = require('jsonwebtoken');

var config = require('../../../_config');


authHelpers = {

  generateToken: function(user) {

                   return jwt.sign(user, config.TOKEN_SECRET, { expiresIn: "10h"});

  },


  // Ensure authenticated
  ensureAuthenticated: function(req, res, next) {

                           // check headers for the presence of an auth object
                           if(!(req.headers && req.headers.authorization)) {
                             return res.status(400).json({ status: 'Failure',
                                                           message: 'No header present or no authorization header.' });
                           }


                           var token = req.headers.authorization;

                           if (token) { jwt.verify(token, config.TOKEN_SECRET, function(err, decoded) {

                               if (err) { return res.json({ success: false,
                                                            message: 'Failed to authenticate token' });
                               }

                              next();

                              });

                           } else { return res.status(403).send({ success: false,
                                                                  message: 'No token provided'}); }
                        }

};

module.exports = authHelpers;
