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
var React = require("react");
var validation_test_1 = require("../behavior/validation-test");
var TextForm = /** @class */ (function (_super) {
    __extends(TextForm, _super);
    function TextForm(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            clicked: false,
            submitable: false,
            focused: false,
            error: false,
            input: '',
            errorMessage: '',
            submitted: props.submitted,
            placeholder: props.placeholder,
            title: props.title,
            buttonText: props.buttonText
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleBlur = _this.handleBlur.bind(_this);
        return _this;
    }
    TextForm.prototype.handleChange = function (event) {
        var validationAns = validation_test_1.textFormValidation(this.state.title, event.target.value);
        if (!(validationAns === 'OK')) {
            this.setState({
                submittable: false
            });
        }
        this.setState({
            input: event.target.value,
            clicked: true
        });
    };
    TextForm.prototype.handleBlur = function (event) {
        this.setState({
            clicked: false
        });
        console.log(this.state.title);
        var validationAns = validation_test_1.textFormValidation(this.state.title, event.target.value);
        if (validationAns === 'OK') {
            this.setState({
                error: false,
                errorMessage: '',
                submitable: true
            });
        }
        else if (event.target.value === '') {
            this.setState({
                clicked: false,
                error: false,
                errorMessage: '',
                placeholder: this.props.placeholder
            });
        }
        else {
            this.setState({
                error: true,
                errorMessage: validationAns
            });
        }
    };
    TextForm.prototype.handleClick = function (event) {
        this.setState({
            clicked: true,
            focused: true,
            submitted: false,
            placeholder: ''
        });
    };
    TextForm.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(FormTitle, { title: this.state.title, clicked: this.state.clicked, submitted: this.state.submitted }),
            React.createElement("div", null,
                React.createElement(Icon, { clicked: this.state.clicked }),
                React.createElement(TextInput, { onChange: this.handleChange, onClick: this.handleClick, focused: this.handleClick, blurred: this.handleBlur, clicked: this.state.clicked, placeholder: this.state.placeholder, submitted: this.state.submitted, error: this.state.error })),
            React.createElement(FormError, { error: this.state.error, errorMessage: this.state.errorMessage })));
    };
    return TextForm;
}(React.Component));
function FormError(props) {
    var currentClass = 'fadeOut';
    if (props.error) {
        currentClass = "textError fadeIn";
    }
    return (React.createElement("div", null,
        React.createElement("p", { className: currentClass }, props.errorMessage)));
}
function TextInput(props) {
    var currentClass = '';
    if (props.error) {
        currentClass = 'formError';
    }
    if (props.submitted) {
        currentClass = 'formSuccess';
    }
    return (React.createElement("div", { className: currentClass },
        React.createElement("input", { type: 'text', placeholder: props.placeholder, onFocus: props.test, onChange: props.onChange, onClick: props.onClick, onBlur: props.blurred })));
}
function FormTitle(props) {
    var currentStyle = '';
    if (props.clicked) {
        currentStyle = "fadeInVert";
    }
    else if (props.submitted) {
        currentStyle = "fadeOutVert green";
    }
    else {
        currentStyle = "fadeOutVert";
    }
    return (React.createElement("h4", { className: currentStyle }, props.title));
}
function Icon(props) {
    if (props.clicked) {
        return (React.createElement("img", { className: 'icon fadeIn', src: 'https://image.flaticon.com/icons/svg/29/29076.svg' }));
    }
    else {
        return (React.createElement("img", { className: 'icon fadeOut', src: 'https://image.flaticon.com/icons/svg/29/29076.svg' }));
    }
}
exports.default = TextForm;
//# sourceMappingURL=text-form.js.map