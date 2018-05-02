import QuerySvc from '../data-access/queries';
import * as bcrypt from 'bcrypt';
import * as R from '../services/value-objects';
import * as V from '../services/validation';
import * as uuidv4 from 'uuid/v4';

// AUTHORIZATION

export default class AuthSvc {
    querySvc: QuerySvc;
    sessionID: string;
    user: R.UserDB;
    inputs: R.AuthInputs;
    
    constructor(querySvc, inputs, sessionID) {
        this.sessionID = sessionID;
        this.querySvc = querySvc;
        this.inputs = R.AuthInputs.fromJSON(inputs);
        this.user;
    }

    static checkPassword(inputPass:string, savedPass:string):Promise<boolean> {
        return bcrypt.compare(inputPass, savedPass) 
            .then((result : boolean) => {
                if (!result) {
                    throw new Error('Password doesn\'t match our records, try again');
                } else {
                    return result;
                }
            })
    }

    defineSessionData() {
        let session = R.UserSession.fromJSON({
            email:this.user.email,
            uuid:this.user.user_uuid,
            permission:this.user.permission,
            name:this.user.name
        })

        return session;
    }

    doAuth() {
        return this.querySvc.getUserViaEmail([this.inputs.email.toLowerCase()])
            .then((result) => {
                this.user = result;
                return AuthSvc.checkPassword(this.inputs.password, this.user.password)
            })
            .then(() => this.querySvc.updateSessionID([this.sessionID, this.user.user_uuid]))
            .then(() => {
                let userDataForSession = this.defineSessionData();
                return userDataForSession;
            })
    }
}

export function regenerateSession(session:Express.Session) {
    return new Promise (
        (resolve, reject) => {
            session.regenerate(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve()
                }
            })
        }
    )
}

// LOGOUT

export function updateToInactiveSessionID(querySvc:QuerySvc, uuid:V.UUID) {
    let inactive = uuidv4();
    return querySvc.updateSessionID([inactive, uuid])
            .then(() => {})
            .catch(err => err)
}

export function destroySession(session:Express.Session) {
    return new Promise (
        (resolve, reject) => {
            session.destroy(err => err ? reject(err) : resolve())
        }
    )
}

