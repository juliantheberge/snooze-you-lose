import QuerySvc from '../data-access/queries';
import { deepMerge } from '../services/merge'
import * as R from '../services/value-objects';
import * as V from '../services/validation';
import { StorageGateway } from 'aws-sdk';
import TimeHelpers from '../services/time-helpers'

interface Alarm {
    user_uuid:V.UUID;
    title:string;
    active:boolean;
    alarm_uuid:V.UUID;
    state:string;
    time:string;
    triggered:boolean;
    mon:boolean;
    tues:boolean;
    wed:boolean;
    thur:boolean;
    fri:boolean;
    sat:boolean;
    sun:boolean;
}

interface DaysOfWeek {
    mon:boolean;
    tues:boolean;
    wed:boolean;
    thur:boolean;
    fri:boolean;
    sat:boolean;
    sun:boolean;
}

interface WeekRenderObj extends DaysOfWeek {
    alarm_uuid:V.UUID;
}

export default class AlarmsSvc {
    alarm: Alarm;
    querySvc: QuerySvc;
    user:R.UserSession;
    inputs: Alarm;

    constructor(querySvc, user, inputs) {
        this.alarm;
        this.inputs = inputs;
        this.user = user;
        this.querySvc = querySvc;
    }

    addAlarm():Promise<void> {
        return TimeHelpers.isMilitaryTime(this.inputs.time)
            .then(time => {
                return this.querySvc.insertAlarm([this.user.uuid, this.inputs.title, time])
            })
    }

    addTodayOrTomorrowIndicator(sortedAlarms):Alarm[] {
        let helper = new TimeHelpers()
        for (let i = 0; i < sortedAlarms.length; i++) {
            if (sortedAlarms[i].repeat) {
                sortedAlarms[i].nextAlarm = 'schedule below';
            } else {
                sortedAlarms[i].nextAlarm = helper.todayOrTomorrow(sortedAlarms[i].time)
            }
            
        }
        return sortedAlarms
    }

    removeArchived(alarms:R.AlarmDB[]) {
        let currentAlarms = []
        for (let i = 0; i < alarms.length; i++) {
            if (!alarms[i].archive) {
                currentAlarms.push(alarms[i])
            }
        }
        return currentAlarms;
    }

    getUserAlarms():Promise<Alarm[]> {
        return this.querySvc.getUserAlarms([this.user.uuid])
            .then(alarms => {
                let currentAlarms = this.removeArchived(alarms)
                let sortedAlarms = currentAlarms.sort(TimeHelpers.orderTimes)
                return this.addTodayOrTomorrowIndicator(sortedAlarms);
            })
    }

    getDaysOfWeek():Promise<DaysOfWeek> {
        return this.querySvc.getDaysOfWeek([this.inputs.alarm_uuid, this.user.uuid])
    }

    getAlarm():Promise<R.AlarmDB> {
        return this.querySvc.getUserAlarm([this.inputs.alarm_uuid, this.user.uuid])
    }
   
    updateAlarmTime():Promise<void> {
        return TimeHelpers.isMilitaryTime(this.inputs.time)
            .then(time => {
                return this.querySvc.updateAlarmTime([time, this.inputs.alarm_uuid, this.user.uuid])
            })
            .then(() => {
                return this.getUserAlarms()
            })
    }

    updateAlarmTitle(): Promise<void>  {
        return this.querySvc.updateAlarmTitle([this.inputs.title, this.inputs.alarm_uuid, this.user.uuid])
    }

    toggleActiveAlarm():Promise<void> {
        let state;
        this.inputs.active === "true" || this.inputs.active ? state = false : state = true;
        return this.querySvc.updateAlarmToggleActive([state, this.inputs.alarm_uuid, this.user.uuid])
    }

    weekObjToQueryValues():(string|V.UUID)[] {
        return [
            this.inputs.mon,
            this.inputs.tues,
            this.inputs.wed,
            this.inputs.thur,
            this.inputs.fri,
            this.inputs.sat,
            this.inputs.sun,
            this.user.uuid,
            this.inputs.alarm_uuid
        ]
    }

    updateDaysOfWeek():Promise<void>{
        return this.querySvc.updateDaysOfWeek(this.weekObjToQueryValues())
            .then(() => this.querySvc.getUserAlarm([this.inputs.alarm_uuid, this.user.uuid]))
            .then(alarm => {
                if (alarm.sun === true ||
                    alarm.mon === true ||
                    alarm.tues === true ||
                    alarm.wed === true ||
                    alarm.thur === true ||
                    alarm.fri === true ||
                    alarm.sat === true) 
                {
                    return this.querySvc.updateAlarmRepeat([true, this.inputs.alarm_uuid, this.user.uuid])
                } else {
                    return this.querySvc.updateAlarmRepeat([false, this.inputs.alarm_uuid, this.user.uuid])
                }
            })
        }

    archiveAlarm():Promise<void> {
        return this.querySvc.updateAlarmArchived([true, this.inputs.alarm_uuid, this.user.uuid])
    }

    deleteAlarm():Promise<void> {
        return this.querySvc.deleteUserAlarm([this.inputs.alarm_uuid, this.user.uuid])
    }

    deleteAllAlarms():Promise<void> {
        return this.querySvc.deleteUserAlarms([this.user.uuid])
    }

    // ALARM STATE MANAGEMENT AND EVENT LOGGING

    snooze():Promise<void> {
        return this.querySvc.getAlarmState([this.inputs.alarm_uuid])
            .then(state => {
                if (state === 'ringing') {
                    console.log('this is from the ringing condition inside the snooze')
                    return this.querySvc.insertSnooze([this.inputs.alarm_uuid, this.user.uuid])
                        .then(() => this.querySvc.updateAlarmState(['snoozing', this.inputs.alarm_uuid]))
                } else {
                    throw new Error('No alarm is even ringing right now! Wait until it goes off.')
                }
            })      
    }

    dismiss(): Promise<void> {
        return this.querySvc.getAlarmState([this.inputs.alarm_uuid]) 
            .then(state => {
                if (state === 'ringing' || state === 'snoozing') {
                    return this.querySvc.updateAlarmState(['pending', this.inputs.alarm_uuid])
                        .then(result => this.querySvc.insertDismiss([this.inputs.alarm_uuid, this.user.uuid]))
                } else {
                    throw new Error ('No alarm is even ringing right now! Wait until it goes off.')
                }
            })
    }

    wake(): Promise<void> {
        return this.querySvc.getAlarmState([this.inputs.alarm_uuid]) 
            .then(state => {
                if (state === 'ringing' || state === 'snoozing') {
                    return this.querySvc.updateAlarmState(['pending', this.inputs.alarm_uuid])
                        .then(result => this.querySvc.insertWake([this.inputs.alarm_uuid, this.user.uuid]))
                } else {
                    throw new Error ('No alarm is even ringing right now! Wait until it goes off.')
                }
            })
    }

} 
