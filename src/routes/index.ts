import * as express from 'express';
const router = express.Router();

router.use('/', require('./guest/authorization'));
router.use('/', require('./guest/accounts'));
// router.use('/', require('./guest/email'));
// router.use('/guest', require('./guest/shopping'));
router.use('/app/guest/alarms', require('./guest/alarms'));
router.use('/app/guest/orgs', require('./guest/organizations'));

// router.use('/admin', require('./admin/products'));
// router.use('/admin', require('./admin/coupons'));
// router.use('/admin', require('./admin/accounts'));

// router.use('/accounts', require('./account'));
router.use('/app/accounts/:email', require('./account/all'))
router.use('/app/accounts/:email/alarms', require('./account/alarms'));
router.use('/app/accounts/:email/orgs', require('./account/organizations'));
// router.use('/accounts/:email', require('./account/payment'));
// router.use('/accounts/:email', require('./account/cart'));
// router.use('/accounts/:email', require('./account/coupons'));
// router.use('/accounts/:email', require('./account/orders'));
// router.use('/accounts/:email', require('./account/settings'));
// router.use('/accounts/:email', require('./account/transactions'));

// HOME
router.get('/', function (req, res, next) {
  res.render('home')
})

// APP
router.get('/app', (req, res) => req.session.user ? res.redirect('app/account') : res.redirect('app/guest'))

router.get('/app/account', (req, res) => {
  res.render('account/app')
})

router.get('/app/guest', (req, res) => {
  res.render('guest/app')
})

// USER DATA SENDER

router.get('/user-data', (req, res, next) => {
    let user = {};
    req.aQuery.selectUserOrgs([req.session.user.uuid])
        .then((result) => {
            result.rowCount > 0 ? user.orgs = result.rows : user.settings = 'n/a';
            return req.aQuery.selectAlarms([req.session.user.uuid])
        })
        .then((result) => {
            result.rowCount > 0 ? user.alarms = result.rows : user.settings = 'n/a';
            return req.aQuery.selectUserSettings([req.session.user.uuid])
        })
        .then((result) => {
            result.rowCount > 0 ? user.settings = result.rows[0] : user.settings = 'n/a';
            return req.aQuery.selectAuthenticatedUser([req.session.user.uuid])
        })
        .then((result) => {
            console.log(result)
            result.rowCount > 0 ? user.profile = result.rows[0] : user.profile = 'n/a';

            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>')
            console.log(user)
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>')
            res.json(user)
        })
        .catch(err => console.log(err))
})


// PERMISSION SENDER

router.get('/permission', (req, res) => {
  if (typeof req.session.user === 'undefined') {
    res.json(JSON.stringify({permission: 'guest'}))
  } else {
    res.json(JSON.stringify(req.session.user));
  }
})

router.get('/dummy-route', (req, res) => {
  res.render('dummy');
})

// TO LOGIN PAGE

router.get('/to-login', (req, res) => {
  res.render('login');
})

// NEEDS GUEST AND USER BEHAVIOR
router.get('/contact', function (req, res, next) {
  res.render('contact');
})

module.exports = router;
