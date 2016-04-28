var express = require('express');
var router = express.Router();
var User = require('../models/users.js');

// curl -H "Content-Type: application/json" -X POST -d '{"name":"Mark Cuban","email":"markcuban@mavs.com", "password":"markcuban"}' http://localhost:3000/auth/register

// curl -H "Content-Type: application/json" -X POST -d '{"name":"Mark Cuban","email":"markcuban@mavs.com", "password":"markcuban"}' http://localhost:3000/login

// curl -H "Content-Type: application/json" http://localhost:3000/user/5722472bc41e9644c7c3cc36

// curl -H '{"Content-Type": "application/json", "authorization":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1NzIyNDcyYmM0MWU5NjQ0YzdjM2NjMzYiLCJ1c2VybmFtZSI6IkRlbm5pcyIsImVtYWlsIjoiRGVubmlzIiwicGFzc3dvcmQiOiIkMmEkMDQkSTJUWXJYZXNPREJjc0hIOHFNZWRlLlhLVkdEYWtpbWlhMEY5ZndFSW8vOHNDcWxlOVdJQkciLCJfX3YiOjAsInBlb3BsZSI6W10sImdyb3VwcyI6W10sImlhdCI6MTQ2MTg2NDI3MywiZXhwIjoxNDYxOTAwMjczfQ.u1lhY1jRjoYSqGSfbgNjKZVLLY_ELBo-Ij9V-XqCECw"}' -X PUT -d '{"name":"Mavericks","url":"http://www.mavs.com/","photoUrl":"https://lh6.googleusercontent.com/-slpV9wVGlpc/AAAAAAAAAAI/AAAAAAAAKjQ/w22hy18WF8w/s0-c-k-no-ns/photo.jpg"}' http://localhost:3000/user/5722472bc41e9644c7c3cc36/group

// curl -H "Content-Type: application/json" -X PUT -d '{"name":"Mark Cuban","notes":"Smart guy."}' http://localhost:3000/user/5722472bc41e9644c7c3cc36/people

// curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/user/5722472bc41e9644c7c3cc36/people



/* Update Current User by adding a new group
  {name, url, photoUrl} to user's groups */
/* Update Current User Profile */
router.put('/:id/group', function(req,res,next) {
  var user_id = req.params.id;
  var option = req.body;
  User.findByIdAndUpdate(req.params.id, {$addToSet: {groups: req.body}}, {new:true})
  .then(function (user) {
    res.status(200).json({
      status: 'success',
      data: user
    });
  })
  .catch(function (err) {
    return next(err);
  });
});


/* Update Current User by adding a new person
  {name, notes} to user's people */
/* Update Current User Profile */
router.put('/:id/people', function(req,res,next) {
  var user_id = req.params.id;
  var option = req.body;
  User.findByIdAndUpdate(req.params.id, {$addToSet: {people: req.body}}, {new:true})
  .then(function (user) {
    res.status(200).json({
      status: 'success',
      data: user
    });
  })
  .catch(function (err) {
    console.log("err: ", err);
    return next(err);
  });
});


// get user by id
router.get('/:id', function (req, res, next) {
  User.findById(req.params.id)
  .then(function (user) {
    res.status(200).json({
      status:'success',
      data: user
    });
  })
  .catch(function (err) {
    return next(err);
  });
});


// delete user by id (delete self)
router.delete('/:id/delete', function (req, res, next) {
  User.findByIdAndRemove(req.params.id)
  .then(function (user) {
    res.status(200).json({
      status: 'success',
      data: user
    });
  })
  .catch(function (err) {
    return next(err);
  });
});



module.exports = router;