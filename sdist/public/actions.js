"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ERROR HANDLING
exports.GEN_ERR = 'GEN_ERR';
exports.CLEAR_ERR = 'CLEAR_ERR';
function clearError() {
    return {
        type: exports.CLEAR_ERR,
        error: 'dismissed',
        route: 'dismissed'
    };
}
exports.clearError = clearError;
function recieveError(error, dispatch) {
    if (error.error !== null && typeof error.error === 'object') {
        error.error = 'There was a problem with your input. Try again.';
    }
    return {
        type: exports.GEN_ERR,
        error: error.error,
        route: error.route
    };
}
exports.recieveError = recieveError;
// SAMPLE THUNK
exports.REQ_NAME_CHANGE = 'REQ_NAME_CHANGE';
exports.RES_NAME_CHANGE = 'RES_NAME_CHANGE';
function reqNewName(v) {
    return { type: exports.REQ_NAME_CHANGE };
}
exports.reqNewName = reqNewName;
function recieveNewName(user) {
    return {
        type: exports.RES_NAME_CHANGE,
        profile: user
    };
}
function fetchNewName(v) {
    return function (dispatch) {
        dispatch(reqNewName(v));
        return fetch("/new-name", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: v })
        })
            .then(function (res) {
            return res.json();
        })
            .then(function (user) {
            dispatch(recieveNewName(user));
        })
            .catch(function (e) { return console.log(e); });
    };
}
exports.fetchNewName = fetchNewName;
//# sourceMappingURL=actions.js.map