import QuerySvc from '../data-access/queries';
import * as R from '../services/value-objects';
import * as V from '../services/validation';

interface FormOfPaymentRenderObj extends V.PaymentCredit {
    user_uuid:V.UUID;
}

interface UpdatePayementCredit extends V.PaymentCredit {
    oldCard:string
}

export default class PaymentsSvc {
    querySvc:QuerySvc;
    user:R.UserSession;
    inputs:(V.PaymentCredit | UpdatePayementCredit);
    inputArray:(string | V.UUID)[]

    constructor(querySvc, user, inputs){
        this.user = user;
        this.querySvc = querySvc;
        this.inputs = inputs;
    }

    getFormsOfPayment() {
        return this.querySvc.getUserFormsOfPayment([this.user.uuid])
    }

    paymentObjToArray() {
        return [
            this.user.uuid,
            this.inputs.card_number,
            this.inputs.name,
            this.inputs.exp_month,
            this.inputs.exp_date,
            this.inputs.cvv,
            this.inputs.address_1,
            this.inputs.city,
            this.inputs.state,
            this.inputs.zip,
        ]
    }

    // GETTING ODD LINTER ERROR HERE EVEN THOUGH WORKS
    // PomiseLike type rather than promise type??

    addNewFormOfPayment() {
        return this.querySvc.getUserFormsOfPayment([this.user.uuid])
            .then((result) => {
                if (result.length > 0) {
                    return this.querySvc.updateUserPaymentsToFalse([false, this.user.uuid])
                } else {
                    return result;
                }
            })
            .then(() => this.querySvc.insertFormOfPayment(this.paymentObjToArray()))
    }

    changeActivePayement() {
        let state;
        this.inputs.active === "true" ? state = false : state = true;
        console.log('change active payments', this.inputs.active, this.inputs, state)
        return this.querySvc.updateAllFormsOfPaymentToFalse([false, this.user.uuid])
            .then(result => this.querySvc.updateActiveFormOfPayment([state, this.inputs.card_number, this.user.uuid]))
    }

    getFormOfPayement() {
        console.log(this.user.uuid, this.inputs.card_number)
        console.log(this.inputs)
        return this.querySvc.getFormOfPayment([this.user.uuid, this.inputs.card_number]);
    }

    formatUpdateValueArray() {
        return [
            this.inputs.card_number,
            this.inputs.name,
            this.inputs.exp_month,
            this.inputs.exp_date,
            this.inputs.cvv,
            this.inputs.address_1,
            this.inputs.city,
            this.inputs.state,
            this.inputs.zip,
            this.user.uuid,
            this.inputs.oldCard
        ]
    }

    updateFormOfPayment() {
        return this.querySvc.updateFormOfPayment(this.formatUpdateValueArray())
    }

    deleteFormOfPayment() {
        return this.querySvc.deleteFormOfPayement([this.user.uuid, this.inputs.card_number])
    }
}