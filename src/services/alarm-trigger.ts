// VALIDATION
import * as V from '../services/validation';
import * as R from '../services/value-objects';
// DATABASE
import * as pg from 'pg';
import QuerySvc from '../data-access/queries'
// HELPERS
import TimeHelpers, { TimeConverter } from '../services/time-helpers'
import { AnalysisSchemeLanguage } from 'aws-sdk/clients/cloudsearch';
import AlarmsSvc from '../logic/logic-alarms';

export default class AlarmTrigger {
    querySvc:QuerySvc;
    dbInfo: pg.ConnectionConfig;
    date:Date;
    timeString:V.MilitaryTime;

    constructor(dbInfo) {
        this.dbInfo = dbInfo;
    }

    init():Promise<QuerySvc> {
        const pool = new pg.Pool(this.dbInfo)
        pool.connect()
            .then(client => {
                this.querySvc = new QuerySvc(client)
                return this.querySvc
            })
            .catch(e => {
                console.log('error connecting to pool in alarm')
                console.log(e)
                return e
            })
    }


    snoozing(alarm: R.AlarmDB) {
        console.log('snoozing function called')
        return this.querySvc.getUserSettings([alarm.user_uuid])
            .then(settings => {
                let snoozeStart = this.now()
                let snoozer = setInterval(() => {
                    this.querySvc.getAlarmState([alarm.alarm_uuid])
                        .then((state) => {
                            if (state === 'ringing') {
                                console.log('snoozing, ringing')
                                this.ringing(alarm)
                                clearInterval(snoozer)
                            } else if (state === 'snoozing') {
                                console.log('snoozing, snoozing')
                                console.log('SNOOZE COUNTDOWN', (snoozeStart + Math.floor(settings.snooze_length)) - this.now())
                                if (snoozeStart + Math.floor(settings.snooze_length)<= this.now()) {
                                    this.querySvc.updateAlarmState(['ringing', alarm.alarm_uuid])
                                    this.ringing(alarm)
                                    clearInterval(snoozer)
                                }
                            } else if (state === 'pending') {
                                clearInterval(snoozer)
                                console.log('snoozing, pending')
                            } else {
                                throw new Error('State is not correct')
                            }
                        })
                        .catch(e => console.log(e))
                }, 1000)
            })
    }


    ringing(alarm: R.AlarmDB) {
        console.log('ringing function called')
        return this.querySvc.getUserSettings([alarm.user_uuid])
            .then(settings => {
                let ringStart = this.now()
                let ringer = setInterval(() => {
                    this.querySvc.getAlarmState([alarm.alarm_uuid])
                        .then((state) => {
                            if (state === 'ringing') {
                                console.log('ringing, ringing')
                                console.log('RING COUNTDOWN', (ringStart + Math.floor(settings.quiet_after)) - this.now())
                                if (ringStart + Math.floor(settings.quiet_after) <= this.now() {
                                    this.querySvc.updateAlarmState(['pending', alarm.alarm_uuid])
                                        .then(() => this.querySvc.insertDismiss([alarm.alarm_uuid, alarm.user_uuid]))
                                        .then(() => clearInterval(ringer))
                                        .catch(e => console.log(e))
                                }
                            } else if (state === 'snoozing') {
                                console.log('ringing, snoozing')
                                this.snoozing(alarm)
                                clearInterval(ringer)
                            } else if (state === 'pending') {
                                console.log('ringing, pending')
                                clearInterval(ringer)
                            } else {
                                throw new Error('State is not correct')
                            }
                        })
                        .catch(e => console.log(e))
                }, 1000)
            })
            .catch(e => console.log(e))
    }


    matchTime(alarms:R.AlarmDB[]) {
        for (let i = 0; i < alarms.length; i++) {
            let time = TimeHelpers.parseStringTime(alarms[i].time),
                now = this.now(),
                alarm = alarms[i]

            if (time === now) {
                console.log('-----STARTS RINGING!!!------')
                this.querySvc.updateAlarmState(['ringing', alarm.alarm_uuid])
                    .then(() => this.snoozing(alarm))
                    .catch(e => console.log(e))   
            }
        }
    }

    now() {
        let t = new TimeConverter();
        console.log(t.timeUTC)
        return t.parse(t.timeUTC)
    }

    start() {
        this.init()
        setInterval(() => {
            this.querySvc.getAllActiveAlarms([])
                .then(alarms => this.matchTime(alarms))
                .catch(e => console.log(e))
        }, 1000)
    }
}