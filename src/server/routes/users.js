var express = require('express');
var router = express.Router();
var User = require('../../../models/userModel.js');
var Catalog = require('../../../models/catalogModel.js');

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
    return next(err);
  });
});

// need to delete self
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