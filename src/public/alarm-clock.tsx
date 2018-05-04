import * as React from 'react';
import Sound from 'react-sound'
import { clearError } from './actions'
import { fetchAlarms, 
    fetchActiveToggle, 
    fetchAlarmTitle, 
    fetchNewAlarm, 
    fetchNewTime, 
    fetchAlarmArchive 
} from './actions-alarm'
import { AlarmList } from './alarm-list'
import { connect, Provider } from 'react-redux';
import { eventNames } from 'cluster';
import { TimeConverter } from '../services/time-helpers'

class Clock extends React.Component {
    state: { 
        date:Date;
        time: string;
        showControls:boolean;
        value:string;
    }
    timerID:any; // not sure about this type
    props:{
        alarms: [{
            title: string;
            time: string;
            state: string;
            repeat: string;
        }],
        postTime:any;
        postTitle: any;
        toggleActive:any;
        postAlarm:any;
        archiveAlarm:any;
        error:string;
        clearError:any;
        updateAlarms:any;
    }
//
    constructor(props) {
        super(props)
        this.state = {
            date: new Date(),
            time: '',
            showControls: false,
            value: ''
        }
    }
    componentDidMount() {
        this.timerID = setInterval(
            () => {
                this.props.updateAlarms()
                return this.tick()
            },
            1000
        )
    }

    tick() {
        let now = this.state.date.toLocaleTimeString('en-US', { hour12: false });
        for (let i = 0; i < this.props.alarms.length; i++) {
            if (now === this.props.alarms[i].time) { // just changed this without checking 4.19.18 13:39
                this.setState({
                    showControls: true
                })
            }
        }

        this.setState({
            date: new Date()
        });
    }
    render() {

        let messages = this.props.alarms.map((alarm) => {
            if (alarm.state === 'ringing') {
                return <AlarmController
                    alarm={alarm}
                    key={alarm.id}
                    />    
            }
        })
        let error;

        if (this.props.error && this.props.error !== 'dismissed') {
            error = <div className="test-error">
                <h1 className="textError">Error</h1>
                <p className="textError one-item-spacing">{this.props.error}</p>
                <button className = 'button dark-button' onClick = {this.props.clearError}>got it</button>
            </div>
        }

        return (
            <div>
                <div className='clock'>
                    <h1>{this.state.date.toLocaleTimeString('en-US', { hour12: false })}</h1>
                </div>
                <div className='alarm-controllers-wrapper'>{messages}</div>
                <AlarmList 
                    alarms = {this.props.alarms} 
                    postTime = {this.props.postTime} 
                    postTitle = {this.props.postTitle}
                    toggleActive = {this.props.toggleActive}
                    archiveAlarm = {this.props.archiveAlarm}
                    />
                <AddAlarmForm postAlarm = {this.props.postAlarm}/> 
                {error}
            </div>
        )
    }
}

class AlarmController extends React.Component {
    style: string;
    alarm: {
        title: string;
        time: string;
        state: string;
        user_uuid:string;
        alarm_uuid:string;
    }

    constructor(props) {
        super(props)
        this.style = 'alarm-control-wrapper'
        this.alarm = this.props.alarm
    }

    render() {
        if (this.alarm.state === 'ringing') {
            this.style = 'alarm-control-wrapper'
        }
        let dismissRoute = "/app/accounts/" + this.alarm.user_uuid + "/alarms/" + this.alarm.alarm_uuid + "/dismiss"
        let snoozeRoute = "/app/accounts/" + this.alarm.user_uuid + "/alarms/" + this.alarm.alarm_uuid + "/snooze"
        return (
            <div className={this.style}>
                <h1>{this.alarm.state}!!!</h1>
                <p>{this.alarm.title}</p>
                <p>{this.alarm.time}</p>
                <div className = 'alarm-control-button-wrapper'>
                    <form action={dismissRoute} method="POST">
                        <input className="button light-button" type='submit' value='dismiss'/>
                        <input name="alarm_uuid" type="hidden" value={this.alarm.alarm_uuid}/>
                    </form>
                    <MathProblem alarm = {this.alarm} />
                    <form action={snoozeRoute} method="POST">
                        <input className="button light-button" type='submit' value='snooze' />
                        <input name="alarm_uuid" type="hidden" value={this.alarm.alarm_uuid} />
                    </form>
                </div>
                <Sound
                    url="/sounds/ring-song.mp3"
                    playStatus={Sound.status.PLAYING}
                />
            </div>
        )
    }
}

class MathProblem extends React.Component {

