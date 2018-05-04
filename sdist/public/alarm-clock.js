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
var react_sound_1 = require("react-sound");
var actions_1 = require("./actions");
var actions_alarm_1 = require("./actions-alarm");
var alarm_list_1 = require("./alarm-list");
var react_redux_1 = require("react-redux");
var time_helpers_1 = require("../services/time-helpers");
var Clock = /** @class */ (function (_super) {
    __extends(Clock, _super);
    //
    function Clock(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            date: new Date(),
            time: '',
            showControls: false,
            value: ''
        };
        return _this;
    }
    Clock.prototype.componentDidMount = function () {
        var _this = this;
        this.timerID = setInterval(function () {
            _this.props.updateAlarms();
            return _this.tick();
        }, 1000);
    };
    Clock.prototype.tick = function () {
        var now = this.state.date.toLocaleTimeString('en-US', { hour12: false });
        for (var i = 0; i < this.props.alarms.length; i++) {
            if (now === this.props.alarms[i].time) {
                this.setState({
                    showControls: true
                });
            }
        }
        this.setState({
            date: new Date()
        });
    };
    Clock.prototype.render = function () {
        var messages = this.props.alarms.map(function (alarm) {
            if (alarm.state === 'ringing') {
                return React.createElement(AlarmController, { alarm: alarm, key: alarm.id });
            }
        });
        var error;
        if (this.props.error && this.props.error !== 'dismissed') {
            error = React.createElement("div", { className: "test-error" },
                React.createElement("h1", { className: "textError" }, "Error"),
                React.createElement("p", { className: "textError one-item-spacing" }, this.props.error),
                React.createElement("button", { className: 'button dark-button', onClick: this.props.clearError }, "got it"));
        }
        return (React.createElement("div", null,
            React.createElement("div", { className: 'clock' },
                React.createElement("h1", null, this.state.date.toLocaleTimeString('en-US', { hour12: false }))),
            React.createElement("div", { className: 'alarm-controllers-wrapper' }, messages),
            React.createElement(alarm_list_1.AlarmList, { alarms: this.props.alarms, postTime: this.props.postTime, postTitle: this.props.postTitle, toggleActive: this.props.toggleActive, archiveAlarm: this.props.archiveAlarm }),
            React.createElement(AddAlarmForm, { postAlarm: this.props.postAlarm }),
            error));
    };
    return Clock;
}(React.Component));
var AlarmController = /** @class */ (function (_super) {
    __extends(AlarmController, _super);
    function AlarmController(props) {
        var _this = _super.call(this, props) || this;
        _this.style = 'alarm-control-wrapper';
        _this.alarm = _this.props.alarm;
        return _this;
    }
    AlarmController.prototype.render = function () {
        if (this.alarm.state === 'ringing') {
            this.style = 'alarm-control-wrapper';
        }
        var dismissRoute = "/app/accounts/" + this.alarm.user_uuid + "/alarms/" + this.alarm.alarm_uuid + "/dismiss";
        var snoozeRoute = "/app/accounts/" + this.alarm.user_uuid + "/alarms/" + this.alarm.alarm_uuid + "/snooze";
        return (React.createElement("div", { className: this.style },
            React.createElement("h1", null,
                this.alarm.state,
                "!!!"),
            React.createElement("p", null, this.alarm.title),
            React.createElement("p", null, this.alarm.time),
            React.createElement("div", { className: 'alarm-control-button-wrapper' },
                React.createElement("form", { action: dismissRoute, method: "POST" },
                    React.createElement("input", { className: "button light-button", type: 'submit', value: 'dismiss' }),
                    React.createElement("input", { name: "alarm_uuid", type: "hidden", value: this.alarm.alarm_uuid })),
                React.createElement(MathProblem, { alarm: this.alarm }),
                React.createElement("form", { action: snoozeRoute, method: "POST" },
                    React.createElement("input", { className: "button light-button", type: 'submit', value: 'snooze' }),
                    React.createElement("input", { name: "alarm_uuid", type: "hidden", value: this.alarm.alarm_uuid }))),
            React.createElement(react_sound_1.default, { url: "/sounds/ring-song.mp3", playStatus: react_sound_1.default.status.PLAYING })));
    };
    return AlarmController;
}(React.Component));
var MathProblem = /** @class */ (function (_super) {
    __extends(MathProblem, _super);
    function MathProblem(props) {
        var _this = _super.call(this, props) || this;
        _this.randomNumber = function () { return Math.floor((Math.random() * 20)); };
        _this.state = {
            value: '',
            answer: 0,
            showWakeButton: false,
            one: _this.randomNumber(),
            two: _this.randomNumber(),
            three: _this.randomNumber(),
        };
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }
    MathProblem.prototype.handleChange = function (event) {
        this.setState({ value: event.target.value });
    };
    MathProblem.prototype.handleSubmit = function (event) {
        event.preventDefault();
        if (parseInt(this.state.value) === this.state.answer) {
            this.setState({
                showWakeButton: true
            });
        }
    };
    MathProblem.prototype.render = function () {
        this.state.answer = this.state.one + this.state.two + this.state.three;
        if (this.state.showWakeButton) {
            var wakeRoute = "/app/accounts/" + this.props.alarm.user_uuid + "/alarms/" + this.props.alarm.alarm_uuid + "/wake";
            return (React.createElement("form", { action: wakeRoute, method: "POST" },
                React.createElement("input", { className: "button light-button", type: 'submit', value: 'wake' }),
                React.createElement("input", { name: "alarm_uuid", type: "hidden", value: this.props.alarm.alarm_uuid })));
        }
        return (React.createElement("div", null,
            React.createElement("p", null, "find the sum"),
            React.createElement("p", null,
                this.state.one,
                " + ",
                this.state.two,
                " + ",
                this.state.three,
                " ="),
            React.createElement("form", { onSubmit: this.handleSubmit },
                React.createElement("input", { type: 'text', className: 'big-form-item', value: this.state.value, onChange: this.handleChange }),
                React.createElement("input", { type: "submit", value: "Submit", className: 'button dark-button' }))));
    };
    return MathProblem;
}(React.Component));
var AddAlarmForm = /** @class */ (function (_super) {
    __extends(AddAlarmForm, _super);
    function AddAlarmForm(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            form: false,
            title: '',
            time: '',
            buttonStyle: ''
        };
        _this.handleChange = _this.handleChange.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.openForm = _this.openForm.bind(_this);
        return _this;
    }
    AddAlarmForm.prototype.openForm = function () {
        if (this.state.form) {
            this.setState({
                buttonStyle: '',
                form: false
            });
        }
        else {
            this.setState({
                buttonStyle: 'rotate-right',
                form: true
            });
        }
    };
    AddAlarmForm.prototype.handleChange = function (event) {
        this.setState((_a = {}, _a[event.target.name] = event.target.value, _a));
        var _a;
    };
    AddAlarmForm.prototype.handleSubmit = function (event) {
        event.preventDefault();
        var t = new time_helpers_1.TimeConverter();
        var value = t.fromUserInput(this.state.time);
        console.log('v', value);
        console.log('a', t.convert(value, false));
        this.props.postAlarm({
            title: this.state.title,
            time: t.convert(value, false)
        });
        this.setState({
            form: false,
            title: '',
            time: '',
            buttonStyle: ''
        });
    };
    AddAlarmForm.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("div", { className: this.state.form ? 'curtain' : '' }),
            React.createElement("div", { className: this.state.form ? "flex column popup-form" : "flex column popup-form-pre" },
                this.state.form
                    ?
                        React.createElement("div", { className: "add-alarm" },
                            React.createElement("h1", { className: 'light-text' }, "add alarm"),
                            React.createElement("form", { onSubmit: this.handleSubmit },
                                React.createElement("input", { name: "time", className: "link-text-form alarm-time special", type: "text", placeholder: "06:00", value: this.state.time, onChange: this.handleChange }),
                                React.createElement("input", { name: "title", className: "link-text-form alarm-time special", type: "text", placeholder: "work week", value: this.state.title, onChange: this.handleChange }),
                                React.createElement("button", { className: "button light-button", type: "submit" }, " submit ")))
                    :
                        React.createElement("div", { className: "add-alarm-placeholder" }),
                React.createElement("div", { className: "fixed-center-wrapper" + " " + this.state.buttonStyle, onClick: this.openForm },
                    React.createElement("img", { src: '/icons/white/plus.svg', className: 'icon add-alarm-icon' })))));
    };
    return AddAlarmForm;
}(React.Component));
var mapStateToProps = function (state) {
    return {
        alarms: state.userData.alarms,
        error: state.userData.error
    };
};
var mapDispatchToProps = function (dispatch, ownProps) {
    return {
        updateAlarms: function () { return dispatch(actions_alarm_1.fetchAlarms()); },
        postTime: function (v) { return dispatch(actions_alarm_1.fetchNewTime(v)); },
        postTitle: function (v) { return dispatch(actions_alarm_1.fetchAlarmTitle(v)); },
        toggleActive: function (v) { return dispatch(actions_alarm_1.fetchActiveToggle(v)); },
        postAlarm: function (v) { return dispatch(actions_alarm_1.fetchNewAlarm(v)); },
        archiveAlarm: function (v) { return dispatch(actions_alarm_1.fetchAlarmArchive(v)); },
        clearError: function () { return dispatch(actions_1.clearError()); },
    };
};
exports.AlarmClock = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Clock);
//# sourceMappingURL=alarm-clock.js.map