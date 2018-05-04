import { recieveError } from './actions'

// GET ALARMS FOR TICKER
export const REQ_ALARM = 'REQ_ALARM'
export const RES_ALARM = 'RES_ALARM'

export function reqAlarms() {
    return {
        type: REQ_ALARM,
    }
}

function recieveAlarms(alarms) {
    return {
        type: RES_ALARM,
        alarms: alarms
    }
}

export function fetchAlarms() {
    return function (dispatch) {
        dispatch(reqAlarms())
        return fetch('/app/accounts/:email/alarms/api', {
            method: 'get',
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            }
        })
            .then(res => res.json())
            .then(alarms => dispatch(recieveAlarms(alarms)))
            .catch(e => console.log(e))
    }
}



// ADD ALARM

export const REQ_NEW_ALARM = 'REQ_NEW_ALARM';
export const RES_NEW_ALARM = 'RES_NEW_ALARM';

export function reqNewAlarm(v) {
    return { type: REQ_NEW_ALARM }
}

function recieveNewAlarm(alarms) {
    return {
        type: RES_NEW_ALARM,
        alarms: alarms
    }
}

export function fetchNewAlarm(v) {
    return function (dispatch) {
        dispatch(reqNewAlarm(v))
        return fetch("/app/accounts/:email/alarms/api", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(v)
        })
            .then((res) => res.json())
            .then(alarms => {
                if (alarms.status === 'failed') {
                    return dispatch(recieveError(alarms, dispatch))
                }
                dispatch(recieveNewAlarm(alarms))
            })
    }
}


// TIME CHANGE
export const REQ_TIME_CHANGE = 'REQ_TIME_CHANGE';
export const RES_TIME_CHANGE = 'RES_TIME_CHANGE';

export function reqNewTime(v) {
    return { type: REQ_TIME_CHANGE }
}

function recieveNewTime(alarms) {
    return {
        type: RES_TIME_CHANGE,
        alarms: alarms
    }
}

export function fetchNewTime(v) {
    return function (dispatch) {
        dispatch(reqNewTime(v))
        return fetch("/app/accounts/:email/alarms/:alarm_uuid/time/api?_method=PUT", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(v)
        })
            .then((res) => res.json())
            .then(alarms => {
                if (alarms.status === 'failed') {
                    return dispatch(recieveError(alarms, dispatch))
                }
                dispatch(recieveNewTime(alarms))
            })
    }
}



// TOGGLE ACTIVE
export const REQ_ACTIVE_TOGGLE = 'REQ_ACTIVE_TOGGLE';
export const RES_ACTIVE_TOGGLE = 'RES_ACTIVE_TOGGLE';

export function reqActiveToggle(v) {
    return { type: REQ_ACTIVE_TOGGLE }
}

function recieveActiveToggle(alarms) {
    return {
        type: RES_ACTIVE_TOGGLE,
        alarms: alarms
    }
}

export function fetchActiveToggle(v) {
    return function (dispatch) {
        dispatch(reqActiveToggle(v))
        return fetch("/app/accounts/:email/alarms/:alarm_uuid/active/api?_method=PUT", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(v)
        })
            .then((res) => res.json())
            .then(alarms => {
                if (alarms.status === 'failed') {
                    return dispatch(recieveError(alarms, dispatch))
                }
                dispatch(recieveActiveToggle(alarms))
            })
    }
}

// TITLE
export const REQ_ALARM_TITLE = 'REQ_ALARM_TITLE';
export const RES_ALARM_TITLE = 'RES_ALARM_TITLE';

export function reqAlarmTitle(v) {
    return { type: REQ_ALARM_TITLE }
}

function recieveAlarmTitle(alarms) {
    return {
        type: RES_ACTIVE_TOGGLE,
        alarms: alarms
    }
}

export function fetchAlarmTitle(v) {
    return function (dispatch) {
        dispatch(reqActiveToggle(v))
        return fetch("/app/accounts/:email/alarms/:alarm_uuid/title/api?_method=PUT", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(v)
        })
            .then((res) => res.json())
            .then(alarms => {
                if (alarms.status === 'failed') {
                    return dispatch(recieveError(alarms, dispatch))
                }
                dispatch(recieveActiveToggle(alarms))
            })
    }
}


// ARCHIVE ALARMS

export const REQ_ALARM_ARCHIVE = 'REQ_ALARM_ARCHIVE';
export const RES_ALARM_ARCHIVE = 'RES_ALARM_ARCHIVE';

export function reqAlarmArchive(v) {
    return { type: REQ_ALARM_ARCHIVE }
}

function recieveAlarmArchive(alarms) {
    return {
        type: RES_ALARM_ARCHIVE,
        alarms: alarms
    }
}

export function fetchAlarmArchive(v) {
    return function (dispatch) {
        dispatch(reqAlarmArchive(v))
        return fetch("/app/accounts/:email/alarms/:alarm_uuid/api?_method=DELETE", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(v)
        })
            .then((res) => res.json())
            .then(alarms => {
                if (alarms.status === 'failed') {
                    return dispatch(recieveError(alarms, dispatch))
                }
                dispatch(recieveAlarmArchive(alarms))
            })
    }
}