    state: {
        value: string;
        answer: number;
        showWakeButton:boolean;
        one:number;
        two:number;
        three:number;
    }

    props: {
        alarm: {
            user_uuid: string;
            alarm_uuid: string;
        }
    }


    constructor(props) {
        super (props)
        this.state = {
            value: '',
            answer: 0,
            showWakeButton: false,
            one: this.randomNumber(),
            two: this.randomNumber(),
            three: this.randomNumber(),
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (parseInt(this.state.value) === this.state.answer) {
            this.setState({
                showWakeButton:true
            })
        } 
    }

    randomNumber = () => Math.floor((Math.random() * 20))
    
    render() {
        this.state.answer = this.state.one + this.state.two + this.state.three;
        if (this.state.showWakeButton) {
            let wakeRoute = "/app/accounts/" + this.props.alarm.user_uuid + "/alarms/" + this.props.alarm.alarm_uuid + "/wake"
            return (
                <form action={wakeRoute} method="POST">
                    <input className="button light-button" type='submit' value='wake' />
                    <input name="alarm_uuid" type="hidden" value={this.props.alarm.alarm_uuid} />
                </form>
            )
        }
        return (
            <div>
                <p>find the sum</p>
                <p>{this.state.one} + { this.state.two} + { this.state.three} =</p>
                <form onSubmit={this.handleSubmit}>
                    <input type='text' className='big-form-item' value={this.state.value} onChange={this.handleChange} />
                    <input type="submit" value="Submit" className='button dark-button' />
                </form>
            </div>
        )
    }
}


class AddAlarmForm extends React.Component {
    state: {
        form: boolean;
        time:string;
        title:string;
        buttonStyle: string;
    }

    props: {
        alarm:any;
        postAlarm:any;
    }

    constructor(props) {
        super(props)
        this.state = {
            form:false,
            title: '',
            time: '',
            buttonStyle: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openForm = this.openForm.bind(this)
    }

    
    openForm() {
        if (this.state.form) {
            this.setState({
                buttonStyle: '',
                form:false
            })
        } else {
            this.setState({
                buttonStyle: 'rotate-right',
                form:true
            })
        }
        
    }

    handleChange(event) {this.setState({ [event.target.name]: event.target.value })}
    handleSubmit(event) {
        event.preventDefault();
        let t = new TimeConverter()
        let value = t.fromUserInput(this.state.time)
        console.log('v', value)
        console.log('a', t.convert(value, false))
        this.props.postAlarm({
            title:this.state.title,
            time: t.convert(value, false)
        })
        this.setState({
            form:false,
            title:'',
            time: '',
            buttonStyle: ''
        })
    }

    render() {
        return (
            <div>
                <div className={this.state.form?'curtain':''}></div>
                <div className={this.state.form ? "flex column popup-form" : "flex column popup-form-pre"}>
                    
                    {this.state.form
                    ?
                    <div className="add-alarm">
                        <h1 className = 'light-text'>add alarm</h1>
                        <form onSubmit = {this.handleSubmit}>
                            <input
                                name="time"
                                className="link-text-form alarm-time special"
                                type="text"
                                placeholder="06:00"
                                value={this.state.time}
                                onChange = {this.handleChange}
                            />
                            
                            <input
                                name="title"
                                className="link-text-form alarm-time special"
                                type="text"
                                placeholder="work week"
                                value={this.state.title}
                                onChange = {this.handleChange}
                            />
                            <button className="button light-button" type="submit"> submit </button>
                        </form>
                    </div>
                    :
                    <div className="add-alarm-placeholder"></div>
                    }
                    <div className={"fixed-center-wrapper" + " " + this.state.buttonStyle} onClick={this.openForm}>
                        <img src='/icons/white/plus.svg' className='icon add-alarm-icon' />
                    </div>
                </div>
                
            </div>
        )
    }


}


const mapStateToProps = state => {
    return {
        alarms: state.userData.alarms,
        error:state.userData.error
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        updateAlarms:() => dispatch(fetchAlarms()),
        postTime: (v) => dispatch(fetchNewTime(v)),
        postTitle: (v) => dispatch(fetchAlarmTitle(v)),
        toggleActive: (v) => dispatch(fetchActiveToggle(v)),
        postAlarm: (v) => dispatch(fetchNewAlarm(v)),
        archiveAlarm: (v) => dispatch(fetchAlarmArchive(v)),
        clearError: () => dispatch(clearError()),
        
    }
}




export const AlarmClock = connect(mapStateToProps, mapDispatchToProps)(Clock)