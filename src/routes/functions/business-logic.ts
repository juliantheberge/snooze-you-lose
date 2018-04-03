import { Query } from './queries';
import * as bcrypt from 'bcrypt';
import * as help from '../functions/helpers';
import * as r from '../resources/value-objects';
import * as uuidv4 from 'uuid/v4';

// AUTHORIZATION

export class AuthSvc {
    client: Query;
    sessionID: string;
    user: r.UserDB;
    inputs: inputs;
    req: Request;

    constructor(client, user, inputs, sessionID) {
        this.sessionID = sessionID;
        this.client = client;
        this.user = user;
        this.inputs = inputs;

        this.checkEmail = this.checkEmail.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        // this.regenerateSession = this.regenerateSession.bind(this);
        this.updateSession = this.updateSession.bind(this);
        this.defineSession = this.defineSession.bind(this);
        this.doAuth = this.doAuth.bind(this);
    }

    checkEmail() {
        return new Promise (
            (resolve, reject) => {
                this.client.selectUser([this.inputs.email])
                .then((result) => {
                    if (result.rows.length === 0) {
                        throw new Error("Email not found");
                    } else {
                        resolve(r.UserDB.fromJSON(result.rows[0]));
                    }
                })
                .catch(err => reject(err))
            }
        )
    }

    checkPassword() {
        return new Promise (
            (resolve, reject) => {
                bcrypt.compare(this.inputs.password, this.user.password)
                .then((result : boolean) => {
                    if (result === false) {
                        throw new Error('Password incorrect');
                    } else {
                        resolve(result);
                    }
                })
                .catch(err => reject(err));
            }
        )
    }
    // regenerateSession(req) {
    //     console.log('~~~~~~ session id before regnerate', req.session.id)
    //     return new Promise (
    //         (resolve, reject) => {
    //         req.session.regenerate(function(err) {
    //                 console.log('%%%%%%%%%%%5.5', this)
    //                 if (err) {
    //                     reject(err)
    //                 } else {
    //                     resolve();
    //                 }
    //             })
    //         }
    //     )
    // }
    updateSession() {
        console.log('~~~~~~ session id after regnerate', this.sessionID)
        return new Promise (
            (resolve, reject) => {
                this.client.updateSessionID([this.sessionID, this.user.user_uuid])
                .then((result) => {
                    resolve(result)
                })
                .catch(err => reject(err))
            }
        )
    }
    defineSession() {
        let session = r.UserSession.fromJSON({
            email:this.user.email,
            uuid:this.user.user_uuid,
            permission:this.user.permission,
            name:this.user.name
            })
        return session;
    }

    doAuth() {
        console.log('%%%%%%%%%%%1', this)
        return new Promise (
            (resolve, reject) => {
                console.log('%%%%%%%%%%%2', this)
                this.checkEmail()
                    .then((result) => {
                        console.log('%%%%%%%%%%%3', this)
                        this.user = result;
                        return this.checkPassword();
                    })
                    .then(() => {
                        console.log('%%%%%%%%after regen', this.sessionID)
                        return this.updateSession();
                    })
                    .then((result) => {
                        let userSession = this.defineSession();
                        console.log('final promise do auth', this.sessionID)
                        resolve(userSession);
                    })
                    .catch((err) => reject(err))
            }
        )
    }
}

function checkEmail(client, email) {
    return new Promise (
        (resolve, reject) => {
            client.selectUser([email])
            .then((result) => {
                if (result.rows.length === 0) {
                    throw new Error("Email not found");
                } else {
                    resolve(r.UserDB.fromJSON(result.rows[0]));
                }
            })
            .catch(err => reject(err))
        }
    )
}

function checkPassword(inputPass, realPass) {
    console.log(inputPass, realPass)
    return new Promise (
        (resolve, reject) => {
            bcrypt.compare(inputPass, realPass)
            .then((result : boolean) => {
                if (result === false) {
                    throw new Error('Password incorrect');
                } else {
                    resolve(result);
                }
            })
            .catch(err => reject(err));
        }
    )
}

function regenerateSession(session) {
    console.log('~~~~~~ session id before regnerate', session.id)
  return new Promise (
    (resolve, reject) => {
      session.regenerate(function(err) {
        if (err) {
            reject(err)
        } else {
            console.log('~~~~~~ session id after regnerate', session.id)
            resolve();
        }
      })
    }
  )
}


function updateSession(client, sessionID, uuid) {
    return new Promise (
        (resolve, reject) => {
            client.updateSessionID([sessionID, uuid])
            .then((result) => {
                resolve(result)
            })
            .catch(err => reject(err))
        }
    )
}

function defineSession(user) {
    let session = r.UserSession.fromJSON({
          email:user.email,
          uuid:user.user_uuid,
          permission:user.permission,
          name:user.name
        })
    return session;
}

// NEW ACCOUNT

export function hash(input) {
    return new Promise (
        (resolve, reject) => {
            bcrypt.hash(input, 10)
            .then(hash => resolve(hash))
            .catch(err => reject(err))
        }
    )
}

export function saveUserInformation(client, email, phone, password, name) {
    return new Promise (
        (resolve, reject) => {
            client.insertUser([email, phone, password, name, 'user'])
            .then((result) => {
                console.log(result)
                let u = result.rows[0]
                console.log(u)
                let user = r.UserDB.fromJSON({
                    email:u.email,
                    user_uuid:u.user_uuid,
                    permission:u.permission,
                    phone:u.phone,
                    name:u.name,
                    password:u.password
                })
                console.log(user)
                resolve(user)
            })
            .catch(err => reject(err))
        }
    )
}

export const randomString = new Promise((resolve, reject) => {
    let string = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+-=`,." +
            "<>/?;:'{}[]|";
    for (let i = 0; i <= 40; i++) {
        string += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    if (typeof string === "undefined") {
        let err = new Error ("randomString failed to create anything ")
        return reject(err)
    }
    return resolve(string);
})

export function insertUserNonce(client, uuid, nonce) {
    return new Promise (
        (resolve, reject) => {
            client.insertNonce([uuid, nonce])
            .then(result => resolve(result))
            .catch(err => reject(err))
        }
    )
}

export function createUserSessionStorage(client, uuid, sessionID) {
    return new Promise (
        (resolve, reject) => {
            client.insertSession([uuid, sessionID])
            .then(result => resolve(result))
            .catch(err => reject(err))
        }
    )
}

export function createUserSettings(client, uuid) {
    return new Promise (
        (resolve, reject) => {
            client.insertSettings([uuid])
            .then(result => resolve(result))
            .catch(err => reject(err))
        }
    )
}

// LOGOUT

export function updateToInactiveSessionID(client, uuid) {
    return new Promise (
        (resolve, reject) => {
            let inactive = uuidv4();
            client.updateSessionID([inactive, uuid])
                .then(result => resolve())
                .catch(err => reject(err))
        }
    )
}

export function destroySession(session) {
    return new Promise (
        (resolve, reject) => {
            session.destroy((err) => {
                err ? reject(err) : resolve()
            })
        }
    )
}


export { checkEmail, checkPassword, regenerateSession, updateSession, defineSession };