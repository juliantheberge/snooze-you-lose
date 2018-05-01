"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var guest_authorization_1 = require("./routes/guest-authorization");
var guest_accounts_1 = require("./routes/guest-accounts");
var choose_layout_1 = require("./middleware/choose-layout");
var organizations_1 = require("./routes/organizations");
var user_account_1 = require("./routes/user-account");
var user_alarms_1 = require("./routes/user-alarms");
var user_organizations_1 = require("./routes/user-organizations");
var user_settings_1 = require("./routes/user-settings");
var user_payment_1 = require("./routes/user-payment");
var user_trans_1 = require("./routes/user-trans");
// REACT AND REDUX
var user_alarms_api_1 = require("./routes/user-alarms-api");
var guest_authorization_api_1 = require("./routes/guest-authorization-api");
var index = express.Router();
index.use('/', guest_authorization_1.default);
index.use('/', guest_accounts_1.default);
index.use('/app*', choose_layout_1.default);
index.use('/app/orgs', organizations_1.default);
index.use('/app/accounts/:email', user_account_1.default);
index.use('/app/accounts/:email/alarms', user_alarms_1.default);
index.use('/app/accounts/:email/orgs', user_organizations_1.default);
index.use('/app/accounts/:email/settings', user_settings_1.default);
index.use('/app/accounts/:email/payment', user_payment_1.default);
index.use('/app/accounts/:email/trans', user_trans_1.default);
// REACT AND REDUX
index.use('/', guest_authorization_api_1.default);
index.use('/app/accounts/:email/alarms', user_alarms_api_1.default);
// NEW NAME
index.post('/new-name', function (req, res) {
    if (!req.body) {
        return res.status(400).send({ error: true, message: 'Please provide new name' });
    }
    req.querySvc.updateName([req.body.name, req.session.user.uuid])
        .then(function () { return req.querySvc.getUser([req.session.user.uuid]); })
        .then(function (user) {
        res.json(user);
    })
        .catch(function (e) { return console.log(e); });
});
// HOME
index.get('/', function (req, res) {
    res.render('home', { home: true });
});
// TO LOGIN PAGE
index.get('/to-login', function (req, res) {
    res.render('login');
});
// APP
index.get('/app', function (req, res) {
    return req.session.user ? res.redirect('app/account') : res.redirect('app/guest');
});
index.get('/app/guest', function (req, res) {
    res.render('guest/app');
});
index.get('/app/account', function (req, res) {
    req.session.user ? res.render('app') : res.redirect('/app/guest');
});
// NO JS ALARMS
index.get('/app/guest/alarms', function (req, res) {
    res.render('guest/alarms');
});
exports.default = index;
//# sourceMappingURL=index.js.map