"use strict";
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////AA///////PPPPP/////IIIIIIII////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AAAAAAA/////PPPP/////////II///////////////
//////////AA///AA/////PP///////////II///////////////
//////////AA///AA/////PP////////IIIIIIII////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var error_handling_1 = require("../services/error-handling");
var logic_alarms_1 = require("../logic/logic-alarms");
var alarmsAPI = express.Router();
// YINSO ADDITIONS FOR REDIRECT WITH QUERY OBJECT, LIMITED BY SIZE OF QUERY, put info into sessions may be preferable
alarmsAPI.route('/api')
    .post(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.addAlarm()
        .then(function () { return req.AlarmSvc.getUserAlarms(); })
        .then(function (alarms) { return res.json(alarms); })
        .catch(function (e) {
        res.json({
            'error': e,
            'status': "failed",
            'route': '/:alarm_uuid/time/api'
        });
    });
})
    .get(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, null);
    req.AlarmSvc.getUserAlarms()
        .then(function (alarms) {
        res.json(alarms);
    })
        .catch(function (err) {
        console.log(err);
        res.json({
            'error': err,
            'status': "failed"
        });
    });
});
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////AA///////PPPPP/////IIIIIIII////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AAAAAAA/////PPPP/////////II///////////////
//////////AA///AA/////PP///////////II///////////////
//////////AA///AA/////PP////////IIIIIIII////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
alarmsAPI.route('/')
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
        .then(function (alarms) { return res.redirect('/app/accounts/' + req.session.user.email + '/alarms'); })
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
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////AA///////PPPPP/////IIIIIIII////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AAAAAAA/////PPPP/////////II///////////////
//////////AA///AA/////PP///////////II///////////////
//////////AA///AA/////PP////////IIIIIIII////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
alarmsAPI.get('/new-alarm/api', function (req, res) { return res.redirect('/app/accounts/' + req.session.user.email + '/alarms/new-alarm'); });
// CHANGE TIME
alarmsAPI.route('/:alarm_uuid/time/api')
    .put(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body); //
    req.AlarmSvc.updateAlarmTime()
        .then(function () { return req.AlarmSvc.getUserAlarms(); })
        .then(function (alarms) { return res.json(alarms); })
        .catch(function (e) {
        res.json({
            'error': e,
            'status': "failed",
            'route': '/:alarm_uuid/time/api'
        });
    });
});
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////AA///////PPPPP/////IIIIIIII////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AAAAAAA/////PPPP/////////II///////////////
//////////AA///AA/////PP///////////II///////////////
//////////AA///AA/////PP////////IIIIIIII////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// CHANGE TITLE
alarmsAPI.route('/:alarm_uuid/title/api').put(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.updateAlarmTitle()
        .then(function () { return req.AlarmSvc.getUserAlarms(); })
        .then(function (alarms) { return res.json(alarms); })
        .catch(function (e) {
        res.json({
            'error': e,
            'status': "failed",
            'route': '/:alarm_uuid/time/api'
        });
    });
});
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////AA///////PPPPP/////IIIIIIII////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AAAAAAA/////PPPP/////////II///////////////
//////////AA///AA/////PP///////////II///////////////
//////////AA///AA/////PP////////IIIIIIII////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// TOGGLE ACTIVE
alarmsAPI.route('/:alarm_uuid/active/api').put(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.toggleActiveAlarm()
        .then(function () { return req.AlarmSvc.getUserAlarms(); })
        .then(function (alarms) { return res.json(alarms); })
        .catch(function (e) {
        res.json({
            'error': e,
            'status': "failed",
            'route': '/:alarm_uuid/time/api'
        });
    });
});
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////AA///////PPPPP/////IIIIIIII////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AAAAAAA/////PPPP/////////II///////////////
//////////AA///AA/////PP///////////II///////////////
//////////AA///AA/////PP////////IIIIIIII////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// CHANGE DAYS OF WEEK SECTION
alarmsAPI.route('/:alarm_uuid/days-of-week')
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
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////AA///////PPPPP/////IIIIIIII////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AAAAAAA/////PPPP/////////II///////////////
//////////AA///AA/////PP///////////II///////////////
//////////AA///AA/////PP////////IIIIIIII////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// ARCHIVE ALARM
alarmsAPI.route('/:alarm_uuid/api').delete(function (req, res) {
    req.AlarmSvc = new logic_alarms_1.default(req.querySvc, req.session.user, req.body);
    req.AlarmSvc.archiveAlarm()
        .then(function () { return req.AlarmSvc.getUserAlarms(); })
        .then(function (alarms) { return res.json(alarms); })
        .catch(function (e) {
        res.json({
            'error': e,
            'status': "failed",
            'route': '/:alarm_uuid/time/api'
        });
    });
});
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////AA///////PPPPP/////IIIIIIII////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AAAAAAA/////PPPP/////////II///////////////
//////////AA///AA/////PP///////////II///////////////
//////////AA///AA/////PP////////IIIIIIII////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
// alarm functionality
alarmsAPI.post('/:alarm_uuid/snooze', function (req, res) {
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
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////AA///////PPPPP/////IIIIIIII////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AAAAAAA/////PPPP/////////II///////////////
//////////AA///AA/////PP///////////II///////////////
//////////AA///AA/////PP////////IIIIIIII////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
alarmsAPI.post('/:alarm_uuid/dismiss', function (req, res) {
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
////////////////////////////////////////////////////
////////////////////////////////////////////////////
/////////////AA///////PPPPP/////IIIIIIII////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AA///AA/////PP//PP///////II///////////////
//////////AAAAAAA/////PPPP/////////II///////////////
//////////AA///AA/////PP///////////II///////////////
//////////AA///AA/////PP////////IIIIIIII////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
alarmsAPI.post('/:alarm_uuid/wake', function (req, res) {
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
exports.default = alarmsAPI;
//# sourceMappingURL=user-alarms-api.js.map