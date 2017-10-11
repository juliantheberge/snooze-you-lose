const express = require('express');
const query = require('../functions/queries');
const helper = require('../functions/helpers');
const router = express.Router();

// to account information
router.get('/to-manage-account', function( req, res, next) {
    res.render('manage-account', {
      subtitle: "click change if you need to fix something",
      email: req.user.email,
      phone: req.user.phone
    });
});

// render change email page
router.get('/to-change-email', function(req,res,next) {
  res.render('manage-account',{
    title: "Change your information",
    subtitle: "type in a new email",
    email: req.user.email,
    phone: req.user.phone,
    emailChange: true
  });
});

//render change phone page
router.get('/to-change-phone', function(req,res,next) {
  res.render('manage-account',{
    title: "Change your information",
    subtitle: "type in a new phone number",
    email: req.user.email,
    phone: req.user.phone,
    phoneChange: true
  });
});



// change email
router.post('/change-email', function (req, res, next) {
  var thisPage = 'manage-account';
  var nextPage = 'manage-account';
  var inputs = {
    newEmail: req.body.email,
    oldEmail: req.user.email
  };
  req.querySvc.updateEmail(inputs, function(err, result) {
    if (err) {
      helper.dbError(res, thisPage, err);
    } else {
      req.session.user[0] = req.body.email;
      req.user.email = req.body.email;
      res.render(nextPage, {
        subtitle: 'email updated',
        email: req.user.email,
        phone: req.user.phone,
        changeEmail:false
      });
    }
  });
});



// change phone
router.post('/change-phone', function (req, res, next) {
  var thisPage = 'manage-account';
  var nextPage = 'manage-account';
  var inputs = {
    newPhone: req.body.phone,
    email: req.user.email
  };
  req.querySvc.updatePhone(inputs, function(err, result) {
    if (err) {
      helper.dbError(res, thisPage, err);
    } else {
      req.session.user[2] = req.body.phone;
      req.user.phone = req.body.phone;
      res.render(nextPage, {
        subtitle: 'phone number updated',
        email: req.user.email,
        phone: req.user.phone,
        changeEmail:false
      });
    }
  });
});


//render shop
router.get('/back-account-actions', function(req,res,next) {
  res.render('account-actions', { title: "back to the account action page", email: req.user.email});
});

module.exports = router;
