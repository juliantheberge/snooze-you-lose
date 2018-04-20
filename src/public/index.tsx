import App from './app'
import {TestApp } from './test'
import { AlarmClock } from './alarm-clock'
import * as wp from 'web-push';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { POPULATE, populate } from './user-data';
import { 
    REQ_TIME_CHANGE, 
    RES_TIME_CHANGE,
    REQ_NAME_CHANGE,
    RES_NAME_CHANGE,
    REQ_ALARM,
    RES_ALARM,
} from './actions'
import { WSAEPFNOSUPPORT } from 'constants';


// wrap around erroring component 
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
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
            console.log('res time change', action)
            return Object.assign({}, state, { 
                isFetching: false,
                alarms: action.alarms
            }) 
        case REQ_NAME_CHANGE:
            return Object.assign({}, state, { isFetching: true })
        case RES_NAME_CHANGE:
            console.log('res name change', action)
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
        default:
            return state;
    }
}  

function nameReducer(state = {newName: 'literally anything'}, action) {
    switch(action.type) {
        // case REQ_NAME_CHANGE:
        //     return Object.assign({}, state, { isFetching: true })
        // case RES_NAME_CHANGE:
        //     return Object.assign({}, state, { 
        //         isFetching: false,
        //         newName: action.newName
        //     })
        default:
            return state
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

// function alarmClock() {
//     ReactDOM.render(
//     <Provider store = { store }>
//         <AlarmClock/>
//     </Provider>,
//     document.getElementById('alarm'))
// }

export { app, store, populate, test };