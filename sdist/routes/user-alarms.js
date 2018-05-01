"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var error_handling_1 = require("../services/error-handling");
var logic_alarms_1 = require("../logic/logic-alarms");
var alarms = express.Router();
// YINSO ADDITIONS FOR REDIRECT WITH QUERY OBJECT, LIMITED BY SIZE OF QUERY, put info into sessions may be preferable
alarms.route('/')
    .post(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.addAlarm()
        .then(function () { return res.redirect('/app/accounts/' + req.session.user.email + '/alarms'); })
        .catch(function (err) {
        console.log(err);
        res.render('alarms/new-alarm', { dbError: error_handling_1.dbErrTranslator(err) });
    });
})
    .get(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, null);
    req.AlarmSvc.getUserAlarms()
        .then(function (alarms) {
        res.render('alarms/alarms', {
            alarmContent: alarms,
            email: req.session.user.email
        });
    })
        .catch(function (err) {
        console.log(err);
        res.render('error', {
            errName: err.message,
            errMessage: null
        });
    });
})
    .delete(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, null);
    req.AlarmSvc.deleteAllAlarms()
        .then(function (time) { return res.redirect('/app/accounts/' + req.session.user.email + '/alarms'); })
        .catch(function (e) {
        console.log(e);
        res.render('error', { error: e });
    });
});
alarms.get('/new-alarm', function (req, res, next) {
    res.render('alarms/new-alarm');
});
// CHANGE TIME
// (USING HEADERS NOW TO DIFRENTIAYE TYPE OF RES)
alarms.route('/:alarm_uuid/time')
    .get(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.query);
    req.AlarmSvc.getAlarm()
        .then(function (alarm) {
        res.render('alarms/time', alarm);
    })
        .catch(function (e) {
        console.log(e);
        res.render('error', { error: e });
    });
})
    .put(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.updateAlarmTime()
        .then(function (alarms) {
        if (req.headers.test) {
            return res.json(alarms);
        }
        else {
            return res.redirect('/app/accounts/' + req.session.user.email + '/alarms');
        }
    })
        .catch(function (e) {
        console.log(e);
        res.render('error', { errMessage: error_handling_1.dbErrTranslator(e) });
    });
});
// !! TRYING NOT TO USE
alarms.route('/:alarm_uuid/time/api')
    .put(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.updateAlarmTime()
        .then(function () { return req.AlarmSvc.getUserAlarms(); })
        .then(function (alarms) { return res.json(alarms); })
        .catch(function (e) {
        res.json({
            'error': e,
            'status': "failed"
        });
    });
});
// CHANGE TITLE
alarms.route('/:alarm_uuid/title')
    .get(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.query);
    req.AlarmSvc.getAlarm()
        .then(function (alarm) {
        res.render('alarms/title', alarm);
    })
        .catch(function (e) {
        console.log(e);
        res.render('error', { errMessage: e });
    });
})
    .put(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.updateAlarmTitle()
        .then(function (time) { return res.redirect('/app/accounts/' + req.session.user.email + '/alarms'); })
        .catch(function (e) {
        console.log(e);
        res.render('error', { errMessage: e });
    });
});
// TOGGLE ACTIVE
alarms.route('/:alarm_uuid/active').put(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.toggleActiveAlarm()
        .then(function () { return res.redirect('/app/accounts/' + req.session.user.email + '/alarms'); })
        .catch(function (e) {
        console.log(e);
        res.render('error', { errMessage: e });
    });
});
// CHANGE DAYS OF WEEK SECTION
alarms.route('/:alarm_uuid/days-of-week')
    .get(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.query);
    req.AlarmSvc.getAlarm()
        .then(function (alarm) { return res.render('alarms/days-of-week', alarm); })
        .catch(function (e) {
        console.log(e);
        res.render('error', { errMessage: e });
    });
})
    .put(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.updateDaysOfWeek()
        .then(function (daysOfWeek) { return res.redirect('/app/accounts/' + req.session.user.email + '/alarms'); })
        .catch(function (e) {
        console.log(e);
        res.render('error', { errMessage: e });
    });
});
// ARCHIVE ALARM
alarms.route('/:alarm_uuid')
    .delete(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.archiveAlarm()
        .then(function (result) {
        res.redirect('/app/accounts/' + req.session.user.email + '/alarms');
    })
        .catch(function (e) {
        console.log(e);
        res.render('error', { errMessage: e });
    });
});
// alarm functionality
alarms.post('/:alarm_uuid/snooze', function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.snooze()
        .then(function (result) {
        res.redirect('/app/accounts/' + req.session.user.email + '/alarms');
    })
        .catch(function (e) {
        console.log(e);
        res.render('error', { errMessage: e });
    });
});
alarms.post('/:alarm_uuid/dismiss', function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.dismiss()
        .then(function (result) {
        res.redirect('/app/accounts/' + req.session.user.email + '/alarms');
    })
        .catch(function (e) {
        console.log(e);
        res.render('error', { errMessage: e });
    });
});
alarms.post('/:alarm_uuid/wake', function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.wake()
        .then(function (result) {
        res.redirect('/app/accounts/' + req.session.user.email + '/alarms');
    })
        .catch(function (e) {
        console.log(e);
        res.render('error', { errMessage: e });
    });
});
exports.default = alarms;
//# sourceMappingURL=user-alarms.js.map