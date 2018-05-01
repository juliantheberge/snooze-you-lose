"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
function Button(props) {
    var currentClass = 'button dark-button';
    if (!props.submitable) {
        currentClass = 'button un-button';
    }
    if (props.submitted) {
        currentClass = 'button success-button';
    }
    return (React.createElement("button", { className: currentClass }, props.buttonText));
}
exports.default = Button;
//# sourceMappingURL=button-generic.js.map