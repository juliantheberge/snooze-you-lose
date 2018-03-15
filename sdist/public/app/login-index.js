"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var form_wrapper_1 = require("./form-wrapper");
var form_item_text_1 = require("./form-item-text");
var form_item_password_1 = require("./form-item-password");
var React = require("react");
var ReactDOM = require("react-dom");
ReactDOM.render(React.createElement(form_wrapper_1.default, { buttonText: 'create new account', url: 'http://localhost:8000/accounts' },
    React.createElement(form_item_text_1.default, { title: 'username', placeholder: 'type in your username' }),
    React.createElement(form_item_text_1.default, { title: 'email', placeholder: 'type in your email' }),
    React.createElement(form_item_text_1.default, { title: 'phone', placeholder: 'type in your phone number' }),
    React.createElement(form_item_password_1.default, { title: 'password', placeholder: 'type in your password' })), document.getElementById('login'));
//# sourceMappingURL=login-index.js.map