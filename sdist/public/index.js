"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var new_account_1 = require("./new-account");
var login_1 = require("./login");
var home_1 = require("./home");
var allTags = document.body.getElementsByTagName('*');
var ids = [];
for (var tg = 0; tg < allTags.length; tg++) {
    var tag = allTags[tg];
    if (tag.id) {
        ids.push(tag.id);
    }
}
console.log(ids);
for (var i = 0; i < ids.length; i++) {
    if (ids[i] === 'new-user') {
        new_account_1.default();
    }
    else if (ids[i] === 'login') {
        login_1.default();
    }
    else if (ids[i] === 'app') {
        app_1.default();
    }
    else if (ids[i] === 'home') {
        home_1.default();
    }
}
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux'
// import { createStore } from 'redux'
// import reducer from './reducers/index'
// import HelloWorld from './containers/HelloWorld'
// import Counter from './components/counter'
//
// let store = createStore(reducer) // this is store
//
// const render = () => ReactDOM .render(
//   <Provider store={store}>
//     <HelloWorld />
//     <Counter
//       value = { store.getState() }
//       onIncrement = { () => store.dispatch({type: 'INCRIMENT'}) }
//       onDecrement = { () => store.dispatch({type: 'DECREMENT'}) }
//     />
//   </Provider>,
// 	document.getElementById('login')
// );
//
// render()
// store.subscribe(render)
// import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
// import { createStore } from 'redux'
// import Counter from './components/counter'
// import counter from './reducers/counter'
//
// export const store = createStore(counter)
// console.log(store.getState())
//
// function current() {
//   let state = store.getState()
//   return state.current;
// }
//
// function total() {
//   let state = store.getState()
//   return state.total;
// }
//
// const render = () => ReactDOM.render (
//   <Counter
//     current = { current() }
//     total = { total() }
//     onIncrement = { () => store.dispatch({type: 'INCREMENT'}) }
//     onDecrement = { () => store.dispatch({type: 'DECREMENT'}) }
//     onReset = { () => store.dispatch({type: 'RESET'})}
//   />,
//   document.getElementById('login')
// )
//
// render()
// store.subscribe(render)
//# sourceMappingURL=index.js.map