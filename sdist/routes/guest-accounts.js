"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logic_accounts_1 = require("../logic/logic-accounts");
var error_handling_1 = require("../services/error-handling");
var express = require("express");
var accts = express.Router();
//to sign up page
accts.get('/new-account', function (req, res) { return res.render('new-account'); });
// this seems to do nothing
accts.route('/accounts')
    .post(function (req, res) {
    req.CreateAcctSvc = new logic_accounts_1.default(req.querySvc, req.body, req.sessionID);
    req.CreateAcctSvc.createAcct()
        .then(function (result) {
        res.render('login');
    })
        .catch(function (err) {
        var stack = new Error().stack;
        console.log('error', err, 'stack', stack);
        res.render('new-account', {
            dbError: error_handling_1.dbErrTranslator(err)
        });
    });
});
accts.route('/accounts/api')
    .post(function (req, res) {
    req.CreateAcctSvc = new logic_accounts_1.default(req.querySvc, req.body, req.sessionID);
    req.CreateAcctSvc.createAcct()
        .then(function (result) {
        res.json({ status: "OK" });
    })
        .catch(function (err) {
        var stack = new Error().stack;
        console.log('error', err, 'stack', stack);
        res.json({
            status: "FAILED",
            error: err,
            stack: stack
        });
    });
});
exports.default = accts;
//# sourceMappingURL=guest-accounts.js.map