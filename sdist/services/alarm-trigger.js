"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// DATABASE
var pg = require("pg");
var queries_1 = require("../data-access/queries");
// HELPERS
var time_helpers_1 = require("../services/time-helpers");
var AlarmTrigger = /** @class */ (function () {
    function AlarmTrigger(dbInfo) {
        this.dbInfo = dbInfo;
    }
    AlarmTrigger.prototype.init = function () {
        var _this = this;
        var pool = new pg.Pool(this.dbInfo);
        pool.connect()
            .then(function (client) {
            _this.querySvc = new queries_1.default(client);
            return _this.querySvc;
        })
            .catch(function (e) {
            console.log('error connecting to pool in alarm');
            console.log(e);
            return e;
        });
    };
    AlarmTrigger.prototype.snoozing = function (alarm) {
        var _this = this;
        console.log('snoozing function called');
        return this.querySvc.getUserSettings([alarm.user_uuid])
            .then(function (settings) {
            var snoozeStart = _this.now();
            var snoozer = setInterval(function () {
                _this.querySvc.getAlarmState([alarm.alarm_uuid])
                    .then(function (state) {
                    if (state === 'ringing') {
                        console.log('snoozing, ringing');
                        _this.ringing(alarm);
                        clearInterval(snoozer);
                    }
                    else if (state === 'snoozing') {
                        console.log('snoozing, snoozing');
                        console.log('SNOOZE COUNTDOWN', (snoozeStart + Math.floor(settings.snooze_length)) - _this.now());
                        if (snoozeStart + Math.floor(settings.snooze_length) <= _this.now()) {
                            _this.querySvc.updateAlarmState(['ringing', alarm.alarm_uuid]);
                            _this.ringing(alarm);
                            clearInterval(snoozer);
                        }
                    }
                    else if (state === 'pending') {
                        clearInterval(snoozer);
                        console.log('snoozing, pending');
                    }
                    else {
                        throw new Error('State is not correct');
                    }
                })
                    .catch(function (e) { return console.log(e); });
            }, 1000);
        });
    };
    AlarmTrigger.prototype.ringing = function (alarm) {
        var _this = this;
        return this.querySvc.getUserSettings([alarm.user_uuid])
            .then(function (settings) {
            var ringStart = _this.now();
            var ringer = setInterval(function () {
                _this.querySvc.getAlarmState([alarm.alarm_uuid])
                    .then(function (state) {
                    if (state === 'ringing') {
                        console.log('ringing, ringing');
                        console.log('RING COUNTDOWN', (ringStart + Math.floor(settings.quiet_after)) - _this.now());
                        if (ringStart + Math.floor(settings.quiet_after) <= _this.now()) {
                            _this.querySvc.updateAlarmState(['pending', alarm.alarm_uuid])
                                .then(function () { return _this.querySvc.insertDismiss([alarm.alarm_uuid, alarm.user_uuid]); })
                                .then(function () { return clearInterval(ringer); })
                                .catch(function (e) { return console.log(e); });
                        }
                    }
                    else if (state === 'snoozing') {
                        console.log('ringing, snoozing');
                        _this.snoozing(alarm);
                        clearInterval(ringer);
                    }
                    else if (state === 'pending') {
                        console.log('ringing, pending');
                        clearInterval(ringer);
                    }
                    else {
                        throw new Error('State is not correct');
                    }
                })
                    .catch(function (e) { return console.log(e); });
            }, 1000);
        })
            .catch(function (e) { return console.log(e); });
    };
    AlarmTrigger.prototype.matchTime = function (alarms) {
        var _this = this;
        var _loop_1 = function (i) {
            var time = time_helpers_1.default.parseStringTime(alarms[i].time), now = this_1.now(), alarm = alarms[i];
            if (time === now) {
                console.log('-----STARTS RINGING!!!------');
                this_1.querySvc.updateAlarmState(['ringing', alarm.alarm_uuid])
                    .then(function () { return _this.snoozing(alarm); })
                    .catch(function (e) { return console.log(e); });
            }
        };
        var this_1 = this;
        for (var i = 0; i < alarms.length; i++) {
            _loop_1(i);
        }
    };
    AlarmTrigger.prototype.now = function () {
        var t = new time_helpers_1.TimeConverter();
        return t.parse(t.timeUTC);
    };
    AlarmTrigger.prototype.start = function () {
        var _this = this;
        this.init();
        setInterval(function () {
            _this.querySvc.getAllActiveAlarms([])
                .then(function (alarms) { return _this.matchTime(alarms); })
                .catch(function (e) { return console.log(e); });
        }, 1000);
    };
    return AlarmTrigger;
}());
exports.default = AlarmTrigger;
//# sourceMappingURL=alarm-trigger.js.map