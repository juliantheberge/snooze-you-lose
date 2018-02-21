import { db } from '../middleware/database';
var EventEmitter = require('events').EventEmitter;
function addLeadingZeros(number) {
    if (number < 10) {
        return '0' + number.toString();
    }
    return number;
}
function theTime() {
    var clock = new Date();
    var h = addLeadingZeros(clock.getHours());
    var m = addLeadingZeros(clock.getMinutes());
    var s = addLeadingZeros(clock.getSeconds());
    return h + ':' + m + ':' + s;
}
var eventEmitter = new EventEmitter();
eventEmitter.on('ring', function () {
    console.log('ringing event');
});
eventEmitter.on('ringingCountdown', function () {
    console.log('ringing countdown');
});
function triggerAlarm(alarm, user) {
    db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['ringing', user.uuid, alarm]);
    then(function (result) {
        console.log(result);
    })
        .catch(function (error) {
        console.log(error);
    });
}
function addSnooze(alarm, user) {
    console.log('------YOU SNOOZED! Now you have a snooze, but dont snooze to much!------');
    db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['snoozing', user.uuid, alarm]);
    then(function (result) {
        return db.query('INSERT INTO snoozes(user_uuid, alarm_uuid) VALUES ($1, $2)', [user.uuid, alarm]);
    })
        .catch(function (error) {
        console.log(error);
    });
}
function addDismiss(alarm, user) {
    console.log('------YOU SLEPT IN! Now you have a dismiss under your belt.------');
    db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['dismissed', user.uuid, alarm])
        .then(function (result) {
        return db.query('INSERT INTO dismisses(user_uuid, alarm_uuid) VALUES ($1, $2)', [user.uuid, alarm]);
    })
        .catch(function (error) {
        console.log(error);
    });
}
function addWake(alarm, user) {
    console.log('------NICE JOB, YOU WORK UP! CARPE DIEM!------');
    db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['woke', user.uuid, alarm])
        .then(function (result) {
        return db.query('INSERT INTO wakes(user_uuid, alarm_uuid) VALUES ($1, $2)', [user.uuid, alarm]);
    })
        .catch(function (error) {
        console.log(error);
    });
}
function alarmReset(alarm, user) {
    db.query('UPDATE alarms SET state = $1 WHERE user_uuid = $2 AND alarm_uuid = $3', ['pending', user.uuid, alarm])
        .then(function (result) {
        console.log(result);
    })
        .catch(function (error) {
        console.log(error);
    });
}
function snoozing(alarm, user) {
    var currentTime = Date.now();
    var endTime = currentTime + 10000; // ten second snooze
    addSnooze(alarm, user);
    var thing = setInterval(function () {
        var timeLeft = endTime - Date.now();
        console.log('timeleft', timeLeft);
        db.query('SELECT state FROM alarms WHERE user_uuid = $1 AND alarm_uuid = $2', [user.uuid, alarm])
            .then(function (result) {
            var state = result.rows[0].state;
            console.log(state);
            if (state === 'snoozing') {
                if (timeLeft < 0) {
                    clearInterval(thing);
                    triggerAlarm(alarm, user);
                    ringing(alarm, user);
                }
            }
            else if (state === 'dismiss') {
                clearInterval(thing);
                addDismiss(alarm, user);
            }
            else if (state === 'woke') {
                clearInterval(thing);
                addWake(alarm, user);
            }
        });
    }, 1000);
}
function ringing(alarm, user) {
    var currentTime = Date.now();
    var endTime = currentTime + 6000;
    var thing = setInterval(function () {
        var timeLeft = endTime - Date.now();
        console.log('timeleft', timeLeft);
        db.query('SELECT state FROM alarms WHERE user_uuid = $1 AND alarm_uuid = $2', [user.uuid, alarm])
            .then(function (result) {
            var state = result.rows[0].state;
            console.log(state);
            if (state === 'ringing') {
                if (timeLeft < 0) {
                    clearInterval(thing);
                    addDismiss(alarm, user);
                }
            }
            else if (state === 'snoozing') {
                clearInterval(thing);
                snoozing(alarm, user);
            }
            else if (state === 'dismiss') {
                clearInterval(thing);
                addDismiss(alarm, user);
            }
            else if (state === 'woke') {
                clearInterval(thing);
                addWake(alarm, user);
            }
        });
    }, 1000);
}
function watchUserAlarms(user) {
    db.query('SELECT * FROM alarms WHERE user_uuid = $1 AND active = $2', [user.uuid, true]) // and active = true
        .then(function (result) {
        var alarms = result.rows;
        for (var i = 0; i < alarms.length; i++) {
            var time = alarms[i].time;
            var alarm = alarms[i].alarm_uuid;
            var state = alarms[i].state;
            if (time === theTime()) {
                if (state === 'pending') {
                    console.log('-----STARTS RINGING!!!------');
                    eventEmitter.emit('ring', triggerAlarm(alarm, user));
                    eventEmitter.emit('ringingCountdown', ringing(alarm, user));
                }
                else if (state === 'ringing') {
                    console.log('-----RINGING!!!------');
                }
                else if (state === 'snoozing') {
                    console.log('-----SNOOZING------');
                }
                else if (state === 'dismissed') {
                    console.log('-----DISMISSED------');
                }
                else if (state === 'woke') {
                    console.log('-----WAITING TO RESET------');
                }
            }
            else {
                if (state === 'woke') {
                    console.log('-----WOKE AND RESET------');
                    eventEmitter.emit('alarmReset', alarmReset(alarm, user));
                }
                else if (state === 'dismissed') {
                    console.log('-----DISMISSED AND RESET------');
                    eventEmitter.emit('alarmReset', alarmReset(alarm, user));
                }
                else if (state === 'snoozing') {
                    console.log('-----SNOOZING------');
                }
                else if (state === 'ringing') {
                    console.log('-----RINGING!!!------');
                }
            }
            console.log('ALARM: ', time, 'CURRENT TIME: ', theTime());
        }
    })
        .catch(function (error) {
        console.log(error);
    });
}
function watchAlarms(user) {
    setInterval(function () { watchUserAlarms(user); }, 1000);
}
export { watchAlarms };
//# sourceMappingURL=alarm.js.map