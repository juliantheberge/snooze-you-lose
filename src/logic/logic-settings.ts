import QuerySvc from '../data-access/queries';
import {deepMerge} from '../services/merge';
import * as R from '../services/value-objects';
import * as V from '../services/validation';

interface SettingsInputs {
    payment_scheme?: string;
    month_max?: string;
    snooze_price?: string;
    dismiss_price?: string;
}

interface SettingsRenderObj extends R.UserSession {
    payment_scheme: string;
    month_max: string;
    snooze_price: string;
    dismiss_price: string;

}

export default class SettingsSvc {
    querySvc:QuerySvc;
    user:R.UserSession;
    inputs: SettingsInputs;
    settingsRenderObj: SettingsRenderObj;
    
    constructor(querySvc, user, inputs) {
        this.user = user;
        this.querySvc = querySvc;
        this.settingsRenderObj;
        this.inputs = inputs;
    }

    getUserSettingsAndRender() {
        return this.querySvc.getUserSettings([this.user.uuid])
            .then(result => {
                return deepMerge(result, this.user)
            })
    }

    changePaymentScheme() {
        return this.querySvc.updatePaymentScheme([this.inputs.payment_scheme, this.user.uuid])
    }


    changeAlarmPrices() {
        return this.changeMonthMax()
            .then(() => this.changePricePerDismiss())
            .then(() => this.changePricePerSnooze())
            .then(() => this.changePricePerWake())
    }

    changeAlarmSettings() {
        return this.changeQuietAfter()
            .then(() => this.changeSnoozeDuration())
    }

    changeMonthMax() {
        return this.querySvc.getUserSettings([this.user.uuid])
            .then(result => {
                // this.settingsRenderObj = deepMerge(result, this.user)
                // if (this.inputs.month_max < result.dismiss_price) {
                    // throw new Error ('You should probably select a monthly max that is more than the dismiss price')
                // } else {
                    return this.querySvc.updateMonthMax([this.inputs.month_max, this.user.uuid])
                // }
            })
    }

    changePricePerSnooze() {
        return this.querySvc.getUserSettings([this.user.uuid])
            .then(result => {
                // if (this.inputs.snooze_price > result.dismiss_price) {
                    // throw new Error ('You should probably select a snooze price that is less than the dismiss price')
                // } else {
                    return this.querySvc.updatePricePerSnooze([this.inputs.snooze_price, this.user.uuid])
                // }
            })
    }

    changePricePerDismiss() {
        return this.querySvc.getUserSettings([this.user.uuid])
            .then(result => {
                // if (this.inputs.dismiss_price > result.month_max) {
                    // throw new Error ('You should probably select a dismiss price that is less than the dismiss price')
                // } else {
                    return this.querySvc.updatePricePerDismiss([this.inputs.dismiss_price, this.user.uuid])
                // }
            })
    }


    changePricePerWake() {
        return this.querySvc.getUserSettings([this.user.uuid])
            .then(result => {
                // validation
                return this.querySvc.updatePricePerWake([this.inputs.wake_price, this.user.uuid])
            })
    }

    changeQuietAfter() {
        console.log( 'anew route', this.inputs)
        return this.querySvc.getUserSettings([this.user.uuid])
            //validation
            .then(result => this.querySvc.updateQuietAfter([this.inputs.quiet_after, this.user.uuid]))
    }

    changeSnoozeDuration() {
        console.log( 'bnew route', this.inputs)
        return this.querySvc.getUserSettings([this.user.uuid])
            //validation
            .then(result => this.querySvc.updateSnoozeLength([this.inputs.snooze_length, this.user.uuid]))
    }

}