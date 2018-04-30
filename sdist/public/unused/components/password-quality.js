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
var PasswordQuality = /** @class */ (function (_super) {
    __extends(PasswordQuality, _super);
    function PasswordQuality(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            showPass: false
        };
        return _this;
    }
    PasswordQuality.prototype.render = function () {
        var proportion = convertToProportion(this.props.entropy, 128);
        var entropyReport;
        var passIndicator = {
            width: proportion + '%',
            height: '4px',
            background: '#9f2121',
            transition: '300ms',
            maxWidth: '100%'
        };
        if (this.props.entropy > 0) {
            entropyReport = React.createElement("p", { className: 'fadeIn textError marginPaddingFix' },
                " ",
                "Not strong enough. Entropy: " + this.props.entropy,
                " ");
        }
        if (this.props.entropy > 59) {
            passIndicator.background = '#068721';
            entropyReport = React.createElement("p", { className: 'fadeIn textSuccess marginPaddingFix' },
                " ",
                "This should be strong enough. Entropy: " + this.props.entropy,
                " ");
        }
        if (this.props.newPass) {
            return (React.createElement("div", null,
                React.createElement("div", { className: 'passwordQualityWrapper', id: 'passwordQualityRightFix' },
                    React.createElement("div", { style: passIndicator }),
                    entropyReport)));
        }
        else {
            return null;
        }
    };
    return PasswordQuality;
}(React.Component));
// HELPER
function convertToProportion(number, max) {
    if (number !== 0) {
        return ((number / max) * 100);
    }
    else {
        return 0;
    }
}
exports.default = PasswordQuality;
//# sourceMappingURL=password-quality.js.map