import React, {Component} from 'react';
import { compare } from '../../routes/functions/helpers';

function UserAlarms(props) {
    console.log(props)
    let alarmContent = props.alarms;
    let printableAlarms = JSON.stringify(alarmContent)
    console.log(printableAlarms)
    return (
        <div>
            <h1>sorted alarm data</h1>
            <div><pre>{JSON.stringify(props.alarms, null, 2)}</pre></div>
        </div>
    )
}

export default UserAlarms;