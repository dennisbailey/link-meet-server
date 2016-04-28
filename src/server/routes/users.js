var express = require('express');
var router = express.Router();
var User = require('../models/users.js');

// curl -H "Content-Type: application/json" -X POST -d '{"name":"Mark Cuban","email":"markcuban@mavs.com", "password":"markcuban"}' http://localhost:3000/auth/register

// curl -H "Content-Type: application/json" -X POST -d '{"name":"Mark Cuban","email":"markcuban@mavs.com", "password":"markcuban"}' http://localhost:3000/login

// curl -H "Content-Type: application/json" http://localhost:3000/user/5722472bc41e9644c7c3cc36

// curl -H '{"Content-Type": "application/json", "authorization":"<insert token here>"}' -X PUT -d '{"name":"<insert group name here>","url":"<insert group url here>","photoUrl":"<insert photoUrl here>"}' http://localhost:3000/user/5722472bc41e9644c7c3cc36/group

// curl -H "Content-Type: application/json" -X PUT -d '{"name":"","notes":""}' http://localhost:3000/user/5722472bc41e9644c7c3cc36/people

// curl -H "Content-Type: application/json" -X DELETE http://localhost:3000/user/5722472bc41e9644c7c3cc36/people



// Update Current User by adding a new group
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



// remove a group from a user's groups (by id)
  router.put('/:id/group/:groupid/delete', function(req,res,next) {
    var user_id = req.params.id;
    var group_id = req.params.groupid

    User.findByIdAndUpdate(req.params.id, {$pull: {groups: {"_id": group_id}}}, {new:true})
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



// Update Current User by adding a new person
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



// remove a person from a user's people (by id)
  router.put('/:id/people/:personid/delete', function(req,res,next) {
    var user_id = req.params.id;
    var person_id = req.params.personid
    var option = req.body;
    User.findByIdAndUpdate(req.params.id, {$pull: {people: {"_id": person_id}}}, {new:true})
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



module.exports = router;