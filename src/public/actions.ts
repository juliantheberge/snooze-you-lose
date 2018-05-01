// ERROR HANDLING
export const GEN_ERR = 'GEN_ERR'
export const CLEAR_ERR = 'CLEAR_ERR'

export function clearError() {
    return {
        type: CLEAR_ERR,
        error: 'dismissed',
        route: 'dismissed'
    }
    
}

export function recieveError(error, dispatch) {
    if (error.error !== null && typeof error.error === 'object') {
        error.error = 'There was a problem with your input. Try again.'
    }
    return {
        type: GEN_ERR,
        error: error.error,
        route: error.route
    }
}


// SAMPLE THUNK
export const REQ_NAME_CHANGE = 'REQ_NAME_CHANGE';
export const RES_NAME_CHANGE = 'RES_NAME_CHANGE';

export function reqNewName(v) {
    return { type: REQ_NAME_CHANGE }
}

function recieveNewName(user) {
    return {
        type: RES_NAME_CHANGE,
        profile: user
    }
}

export function fetchNewName(v) {
    return function (dispatch) {
        dispatch(reqNewName(v))
        return fetch("/new-name", {
            method: "post",
            credentials: 'same-origin',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: v })
        })
            .then((res) => {
                return res.json();
            })
            .then(user => {
                dispatch(recieveNewName(user))
            })
            .catch(e => console.log(e))
    }
}
