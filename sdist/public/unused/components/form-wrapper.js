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
var button_generic_1 = require("./button-generic");
var React = require("react");
//
var FormWrapper = /** @class */ (function (_super) {
    __extends(FormWrapper, _super);
    function FormWrapper(props) {
        var _this = _super.call(this, props) || this;
        // CHANGE DATA SENDING TO OBJ RATHER THAN ARRAY
        _this.getData = function (dataFromChild) {
            var data = _this.state.data;
            var title = dataFromChild[0];
            var value = dataFromChild[2];
            data[title] = value;
            _this.setState({
                data: data
            });
            _this.getValidation(dataFromChild);
        };
        _this.state = {
            errorMessage: '',
            error: false,
            submitted: false,
            submitable: false,
            data: {}
        };
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.getValidation = _this.getValidation.bind(_this);
        _this.testObj = {};
        return _this;
    }
    FormWrapper.prototype.getValidation = function (arr) {
        for (var k in this.testObj) {
            if (k === arr[0]) {
                console.log(arr[0], 'is already in array');
            }
        }
        var obj = this.testObj;
        obj[arr[0]] = arr[1];
        var bool = this.submitCheck();
        this.setState({
            submitable: bool
        });
    };
    FormWrapper.prototype.submitCheck = function () {
        for (var k in this.testObj) {
            if (this.testObj[k] === false) {
                return false;
            }
        }
        return true;
    };
    FormWrapper.prototype.handleSubmit = function (event) {
        var _this = this;
        console.log('HANDLE SUBMIT CALLED:', this.state.data);
        event.preventDefault();
        if (this.state.submitable && this.props.method === 'post') {
            console.log('state submitted true and this props method is post');
            return fetch(this.props.url, {
                body: JSON.stringify(this.state.data),
                method: "post",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            })
                .then(function (res) { return res.json(); })
                .then(function (body) { return console.log(body); })
                .then(function () { return _this.setState({
                submitted: true
            }); })
                .catch(function (error) {
                console.log(error);
                _this.setState({
                    errorMessage: error,
                    submitted: false,
                    submitable: false,
                    data: {}
                });
            });
        }
        else if (this.state.submitable && this.props.method === 'get') {
            fetch(this.props.url, {
                method: "get",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });
        }
        else {
            console.log('some validation required before sending!');
        }
        this.props.noValidation ? console.log('no validation req') : event.preventDefault();
    };
    FormWrapper.prototype.skipValidation = function () {
        this.setState({
            submitable: true
        });
    };
    FormWrapper.prototype.componentDidMount = function () {
        this.props.noValidation ? this.skipValidation() : console.log('validation required');
    };
    FormWrapper.prototype.render = function () {
        var _this = this;
        console.log('CHILDREN', this.props.children);
        var childWithProp = React.Children.map(this.props.children, function (child) {
            console.log(child);
            return React.cloneElement(child, {
                sendData: _this.getData,
                submitted: _this.state.submitted
            });
        });
        return (React.createElement("div", { className: 'formWrapper' },
            React.createElement("form", { onSubmit: this.handleSubmit, action: this.props.url, method: this.props.method },
                childWithProp,
                React.createElement(button_generic_1.default, { submitable: this.state.submitable, submitted: this.state.submitted, onClick: this.handleSubmit, buttonText: this.props.buttonText })),
            React.createElement("div", null,
                React.createElement("p", { className: this.state.error ? "textError fadeIn" : 'fadeOut' }, this.state.errorMessage))));
    };
    return FormWrapper;
}(React.Component));
exports.default = FormWrapper;
//# sourceMappingURL=form-wrapper.js.map