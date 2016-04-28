var express = require('express');
var router = express.Router();
var User = require('../models/users.js');


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