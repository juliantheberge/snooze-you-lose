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
var Transition_1 = require("react-transition-group/Transition");
var toggle_1 = require("./little-components/toggle");
var nothing_here_1 = require("./little-components/nothing-here");
var AlarmList = /** @class */ (function (_super) {
    __extends(AlarmList, _super);
    function AlarmList(props) {
        return _super.call(this, props) || this;
    }
    AlarmList.prototype.render = function () {
        var _this = this;
        var alarms = this.props.alarms.map(function (alarm) {
            return React.createElement(Alarm, { alarm: alarm, key: alarm.id, postTime: _this.props.postTime, toggleActive: _this.props.toggleActive, postTitle: _this.props.postTitle, archiveAlarm: _this.props.archiveAlarm });
        });
        return (React.createElement("div", null, this.props.alarms.length === 0
            ?
                React.createElement(nothing_here_1.default, null)
            :
                alarms));
    };
    return AlarmList;
}(React.Component));
exports.AlarmList = AlarmList;
var Alarm = /** @class */ (function (_super) {
    __extends(Alarm, _super);
    function Alarm(props) {
        return _super.call(this, props) || this;
    }
    Alarm.prototype.render = function () {
        var _this = this;
        var activeButton;
        if (this.props.alarm.active) {
            activeButton = React.createElement("button", { type: 'submit', className: "button dark-button" }, "disable");
        }
        else {
            activeButton = React.createElement("button", { type: 'submit', className: "button light-button" }, "enable");
        }
        var duration = 200;
        var transitionStyles = {
            entering: {
                opacity: 0,
                transition: "opacity " + duration + "ms ease-in-out",
            },
            entered: {
                opacity: 1,
                transition: "opacity " + duration + "ms ease-in-out",
            },
            exiting: {
                opacity: .8,
                transition: "opacity " + duration + "ms ease-in-out",
            },
            exited: {
                opacity: 0,
                transition: "opacity " + duration + "ms ease-in-out",
            }
        };
        return (React.createElement(Transition_1.default, { in: true, timeout: duration, unmountOnExit: true, mountOnEnter: true, appear: true }, function (state) {
            return React.createElement("div", { className: "column contentWrapper", style: transitionStyles[state] },
                React.createElement("div", { className: "alarm-row" },
                    React.createElement("div", { className: 'time-wrapper' },
                        React.createElement("div", { className: 'form-row' },
                            React.createElement("p", { className: "small-text centered-text" }, _this.props.alarm.nextAlarm),
                            React.createElement("p", { className: "small-text centered-text" }, "\u2022"),
                            React.createElement(TitleForm, { alarm_uuid: _this.props.alarm.alarm_uuid, title: _this.props.alarm.title, postTitle: _this.props.postTitle })),
                        React.createElement("div", { className: 'alarm-time-row' },
                            React.createElement(TimeForm, { alarm_uuid: _this.props.alarm.alarm_uuid, time: _this.props.alarm.time, postTime: _this.props.postTime }),
                            React.createElement("div", { className: 'toggle-down' },
                                React.createElement(toggle_1.Toggler, { alarm: _this.props.alarm, toggleActive: _this.props.toggleActive }))))),
                React.createElement("div", { className: "alarm-row" },
                    React.createElement("a", { href: '/app/accounts/{user_uuid}/settings' },
                        React.createElement("img", { className: 'icon fadeIn', src: '/icons/black/gear.svg' })),
                    React.createElement(toggle_1.ArchiveAlarm, { alarm: _this.props.alarm, archiveAlarm: _this.props.archiveAlarm })));
        }));
    };
    return Alarm;
}(React.Component));
var TimeForm = /** @class */ (function (_super) {
    __extends(TimeForm, _super);
    function TimeForm(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            value: _this.props.time,
            form: false,
            formStyle: {
                width: '148.25px'
            },
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.setWrapperRef = _this.setWrapperRef.bind(_this);
        _this.handleClickOutside = _this.handleClickOutside.bind(_this);
        return _this;
    }
    TimeForm.prototype.componentDidMount = function () { document.addEventListener('mousedown', this.handleClickOutside); };
    TimeForm.prototype.componentWillUnmount = function () { document.removeEventListener('mousedown', this.handleClickOutside); };
    TimeForm.prototype.onBlur = function () {
        this.setState({
            form: !this.state.form,
            value: this.props.time
        });
    };
    TimeForm.prototype.setWrapperRef = function (node) { this.wrapperRef = node; };
    TimeForm.prototype.handleClickOutside = function (event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.handleSubmit(event);
            this.onBlur();
        }
    };
    TimeForm.calcWidth = function (chars) {
        if (chars < 5) {
            return ('30px');
        }
        else {
            return ((chars * 6) + 'px');
        }
    };
    TimeForm.prototype.handleChange = function (event) {
        var _this = this;
        this.setState({ value: event.target.value }, function () { return console.log(_this.state.value); });
    };
    TimeForm.prototype.handleSubmit = function (event) {
        event.preventDefault();
        if (this.state.value !== '') {
            this.props.postTime({
                alarm_uuid: this.props.alarm_uuid,
                time: this.state.value
            }); // is this the only difference?    
        }
    };
    TimeForm.prototype.render = function () {
        return (React.createElement("div", null, !this.state.form
            ?
                React.createElement("div", { onClick: this.onBlur },
                    React.createElement("p", { className: 'alarm-time link-text' }, this.props.time))
            :
                React.createElement("form", { ref: this.setWrapperRef, onSubmit: this.handleSubmit, onBlur: this.onBlur },
                    React.createElement("input", { type: 'time', className: 'link-text-form alarm-time', value: this.state.value, onChange: this.handleChange, style: this.state.formStyle }))));
    };
    return TimeForm;
}(React.Component));
var TitleForm = /** @class */ (function (_super) {
    __extends(TitleForm, _super);
    function TitleForm(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            value: _this.props.title,
            form: false,
            formStyle: {
                width: TitleForm.calcWidth(_this.props.title.length)
            },
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.onBlur = _this.onBlur.bind(_this);
        _this.setWrapperRef = _this.setWrapperRef.bind(_this);
        _this.handleClickOutside = _this.handleClickOutside.bind(_this);
        return _this;
    }
    TitleForm.prototype.componentDidMount = function () {
        document.addEventListener('mousedown', this.handleClickOutside);
    };
    TitleForm.prototype.componentWillUnmount = function () { document.removeEventListener('mousedown', this.handleClickOutside); };
    TitleForm.prototype.onBlur = function () {
        this.setState({
            form: !this.state.form,
            value: this.props.title // changed
        });
    };
    TitleForm.prototype.setWrapperRef = function (node) { this.wrapperRef = node; };
    TitleForm.prototype.handleClickOutside = function (event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.handleSubmit(event);
            this.onBlur();
        }
    };
    TitleForm.calcWidth = function (chars) {
        if (chars < 5) {
            return ('30px');
        }
        else {
            return ((chars * 6) + 'px');
        }
    };
    TitleForm.prototype.handleChange = function (event) {
        this.setState({
            value: event.target.value,
            formStyle: {
                width: TitleForm.calcWidth(event.target.value.length)
            }
        });
    };
    TitleForm.prototype.handleSubmit = function (event) {
        event.preventDefault();
        this.props.postTitle({
            alarm_uuid: this.props.alarm_uuid,
            title: this.state.value
        }); // is this the only difference?    
    };
    TitleForm.prototype.render = function () {
        return (React.createElement("div", null, !this.state.form
            ?
                React.createElement("div", { onClick: this.onBlur },
                    React.createElement("p", { className: 'alarm-title small-text link-text' }, this.props.title ? this.props.title : 'add title')) //changed class and property
            :
                React.createElement("form", { ref: this.setWrapperRef, onSubmit: this.handleSubmit, onBlur: this.onBlur },
                    React.createElement("input", { type: 'text', className: 'link-text-form alarm-title small-text small-form', value: this.state.value, onChange: this.handleChange, style: this.state.formStyle }))));
    };
    return TitleForm;
}(React.Component));
//# sourceMappingURL=alarm-list.js.map