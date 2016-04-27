var express = require('express');
var router = express.Router();
var User = require('../../../models/userModel.js');
var Catalog = require('../../../models/catalogModel.js');

/* Update Current User by adding a new group
  {name, url, photoUrl} to user's groups */
/* Update Current User Profile */
router.put('/:id/group', function(req,res,next) {
  var user = req.params.id;
  var option = req.body;
  User.findByIdAndUpdate(req.params.id, req.body, {new:true})
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
router.put('/:id/edit', function(req,res,next) {
  User.findByIdQ(req.params.id)
  .then(function(user) {
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.address = {
          street: req.body.street,
          apt: req.body.apt,
          zipCode: req.body.zipcode,
          state: req.body.state,
          country: req.body.country
        };
    user
      .saveQ()
      .then(function(userUpdated) {
        res.json(userUpdated);
      })
      .catch(function(err) {
        res.json({
          status: 500,
          message: err
        });
      });
  });
});

// need to delete self

/* Delete item from user's cart */
router.delete('/:id/cart/delete', function(req,res,next) {
  User.findByIdAndUpdate(req.params.id,
    {
      $pull: {
        "cart": {
          itemID: req.body.itemID
        }
      }
    },
    {multi: false},
    function(err, user) {
      if (err) {
        res.json({
          status: 500,
          message: err
        });
      } else {
          res.json(user);
      }
    });
});


/* Delete A user */
router.delete('/:id/delete', function(req,res,next) {
  User.findByIdAndRemoveQ(req.params.id)
  .then(function(data) {
    res.json({
      status: 200,
      message: 'User Removed'
    });
  })
  .catch(function(err) {
    res.json({
      status: 500,
      message: err
    });
  });
});


module.exports = router;