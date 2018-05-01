import * as React from 'react';

export class Toggler extends React.Component {
    state: {
        togglerStyle:string;
        wrapperStyle:string;

    }

    props: {
        toggleActive:any;
        alarm:any;
    }


    constructor(props) {
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.toggleActive({
            active:this.props.alarm.active,
            alarm_uuid: this.props.alarm.alarm_uuid
        })
    }
    


    render() {
        let togglerStyle = "toggler";
        let wrapperStyle = "toggle-wrapper";
        if (this.props.alarm.active) {
            togglerStyle = "toggler toggler-on";
            wrapperStyle = "toggle-wrapper toggle-on";
        }
        return (
            <div>
                <div className = {wrapperStyle} onClick = {this.handleSubmit}>
                    <div className = {togglerStyle}></div>
                </div>
            </div>
        )
    }
}


export class ArchiveAlarm extends React.Component {
    state: {
        togglerStyle: string;
        wrapperStyle: string;

    }

    props: {
        archiveAlarm: any;
        alarm: any;

    }


    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(e) {
        e.preventDefault()
        this.props.archiveAlarm({
            alarm_uuid: this.props.alarm.alarm_uuid
        })
    }



    render() {
        return (
            <input onClick = {this.handleSubmit} className="icon" type="image" width="20px" height="20px" src="/icons/black/trash.svg" />
        )
    }
}
