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
var form_wrapper_1 = require("./components/form-wrapper");
var form_item_1 = require("./components/form-item");
var React = require("react");
var NewAccount = /** @class */ (function (_super) {
    __extends(NewAccount, _super);
    function NewAccount() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NewAccount.prototype.render = function () {
        return (React.createElement("div", { className: "flex column userWrapper" },
            React.createElement(form_wrapper_1.default, { buttonText: 'create new account', url: '/accounts/api', method: 'post' },
                React.createElement(form_item_1.default, { title: 'name', placeholder: 'name', imgSrc: '/icons/black/user-fem.svg' }),
                React.createElement(form_item_1.default, { title: 'email', placeholder: 'email', imgSrc: '/icons/black/mail.svg' }),
                React.createElement(form_item_1.default, { title: 'phone', placeholder: 'phone', imgSrc: '/icons/black/phone.svg' }),
                React.createElement(form_item_1.default, { title: 'password', placeholder: 'password', imgSrc: '/icons/black/key.svg', type: 'password', newPass: true }))));
    };
    return NewAccount;
}(React.Component));
exports.default = NewAccount;
//# sourceMappingURL=new-account.js.map