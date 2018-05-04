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




import * as express from 'express';
import { dbErrTranslator } from '../services/error-handling';
import AlarmSvc from '../logic/logic-alarms';
const alarmsAPI = express.Router();

// YINSO ADDITIONS FOR REDIRECT WITH QUERY OBJECT, LIMITED BY SIZE OF QUERY, put info into sessions may be preferable
import * as url from 'url';
import * as qs from 'querystring';
import * as React from 'react';
// YINSO ADDITIONS FOR REDIRECT WITH QUERY OBJECT, LIMITED BY SIZE OF QUERY, put info into sessions may be preferable

alarmsAPI.route('/api')
  .post((req, res) => {
    req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.body)

    req.AlarmSvc.addAlarm()
      .then(() => req.AlarmSvc.getUserAlarms())
      .then(alarms => res.json(alarms))
      .catch(e => {
        res.json(
          {
            'error': e,
            'status': "failed",
            'route': '/:alarm_uuid/time/api'
          }
        );
      })
  })
  .get((req, res) => {
    req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, null)

    req.AlarmSvc.getUserAlarms()
      .then((alarms) => {
        res.json(alarms)
      })
      .catch((err) => {
        console.log(err)
        res.json(
          {
            'error': err,
            'status': "failed"
          }
        );
      });
  })

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
  .post((req, res) => {
    req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.body)

    req.AlarmSvc.addAlarm()
      .then(() => res.redirect('/app/accounts/' + req.session.user.email + '/alarms'))
      .catch((err) => {
        console.log(err)
        res.render('alarms/new-alarm', { dbError: dbErrTranslator(err) });
      });
  })
  .get((req, res) => {
    req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, null)

    req.AlarmSvc.getUserAlarms()
      .then((alarms) => res.redirect('/app/accounts/' + req.session.user.email + '/alarms'))
      .catch((err) => {
        console.log(err)
        res.render('error', {
          errName: err.message,
          errMessage: null
        });
      });
  })
  .delete((req, res) => {
    req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, null)

    req.AlarmSvc.deleteAllAlarms()
      .then(time => res.redirect('/app/accounts/' + req.session.user.email + '/alarms'))
      .catch(e => {
        console.log(e)
        res.render('error', { error: e })
      })
  })

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

alarmsAPI.get('/new-alarm/api', (req, res) => res.redirect('/app/accounts/' + req.session.user.email + '/alarms/new-alarm'))

// CHANGE TIME

alarmsAPI.route('/:alarm_uuid/time/api')
  .put((req, res) => {
    req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.body)//
    req.AlarmSvc.updateAlarmTime()
      .then(() => req.AlarmSvc.getUserAlarms())
      .then(alarms => res.json(alarms))
      .catch(e => {
        res.json(
          {
            'error': e,
            'status': "failed",
            'route': '/:alarm_uuid/time/api'
          }
        );
      })
  })
  

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

alarmsAPI.route('/:alarm_uuid/title/api').put((req, res) => {
      req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.body)
      req.AlarmSvc.updateAlarmTitle()
        .then(() => req.AlarmSvc.getUserAlarms())
        .then(alarms => res.json(alarms))
        .catch(e => {
          res.json(
            {
              'error': e,
              'status': "failed",
              'route': '/:alarm_uuid/time/api'
            }
          );
        })
    })
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

alarmsAPI.route('/:alarm_uuid/active/api').put((req, res) => {
  req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.body)
  req.AlarmSvc.toggleActiveAlarm()
    .then(() => req.AlarmSvc.getUserAlarms())
    .then(alarms => res.json(alarms))
    .catch(e => {
      res.json(
        {
          'error': e,
          'status': "failed",
          'route': '/:alarm_uuid/time/api'
        }
      );
    })
})
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
    .get((req, res) => {
      req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.query)      
      req.AlarmSvc.getAlarm()
        .then(alarm => res.render('alarms/days-of-week', alarm))
        .catch(e => {
          console.log(e)
          res.render('error', {errMessage:e})
        })
    })
    .put((req, res) => {
      req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.body)
      req.AlarmSvc.updateDaysOfWeek()
        .then(daysOfWeek => res.redirect('/app/accounts/' + req.session.user.email + '/alarms'))
        .catch(e => {
          console.log(e)
          res.render('error', {errMessage:e})
        })
    })
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

alarmsAPI.route('/:alarm_uuid/api').delete((req, res) => {
    req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.body)
    req.AlarmSvc.archiveAlarm()
      .then(() => req.AlarmSvc.getUserAlarms())
      .then(alarms => res.json(alarms))
      .catch(e => {
        res.json(
          {
            'error': e,
            'status': "failed",
            'route': '/:alarm_uuid/time/api'
          }
        );
      })
  })

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

alarmsAPI.post('/:alarm_uuid/snooze', (req, res) => {
  req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.body)

  req.AlarmSvc.snooze()
    .then((result) => {
      res.redirect('/app/accounts/' + req.session.user.email + '/alarms');
    })
    .catch(e => {
      console.log(e)
      res.render('error', { errMessage: e })
    })
})
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
alarmsAPI.post('/:alarm_uuid/dismiss', (req, res) => {
  req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.body)

  req.AlarmSvc.dismiss()
    .then((result) => {
      res.redirect('/app/accounts/' + req.session.user.email + '/alarms');
    })
    .catch(e => {
      console.log(e)
      res.render('error', { errMessage: e })
    })
})
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
alarmsAPI.post('/:alarm_uuid/wake', (req, res) => {
  req.AlarmSvc = new AlarmSvc(req.querySvc, req.session.user, req.body)

  req.AlarmSvc.wake()
    .then((result) => {
      res.redirect('/app/accounts/' + req.session.user.email + '/alarms');
    })
    .catch(e => {
      console.log(e)
      res.render('error', { errMessage: e })
    })
})


export default alarmsAPI;
