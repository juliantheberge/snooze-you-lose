"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("./actions");
// GET ALARMS FOR TICKER
exports.REQ_ALARM = 'REQ_ALARM';
exports.RES_ALARM = 'RES_ALARM';
function reqAlarms() {
    return {
        type: exports.REQ_ALARM,
    };
}
exports.reqAlarms = reqAlarms;
function recieveAlarms(alarms) {
    return {
        type: exports.RES_ALARM,
        alarms: alarms
    };
}
function fetchAlarms() {
    return function (dispatch) {
        dispatch(reqAlarms());
        return fetch('/app/accounts/:email/alarms/api', {
            method: 'get',
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
            .then(function (res) { return res.json(); })
            .then(function (alarms) { return dispatch(recieveAlarms(alarms)); })
            .catch(function (e) { return console.log(e); });
    };
}
exports.fetchAlarms = fetchAlarms;
// ADD ALARM
exports.REQ_NEW_ALARM = 'REQ_NEW_ALARM';
exports.RES_NEW_ALARM = 'RES_NEW_ALARM';
function reqNewAlarm(v) {
    return { type: exports.REQ_NEW_ALARM };
}
exports.reqNewAlarm = reqNewAlarm;
function recieveNewAlarm(alarms) {
    return {
        type: exports.RES_NEW_ALARM,
        alarms: alarms
    };
}
function fetchNewAlarm(v) {
    return function (dispatch) {
        dispatch(reqNewAlarm(v));
        return fetch("/app/accounts/:email/alarms/api", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(v)
        })
            .then(function (res) { return res.json(); })
            .then(function (alarms) {
            if (alarms.status === 'failed') {
                return dispatch(actions_1.recieveError(alarms, dispatch));
            }
            dispatch(recieveNewAlarm(alarms));
        });
    };
}
exports.fetchNewAlarm = fetchNewAlarm;
// TIME CHANGE
exports.REQ_TIME_CHANGE = 'REQ_TIME_CHANGE';
exports.RES_TIME_CHANGE = 'RES_TIME_CHANGE';
function reqNewTime(v) {
    return { type: exports.REQ_TIME_CHANGE };
}
exports.reqNewTime = reqNewTime;
function recieveNewTime(alarms) {
    return {
        type: exports.RES_TIME_CHANGE,
        alarms: alarms
    };
}
function fetchNewTime(v) {
    return function (dispatch) {
        dispatch(reqNewTime(v));
        return fetch("/app/accounts/:email/alarms/:alarm_uuid/time/api?_method=PUT", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(v)
        })
            .then(function (res) { return res.json(); })
            .then(function (alarms) {
            if (alarms.status === 'failed') {
                return dispatch(actions_1.recieveError(alarms, dispatch));
            }
            dispatch(recieveNewTime(alarms));
        });
    };
}
exports.fetchNewTime = fetchNewTime;
// TOGGLE ACTIVE
exports.REQ_ACTIVE_TOGGLE = 'REQ_ACTIVE_TOGGLE';
exports.RES_ACTIVE_TOGGLE = 'RES_ACTIVE_TOGGLE';
function reqActiveToggle(v) {
    return { type: exports.REQ_ACTIVE_TOGGLE };
}
exports.reqActiveToggle = reqActiveToggle;
function recieveActiveToggle(alarms) {
    return {
        type: exports.RES_ACTIVE_TOGGLE,
        alarms: alarms
    };
}
function fetchActiveToggle(v) {
    return function (dispatch) {
        dispatch(reqActiveToggle(v));
        return fetch("/app/accounts/:email/alarms/:alarm_uuid/active/api?_method=PUT", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(v)
        })
            .then(function (res) { return res.json(); })
            .then(function (alarms) {
            if (alarms.status === 'failed') {
                return dispatch(actions_1.recieveError(alarms, dispatch));
            }
            dispatch(recieveActiveToggle(alarms));
        });
    };
}
exports.fetchActiveToggle = fetchActiveToggle;
// TITLE
exports.REQ_ALARM_TITLE = 'REQ_ALARM_TITLE';
exports.RES_ALARM_TITLE = 'RES_ALARM_TITLE';
function reqAlarmTitle(v) {
    return { type: exports.REQ_ALARM_TITLE };
}
exports.reqAlarmTitle = reqAlarmTitle;
function recieveAlarmTitle(alarms) {
    return {
        type: exports.RES_ACTIVE_TOGGLE,
        alarms: alarms
    };
}
function fetchAlarmTitle(v) {
    return function (dispatch) {
        dispatch(reqActiveToggle(v));
        return fetch("/app/accounts/:email/alarms/:alarm_uuid/title/api?_method=PUT", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(v)
        })
            .then(function (res) { return res.json(); })
            .then(function (alarms) {
            if (alarms.status === 'failed') {
                return dispatch(actions_1.recieveError(alarms, dispatch));
            }
            dispatch(recieveActiveToggle(alarms));
        });
    };
}
exports.fetchAlarmTitle = fetchAlarmTitle;
// ARCHIVE ALARMS
exports.REQ_ALARM_ARCHIVE = 'REQ_ALARM_ARCHIVE';
exports.RES_ALARM_ARCHIVE = 'RES_ALARM_ARCHIVE';
function reqAlarmArchive(v) {
    return { type: exports.REQ_ALARM_ARCHIVE };
}
exports.reqAlarmArchive = reqAlarmArchive;
function recieveAlarmArchive(alarms) {
    return {
        type: exports.RES_ALARM_ARCHIVE,
        alarms: alarms
    };
}
function fetchAlarmArchive(v) {
    return function (dispatch) {
        dispatch(reqAlarmArchive(v));
        return fetch("/app/accounts/:email/alarms/:alarm_uuid/api?_method=DELETE", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(v)
        })
            .then(function (res) { return res.json(); })
            .then(function (alarms) {
            if (alarms.status === 'failed') {
                return dispatch(actions_1.recieveError(alarms, dispatch));
            }
            dispatch(recieveAlarmArchive(alarms));
        });
    };
}
exports.fetchAlarmArchive = fetchAlarmArchive;
//# sourceMappingURL=actions-alarm.js.map