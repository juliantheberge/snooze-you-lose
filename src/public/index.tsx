import App from './app'
import NewAccount from './new-account';
import Login from './login'
import * as wp from 'web-push';
import * as React from 'react';
import thunkMiddleware from 'redux-thunk';
import * as ReactDOM from 'react-dom';
import { TestApp } from './test'
import { AlarmClock } from './alarm-clock'
import { SimpleClock } from './simple-clock'
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { POPULATE, populate } from './user-data';
import { 
    REQ_NAME_CHANGE,
    RES_NAME_CHANGE,
    GEN_ERR,
    CLEAR_ERR,
} from './actions'
import {
    REQ_ALARM,
    RES_ALARM,
    REQ_TIME_CHANGE,
    RES_TIME_CHANGE,
    REQ_ACTIVE_TOGGLE,
    RES_ACTIVE_TOGGLE,
    REQ_ALARM_TITLE,
    REQ_ALARM_ARCHIVE,
    RES_ALARM_ARCHIVE,
    RES_ALARM_TITLE
} from './actions-alarm'
import { WSAEPFNOSUPPORT } from 'constants';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

let initialState = {}

function userDataReducer(state = initialState, action) {
    switch (action.type) {
        case POPULATE:
            return Object.assign({}, state, {
                profile:action.userData.profile,
                alarms:action.userData.alarms
            })
        case REQ_TIME_CHANGE:
            return Object.assign({}, state, { isFetching: true })
        case RES_TIME_CHANGE:
            return Object.assign({}, state, { 
                isFetching: false,
                alarms: action.alarms,
                error: "dismissed"
            }) 
        case REQ_NAME_CHANGE:
            return Object.assign({}, state, { isFetching: true })
        case RES_NAME_CHANGE:
            return Object.assign({}, state, {
                isFetching: false,
                profile: action.profile
            }) 
        case REQ_ALARM:
            return Object.assign({}, state, { isFetching: true })
        case RES_ALARM:
            return Object.assign({}, state, {
                isFetching: false,
                alarms: action.alarms                
            })
        case REQ_ACTIVE_TOGGLE:
            return Object.assign({}, state, {isFetching : true})
        case RES_ACTIVE_TOGGLE:
            console.log('res active toggle', action)
            return Object.assign({}, state, {
                isFetching:false,
                alarms:action.alarms
            })
        case REQ_ALARM_TITLE:
            return Object.assign({}, state, {isFetching: true})
        case REQ_ALARM_TITLE:

            return Object.assign({}, state, {
                isFetching:false,
                alarms:action.alarms
            })
        case REQ_ALARM_ARCHIVE:
            return Object.assign({}, state, { isFetching: true })
        case REQ_ALARM_ARCHIVE:
            return Object.assign({}, state, {
                isFetching: false,
                alarms: action.alarms
            })
        case GEN_ERR:
            console.log('gen error', action)
            return Object.assign({}, state, {
                isFetching: false,
                error: action.error,
            })
        case CLEAR_ERR:
            return Object.assign({}, state, {
                error: action.error,
            })
        default:
            return state;
    }
}  

let reducer = combineReducers({
    userData: userDataReducer
})

let store = createStore(reducer, composeWithDevTools(
    applyMiddleware(thunkMiddleware)
))


function app() {
  ReactDOM.render(
    <Provider store = { store }>
        <App/>
    </Provider>,
  document.getElementById('app'));
}

function test() {
  ReactDOM.render(
    <Provider store = { store }>
        <TestApp/>
    </Provider>,
  document.getElementById('test'));
}

function alarmClock() {
    ReactDOM.render(
        <SimpleClock/>,
    document.getElementById('simpleClock'))
}

function newAccount() {
    ReactDOM.render(
        <NewAccount />,
    document.getElementById('newAccount'))
}

function login() {
    return ReactDOM.render(
        <Login />,
    document.getElementById('login'));
}

export { app, store, populate, test, alarmClock, newAccount, login };