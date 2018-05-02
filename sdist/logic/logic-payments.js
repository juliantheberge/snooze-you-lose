"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PaymentsSvc = /** @class */ (function () {
    function PaymentsSvc(querySvc, user, inputs) {
        this.user = user;
        this.querySvc = querySvc;
        this.inputs = inputs;
    }
    PaymentsSvc.prototype.getFormsOfPayment = function () {
        return this.querySvc.getUserFormsOfPayment([this.user.uuid]);
    };
    PaymentsSvc.prototype.paymentObjToArray = function () {
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
        ];
    };
    // GETTING ODD LINTER ERROR HERE EVEN THOUGH WORKS
    // PomiseLike type rather than promise type??
    PaymentsSvc.prototype.addNewFormOfPayment = function () {
        var _this = this;
        return this.querySvc.getUserFormsOfPayment([this.user.uuid])
            .then(function (result) {
            if (result.length > 0) {
                return _this.querySvc.updateUserPaymentsToFalse([false, _this.user.uuid]);
            }
            else {
                return result;
            }
        })
            .then(function () { return _this.querySvc.insertFormOfPayment(_this.paymentObjToArray()); });
    };
    PaymentsSvc.prototype.changeActivePayement = function () {
        var _this = this;
        var state;
        this.inputs.active === "true" ? state = false : state = true;
        console.log('change active payments', this.inputs.active, this.inputs, state);
        return this.querySvc.updateAllFormsOfPaymentToFalse([false, this.user.uuid])
            .then(function (result) { return _this.querySvc.updateActiveFormOfPayment([state, _this.inputs.card_number, _this.user.uuid]); });
    };
    PaymentsSvc.prototype.getFormOfPayement = function () {
        console.log(this.user.uuid, this.inputs.card_number);
        console.log(this.inputs);
        return this.querySvc.getFormOfPayment([this.user.uuid, this.inputs.card_number]);
    };
    PaymentsSvc.prototype.formatUpdateValueArray = function () {
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
        ];
    };
    PaymentsSvc.prototype.updateFormOfPayment = function () {
        return this.querySvc.updateFormOfPayment(this.formatUpdateValueArray());
    };
    PaymentsSvc.prototype.deleteFormOfPayment = function () {
        return this.querySvc.deleteFormOfPayement([this.user.uuid, this.inputs.card_number]);
    };
    return PaymentsSvc;
}());
exports.default = PaymentsSvc;
//# sourceMappingURL=logic-payments.js.map