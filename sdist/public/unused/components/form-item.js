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
var password_quality_1 = require("./password-quality");
var password_strength_1 = require("./helpers/password-strength");
var validation_1 = require("./helpers/validation");
var React = require("react");
var FormItem = /** @class */ (function (_super) {
    __extends(FormItem, _super);
    function FormItem(props) {
        var _this = _super.call(this, props) || this;
        _this.submitable = function (bool) {
            var arr = [_this.title, bool, _this.state.value];
            _this.props.sendData(arr);
        };
        _this.state = {
            firstClick: false,
            clicked: false,
            submitable: false,
            focused: false,
            error: false,
            input: '',
            value: '',
            errorMessage: '',
            submitted: props.submitted,
            entropy: 0
        };
        _this.title = props.title;
        _this.buttonText = props.buttonText;
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        _this.handleFocus = _this.handleFocus.bind(_this);
        _this.submitable = _this.submitable.bind(_this);
        return _this;
    }
    FormItem.prototype.render = function () {
        return (React.createElement("div", { className: 'textFormWrapper' },
            React.createElement(FormTitle, { title: this.title, firstClick: this.state.firstClick, clicked: this.state.clicked, submitted: this.props.submitted }),
            React.createElement("div", null,
                React.createElement(FormIcon, { clicked: this.state.clicked, imgSrc: this.props.imgSrc }),
                React.createElement(TextInput, { firstClick: this.state.firstClick, clicked: this.state.clicked, onClick: this.handleClick, onFocus: this.handleFocus, onChange: this.handleChange, blurred: this.handleBlur, placeholder: this.props.placeholder, submitted: this.props.submitted, error: this.state.error, value: this.state.value, type: this.props.type })),
            this.props.type === 'password' ? React.createElement(password_quality_1.default, { entropy: this.state.entropy, newPass: this.props.newPass, type: this.props.type }) : React.createElement(password_quality_1.default, null),
            React.createElement(FormError, { error: this.state.error, errorMessage: this.state.errorMessage })));
    };
    FormItem.prototype.handleChange = function (event) {
        if (this.props.type === 'password') {
            this.setState({
                value: event.target.value
            });
            var entropy = password_strength_1.default(event.target.value);
            var validationAns = validation_1.textFormValidation(this.title, entropy.toString());
            if (!(validationAns === 'OK')) {
                this.setState({
                    entropy: entropy,
                    submitable: false
                }, function () {
                    this.state.submitable ? this.submitable(true) : this.submitable(false);
                });
            }
            else {
                this.setState({
                    submitable: true
                }, function () {
                    this.state.submitable ? this.submitable(true) : this.submitable(false);
                });
            }
            this.setState({
                entropy: entropy,
                input: event.target.value,
                clicked: true
            });
        }
        else {
            var checkValue = event.target.value;
            var entropy = password_strength_1.default(this.state.value);
            console.log(this.title, event.target.value, entropy);
            if (this.props.type === 'password') {
                checkValue = entropy.toString();
            }
            this.setState({
                value: event.target.value,
                clicked: true
            }, function () {
                console.log(this.title, this.state.value);
            });
            var validationAns = validation_1.textFormValidation(this.title, checkValue);
            if (validationAns === 'OK') {
                this.setState({
                    error: false,
                    errorMessage: '',
                    submitable: true,
                    entropy: entropy
                }, function () {
                    this.state.submitable ? this.submitable(true) : this.submitable(false);
                });
            }
            else if (event.target.value === '') {
                this.setState({
                    clicked: false,
                    error: false,
                    errorMessage: '',
                    submitable: false,
                    entropy: 0
                }, function () {
                    this.state.submitable ? this.submitable(true) : this.submitable(false);
                });
            }
            else {
                this.setState({
                    error: true,
                    submitable: false,
                    entropy: entropy
                }, function () {
                    this.state.submitable ? this.submitable(true) : this.submitable(false);
                });
            }
            this.setState({
                entropy: entropy,
                input: event.target.value,
                clicked: true
            });
        }
    };
    FormItem.prototype.handleFocus = function () {
        if (!this.state.firstClick) {
            this.setState({
                firstClick: true,
            });
        }
    };
    FormItem.prototype.handleBlur = function (event) {
        var checkValue = event.target.value;
        var entropy = password_strength_1.default(this.state.value);
        if (this.props.type === 'password') {
            checkValue = entropy.toString();
        }
        this.setState({ clicked: false });
        var validationAns = validation_1.textFormValidation(this.title, checkValue);
        if (validationAns === 'OK') {
            this.setState({
                error: false,
                errorMessage: '',
                submitable: true,
            }, function () {
                this.state.submitable ? this.submitable(true) : this.submitable(false);
            });
        }
        else if (event.target.value === '') {
            this.setState({
                clicked: false,
                error: false,
                errorMessage: '',
            });
        }
        else {
            this.setState({
                error: true,
                errorMessage: validationAns
            }, function () {
                this.state.submitable ? this.submitable(true) : this.submitable(false);
            });
        }
    };
    FormItem.prototype.handleClick = function (event) {
        this.setState({
            firstClick: true,
            clicked: true,
            focused: true,
            submitted: false,
            placeholder: ''
        });
    };
    FormItem.prototype.componentDidMount = function () {
        this.submitable(false);
    };
    return FormItem;
}(React.Component));
var TextInput = /** @class */ (function (_super) {
    __extends(TextInput, _super);
    function TextInput(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            placeholder: _this.props.placeholder,
            showPass: false
        };
        _this.handleClick = _this.handleClick.bind(_this);
        return _this;
    }
    TextInput.prototype.handleClick = function (event) {
        if (this.state.showPass) {
            this.setState({
                showPass: false
            });
        }
        else {
            this.setState({
                showPass: true
            });
        }
        event.preventDefault();
    };
    TextInput.prototype.render = function () {
        var currentClass = 'formInactive inputWrapper';
        var eye;
        var password;
        if (this.props.firstClick) {
            currentClass = '';
        }
        else if (this.props.error) {
            currentClass = 'formError inputWrapper';
        }
        if (this.props.submitted) {
            currentClass = 'formSuccess inputWrapper';
        }
        if (this.props.type === 'password') {
            if (this.state.showPass) {
                eye = React.createElement("img", { src: '/icons/eye-no.svg', className: 'icon fadeIn', onClick: this.handleClick });
                password = React.createElement("p", { className: 'showPass marginPaddingFix' }, this.props.value);
            }
            else {
                eye = React.createElement("img", { src: '/icons/black/eye.svg', className: 'icon fadeIn', onClick: this.handleClick });
                password = React.createElement("p", { className: 'hidePass marginPaddingFix' });
            }
        }
        return (React.createElement("div", { className: currentClass },
            React.createElement("input", { placeholder: this.state.placeholder, value: this.props.value, onChange: this.props.onChange, onClick: this.props.onClick, onBlur: this.props.blurred, onFocus: this.props.onFocus, type: this.props.type, className: 'big-form-item' }),
            password,
            eye));
    };
    return TextInput;
}(React.Component));
function FormError(props) {
    return (React.createElement("div", null,
        React.createElement("p", { className: props.error ? "textError fadeIn" : 'fadeOut' }, props.errorMessage)));
}
function FormTitle(props) {
    var currentStyle = '';
    props.firstClick ? currentStyle = "fadeInVert" : currentStyle = "fadeOutVert";
    if (props.submitted) {
        currentStyle = 'titleSuccess';
    }
    return (React.createElement("h5", { className: currentStyle }, props.title));
}
function FormIcon(props) {
    return (React.createElement("img", { className: 'formIcon fadeIn', src: props.imgSrc }));
}
exports.default = FormItem;
//# sourceMappingURL=form-item.js.map