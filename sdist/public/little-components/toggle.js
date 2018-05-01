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
var Toggler = /** @class */ (function (_super) {
    __extends(Toggler, _super);
    function Toggler(props) {
        var _this = _super.call(this, props) || this;
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }
    Toggler.prototype.handleSubmit = function (e) {
        e.preventDefault();
        this.props.toggleActive({
            active: this.props.alarm.active,
            alarm_uuid: this.props.alarm.alarm_uuid
        });
    };
    Toggler.prototype.render = function () {
        var togglerStyle = "toggler";
        var wrapperStyle = "toggle-wrapper";
        if (this.props.alarm.active) {
            togglerStyle = "toggler toggler-on";
            wrapperStyle = "toggle-wrapper toggle-on";
        }
        return (React.createElement("div", null,
            React.createElement("div", { className: wrapperStyle, onClick: this.handleSubmit },
                React.createElement("div", { className: togglerStyle }))));
    };
    return Toggler;
}(React.Component));
exports.Toggler = Toggler;
var ArchiveAlarm = /** @class */ (function (_super) {
    __extends(ArchiveAlarm, _super);
    function ArchiveAlarm(props) {
        var _this = _super.call(this, props) || this;
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        return _this;
    }
    ArchiveAlarm.prototype.handleSubmit = function (e) {
        e.preventDefault();
        this.props.archiveAlarm({
            alarm_uuid: this.props.alarm.alarm_uuid
        });
    };
    ArchiveAlarm.prototype.render = function () {
        return (React.createElement("input", { onClick: this.handleSubmit, className: "icon", type: "image", width: "20px", height: "20px", src: "/icons/black/trash.svg" }));
    };
    return ArchiveAlarm;
}(React.Component));
exports.ArchiveAlarm = ArchiveAlarm;
//# sourceMappingURL=toggle.js.map