// Seed the user collection
var User = require('../users');

var data = [
  { username: 'username',
    email: 'email@test.com',
    password: 'password'
  }
];

function runSeed(done) {
  var user = new User(data[0]);
  
  user.save()
  .then(function() {
    done();
  });
}


module.exports = {
  runSeed: runSeed
};