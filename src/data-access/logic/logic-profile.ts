import * as E from '../services/error-handling';
import * as R from '../services/value-objects';
import * as V from '../services/validation';
import * as bcrypt from 'bcrypt';
import QuerySvc from '../data-access/queries';
import AuthSvc from './logic-authorization';




export default class ProfileSvc {
    querySvc: QuerySvc;
    user:R.UserSession;
    inputs: any; // change


    constructor(querySvc, user, inputs) {
        this.querySvc = querySvc;
        this.user = user,
        this.inputs = inputs
    }

    changeContact():Promise<void> {
        return this.querySvc.updateContactInformation([this.inputs.name, this.inputs.email, this.inputs.phone, this.user.uuid])
    }

    changePassword():Promise<void> {
        return this.querySvc.getUser([this.user.uuid])
            .then(user => {
                return AuthSvc.checkPassword(this.inputs.oldPassword, user.password)
            })
            .then(boolean => {
                return E.passChecker(this.inputs.password)
            })
            .then(() => {
                return bcrypt.hash(this.inputs.password, 10)
            })
            .then(hash => this.querySvc.updatePassword([hash, this.user.uuid]))
    }

    deleteAccount():Promise<void> {
        return this.querySvc.deleteAccount([this.user.uuid])
    }
    
}