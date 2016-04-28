var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var config = require('../../_config');

// Define the schema for the user colletion
var UserSchema = new Schema({

  username:             { type:     String,
                          required: true,
                          unique:   true },

  email:                { type:     String,
                          required: true,
                          unique:   true },

  password:             { type:     String,
                          required: true },

  groups : [{ name:     { type:     String },
              url:      { type:     String },
              photoUrl: { type:     String }
           }],

  people: [{ name:      { type:     String},
             notes:     { type:     String}
          }]

});


// Hash the password before it saving to the collection
UserSchema.pre('save', function(next) {

  var user = this;

  // Only hash if password is new or being modified
  if(!user.isModified('password')) {
    return next();
  }

  // Salt and Hash the password
  bcrypt.genSalt(config.SALT_WORK_FACTOR, function(err, salt) {

    if(err) { return next(err); }

    // hash password
    bcrypt.hash(user.password, salt, function(err, hash) {

      if(err) { return next(err); }

      // override the plain-text password with new hashed/salted password
      user.password = hash;

      // Continue to the next middleware function
      next();

    });

  });

});


// Compare password to verify plain text against the hashed password
UserSchema.methods.comparePassword = function(password, done)  {

  bcrypt.compare(password, this.password, function(err, match) {
    if(err) { return done(err); }

    done(err, match);

  });

};


var User = mongoose.model('user', UserSchema);


module.exports = User;
