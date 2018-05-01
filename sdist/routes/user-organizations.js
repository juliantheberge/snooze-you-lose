"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logic_organizations_1 = require("../logic/logic-organizations");
var express = require("express");
var orgs = express.Router();
orgs.route('/')
    .post(function (req, res) {
    req.OrgSvc = new logic_organizations_1.default(req.querySvc, req.session.user, req.body.org_uuid);
    req.OrgSvc.addToUserOrgs()
        .then(function () { return res.redirect('/app/accounts/' + req.session.user.uuid + '/orgs'); })
        .catch(function (error) {
        console.log(error);
        res.render('organizations', error);
    });
})
    .get(function (req, res) {
    req.OrgSvc = new logic_organizations_1.default(req.querySvc, req.session.user, null);
    req.OrgSvc.getUserOrgsAndActiveOrg()
        .then(function (renderOrgs) {
        console.log('getuser orgs and active orgs', renderOrgs);
        res.render('organizations', renderOrgs);
    })
        .catch(function (err) {
        console.log(err);
        res.render('organizations', { dbError: err });
    });
});
orgs.route('/:org_uuid')
    .put(function (req, res) {
    req.OrgSvc = new logic_organizations_1.default(req.querySvc, req.session.user, req.body.org_uuid);
    req.OrgSvc.setDefaultOrg()
        .then(function (result) { return res.redirect('/app/accounts/' + req.session.user.uuid + '/orgs/'); })
        .catch(function (error) {
        console.log(error);
        res.render('error', { errMessage: error });
    });
})
    .delete(function (req, res) {
    req.OrgSvc = new logic_organizations_1.default(req.querySvc, req.session.user, req.body.org_uuid);
    req.OrgSvc.removeFromUserOrgs()
        .then(function (result) { return res.redirect('/app/accounts/' + req.session.user.uuid + '/orgs/'); })
        .catch(function (error) {
        console.log(error);
        res.render('organizations', { error: error, dbError: 'try refreshing the page' });
    });
});
orgs.route('/:org_uuid/remove-default')
    .put(function (req, res) {
    req.OrgSvc = new logic_organizations_1.default(req.querySvc, req.session.user, req.body.org_uuid);
    req.OrgSvc.unsetDefaultOrg()
        .then(function (result) { return res.redirect('/app/accounts/' + req.session.user.uuid + '/orgs/'); })
        .catch(function (error) {
        console.log(error);
        res.render('error', { errMessage: error });
    });
});
exports.default = orgs;
//# sourceMappingURL=user-organizations.js.map