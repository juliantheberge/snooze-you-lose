"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logic_authorization_1 = require("../logic/logic-authorization");
var express = require("express");
var authAPI = express.Router();
authAPI.post('/authorized/api', function (req, res) {
    var inputs = {
        email: req.body.email,
        password: req.body.password
    };
    logic_authorization_1.regenerateSession(req.session)
        .then(function () {
        req.AuthSvc = new logic_authorization_1.default(req.querySvc, inputs, req.sessionID);
        return req.AuthSvc.doAuth();
    })
        .then(function (userDataForSession) {
        req.session.user = userDataForSession;
        res.json({ redirect: "/app" });
    })
        .catch(function (err) {
        console.log(err.message, err);
        console.log(JSON.stringify(err));
        res.json({
            status: "failed",
            error: err.message
        });
    });
});
exports.default = authAPI;
//# sourceMappingURL=guest-authorization-api.js.map