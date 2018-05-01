"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var form_item_1 = require("./components/form-item");
var form_wrapper_1 = require("./components/form-wrapper");
var React = require("react");
var Login = /** @class */ (function (_super) {
    __extends(Login, _super);
    function Login(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {};
        return _this;
    }
    Login.prototype.render = function () {
        return (React.createElement("div", { className: 'login-wrapper' },
            React.createElement("div", { className: "flex column userWrapper" },
                React.createElement(form_wrapper_1.default, { buttonText: 'login', url: '/authorized/api', noValidation: false, method: 'post' },
                    React.createElement(form_item_1.default, { title: 'email', placeholder: 'email', imgSrc: '/icons/black/mail.svg' }),
                    React.createElement(form_item_1.default, { title: 'password', placeholder: 'password', imgSrc: '/icons/black/key.svg', type: 'password', newPass: false })),
                React.createElement("div", { className: "flex column userWrapper" }))));
    };
    return Login;
}(React.Component));
exports.default = Login;
//# sourceMappingURL=login.js.map