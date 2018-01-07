"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const async_database_1 = require("../middleware/async-database");
const router = express.Router();
router.get('/new-payment', (req, res) => {
    let email = req.session.user.email;
    res.render('new-payment', {
        email: email
    });
});
router.route('/payment')
    .get((req, res) => {
    async_database_1.db.query("SELECT * FROM payment_credit WHERE user_uuid = $1", [req.session.user.uuid])
        .then((result) => {
        let paymentContent = result.rows;
        res.render('payments', {
            paymentContent: paymentContent,
            email: req.session.user.email
        });
    })
        .catch((error) => {
        console.log(error);
        res.render('payments', {
            dbError: error
        });
    });
})
    .post((req, res) => {
    let uuid = req.session.user.uuid;
    let email = req.session.user.email;
    let inputs = {
        name: req.body.name,
        cardNumber: req.body.cardNumber,
        expDay: req.body.expDay,
        expMonth: req.body.expMonth,
        cvv: req.body.cvv,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
    };
    async_database_1.db.query('SELECT * FROM payment_credit WHERE user_uuid = $1', [uuid])
        .then((result) => {
        if (result.rows.length > 0) {
            return async_database_1.db.query('UPDATE payment_credit SET active = $1 WHERE user_uuid = $2', [false, uuid]);
        }
    })
        .then((result) => {
        return async_database_1.db.query('INSERT INTO payment_credit (user_uuid, card_number, name, exp_month, exp_date, cvv, address_1, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [uuid, inputs.cardNumber, inputs.name, inputs.expMonth, inputs.expDay, inputs.cvv, inputs.address, inputs.city, inputs.state, inputs.zip]);
    })
        .then((result) => {
        res.render('new-payment', {
            success: true,
            name: inputs.name,
            address: inputs.address,
            city: inputs.city,
            state: inputs.state,
            zip: inputs.zip,
            email: email
        });
    })
        .catch((error) => {
        console.log(error);
        res.render('new-payment', {
            dbError: error
        });
    });
});
router.route('/payment/active-payment')
    .put((req, res) => {
    let card_number = req.body.card_number;
    console.log(card_number);
    async_database_1.db.query('UPDATE payment_credit SET active = $1 WHERE user_uuid = $2', [false, req.session.user.uuid])
        .then((result) => {
        return async_database_1.db.query('UPDATE payment_credit SET active = $1 WHERE (card_number, user_uuid) = ($2, $3)', [true, card_number, req.session.user.uuid]);
    })
        .then((result) => {
        res.redirect('/accounts/' + req.session.user.email + '/payment');
    })
        .catch((error) => {
        console.log(error);
        res.render('payments', {
            dbError: error
        });
    });
});
router.route('/payment/:credit')
    .get((req, res) => {
    // show users particular payment
})
    .put((req, res) => {
    // update all of the information (no partial change)
})
    .delete((req, res) => {
    // remove card information entirely
});
module.exports = router;
//# sourceMappingURL=payment.js.map