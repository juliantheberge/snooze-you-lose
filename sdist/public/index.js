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
var app_1 = require("./app");
var new_account_1 = require("./new-account");
var login_1 = require("./login");
var React = require("react");
var redux_thunk_1 = require("redux-thunk");
var ReactDOM = require("react-dom");
var test_1 = require("./test");
var simple_clock_1 = require("./simple-clock");
var react_redux_1 = require("react-redux");
var redux_devtools_extension_1 = require("redux-devtools-extension");
var redux_1 = require("redux");
var user_data_1 = require("./user-data");
exports.populate = user_data_1.populate;
var actions_1 = require("./actions");
var actions_alarm_1 = require("./actions-alarm");
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        return _this;
    }
    ErrorBoundary.prototype.componentDidCatch = function (error, info) {
        this.setState({ hasError: true });
    };
    ErrorBoundary.prototype.render = function () {
        if (this.state.hasError) {
            return React.createElement("h1", null, "Something went wrong.");
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(React.Component));
var initialState = {};
function userDataReducer(state, action) {
    if (state === void 0) { state = initialState; }
    switch (action.type) {
        case user_data_1.POPULATE:
            return Object.assign({}, state, {
                profile: action.userData.profile,
                alarms: action.userData.alarms
            });
        case actions_alarm_1.REQ_TIME_CHANGE:
            return Object.assign({}, state, { isFetching: true });
        case actions_alarm_1.RES_TIME_CHANGE:
            return Object.assign({}, state, {
                isFetching: false,
                alarms: action.alarms,
                error: "dismissed"
            });
        case actions_1.REQ_NAME_CHANGE:
            return Object.assign({}, state, { isFetching: true });
        case actions_1.RES_NAME_CHANGE:
            return Object.assign({}, state, {
                isFetching: false,
                profile: action.profile
            });
        case actions_alarm_1.REQ_ALARM:
            return Object.assign({}, state, { isFetching: true });
        case actions_alarm_1.RES_ALARM:
            return Object.assign({}, state, {
                isFetching: false,
                alarms: action.alarms
            });
        case actions_alarm_1.REQ_ACTIVE_TOGGLE:
            return Object.assign({}, state, { isFetching: true });
        case actions_alarm_1.RES_ACTIVE_TOGGLE:
            console.log('res active toggle', action);
            return Object.assign({}, state, {
                isFetching: false,
                alarms: action.alarms
            });
        case actions_alarm_1.REQ_ALARM_TITLE:
            return Object.assign({}, state, { isFetching: true });
        case actions_alarm_1.REQ_ALARM_TITLE:
            return Object.assign({}, state, {
                isFetching: false,
                alarms: action.alarms
            });
        case actions_alarm_1.REQ_ALARM_ARCHIVE:
            return Object.assign({}, state, { isFetching: true });
        case actions_alarm_1.REQ_ALARM_ARCHIVE:
            return Object.assign({}, state, {
                isFetching: false,
                alarms: action.alarms
            });
        case actions_1.GEN_ERR:
            console.log('gen error', action);
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error,
            });
        case actions_1.CLEAR_ERR:
            return Object.assign({}, state, {
                error: action.error,
            });
        default:
            return state;
    }
}
var reducer = redux_1.combineReducers({
    userData: userDataReducer
});
var store = redux_1.createStore(reducer, redux_devtools_extension_1.composeWithDevTools(redux_1.applyMiddleware(redux_thunk_1.default)));
exports.store = store;
function app() {
    ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
        React.createElement(app_1.default, null)), document.getElementById('app'));
}
exports.app = app;
function test() {
    ReactDOM.render(React.createElement(react_redux_1.Provider, { store: store },
        React.createElement(test_1.TestApp, null)), document.getElementById('test'));
}
exports.test = test;
function alarmClock() {
    ReactDOM.render(React.createElement(simple_clock_1.SimpleClock, null), document.getElementById('simpleClock'));
}
exports.alarmClock = alarmClock;
function newAccount() {
    ReactDOM.render(React.createElement(new_account_1.default, null), document.getElementById('newAccount'));
}
exports.newAccount = newAccount;
function login() {
    return ReactDOM.render(React.createElement(login_1.default, null), document.getElementById('login'));
}
exports.login = login;
//# sourceMappingURL=index.js.map