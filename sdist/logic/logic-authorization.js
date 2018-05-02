"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require("bcrypt");
var R = require("../services/value-objects");
var uuidv4 = require("uuid/v4");
// AUTHORIZATION
var AuthSvc = /** @class */ (function () {
    function AuthSvc(querySvc, inputs, sessionID) {
        this.sessionID = sessionID;
        this.querySvc = querySvc;
        this.inputs = R.AuthInputs.fromJSON(inputs);
        this.user;
    }
    AuthSvc.checkPassword = function (inputPass, savedPass) {
        return bcrypt.compare(inputPass, savedPass)
            .then(function (result) {
            if (!result) {
                throw new Error('Password doesn\'t match our records, try again');
            }
            else {
                return result;
            }
        });
    };
    AuthSvc.prototype.defineSessionData = function () {
        var session = R.UserSession.fromJSON({
            email: this.user.email,
            uuid: this.user.user_uuid,
            permission: this.user.permission,
            name: this.user.name
        });
        return session;
    };
    AuthSvc.prototype.doAuth = function () {
        var _this = this;
        return this.querySvc.getUserViaEmail([this.inputs.email.toLowerCase()])
            .then(function (result) {
            _this.user = result;
            return AuthSvc.checkPassword(_this.inputs.password, _this.user.password);
        })
            .then(function () { return _this.querySvc.updateSessionID([_this.sessionID, _this.user.user_uuid]); })
            .then(function () {
            var userDataForSession = _this.defineSessionData();
            return userDataForSession;
        });
    };
    return AuthSvc;
}());
exports.default = AuthSvc;
function regenerateSession(session) {
    return new Promise(function (resolve, reject) {
        session.regenerate(function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
exports.regenerateSession = regenerateSession;
// LOGOUT
function updateToInactiveSessionID(querySvc, uuid) {
    var inactive = uuidv4();
    return querySvc.updateSessionID([inactive, uuid])
        .then(function () { })
        .catch(function (err) { return err; });
}
exports.updateToInactiveSessionID = updateToInactiveSessionID;
function destroySession(session) {
    return new Promise(function (resolve, reject) {
        session.destroy(function (err) { return err ? reject(err) : resolve(); });
    });
}
exports.destroySession = destroySession;
//# sourceMappingURL=logic-authorization.js.map