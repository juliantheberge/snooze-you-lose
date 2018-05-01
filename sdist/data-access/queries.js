"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var R = require("../services/value-objects");
var QuerySvc = /** @class */ (function () {
    function QuerySvc(conn) {
        this.conn = conn;
    }
    // select
    QuerySvc.prototype.getAllUsers = function (values) {
        var text = 'SELECT * FROM users';
        return this.conn.query(text, values)
            .then(function (result) { return result.rows; });
    };
    QuerySvc.prototype.getUserViaEmail = function (values) {
        var text = "SELECT * FROM users WHERE email = $1";
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Submitted email did not match anything in the database!');
            }
            else {
                return R.UserDB.fromJSON(result.rows[0]);
            }
        });
    };
    QuerySvc.prototype.getSessionID = function (values) {
        var text = 'SELECT sessionid FROM session WHERE user_uuid = $1';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error("Could not find your Your session does not match the saved session. Try to log in again.");
            }
            else {
                return result.rows[0].sessionid;
            }
        });
    };
    QuerySvc.prototype.getUserOrgs = function (values) {
        var text = "SELECT * FROM user_orgs WHERE user_uuid = $1";
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                console.log('User has no saved orgs');
                return [];
            }
            else {
                return result.rows;
            }
        });
    };
    QuerySvc.prototype.getActiveOrg = function (values) {
        var text = 'SELECT * FROM user_orgs WHERE user_uuid = $1 and active = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                console.log('User has no active orgs.');
                return [];
            }
            else {
                return result.rows[0];
            }
        });
    };
    QuerySvc.prototype.getUserOrgsData = function (values) {
        var text = 'SELECT x.org_uuid, name, description, link, cause, active, img, org_sku, user_uuid FROM orgs x INNER JOIN user_orgs y ON x.org_uuid = y.org_uuid AND (user_uuid = $1)';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                console.log('User has no saved orgs');
                return [];
            }
            else {
                return result.rows;
            }
        });
    };
    QuerySvc.prototype.getUser = function (values) {
        var text = "SELECT * FROM users WHERE user_uuid = $1";
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('No user with that in the database, sorry.');
            }
            else {
                return result.rows[0];
            }
        });
    };
    QuerySvc.prototype.getOrder = function (values) {
        var text = "SELECT * FROM orders WHERE user_uuid = $1";
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.getCart = function (values) {
        var text = 'SELECT * FROM cart WHERE user_uuid = $1';
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.getOrgs = function (values) {
        var text = 'SELECT * FROM orgs';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Unable to retrieve orgs at this time. No orgs were present.');
            }
            else {
                for (var i = 0; i < result.rows.length; i++) {
                    R.OrgsDB.fromJSON(result.rows[i]);
                }
                return result.rows;
            }
        });
    };
    QuerySvc.prototype.getAllActiveAlarms = function (values) {
        var text = 'SELECT * FROM alarms WHERE active = $1';
        values = [true];
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                console.log('No alarms for any user');
            }
            return result.rows;
        });
    };
    QuerySvc.prototype.getUserAlarms = function (values) {
        var text = 'SELECT * FROM alarms WHERE user_uuid = $1';
        return this.conn.query(text, values)
            .then(function (result) {
            for (var i = 0; i < result.rows.length; i++) {
                R.AlarmDB.fromJSON(result.rows[i]);
            }
            return result.rows;
        });
    };
    QuerySvc.prototype.getUserAlarm = function (values) {
        var text = 'SELECT * FROM alarms WHERE alarm_uuid = $1 AND user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            R.AlarmDB.fromJSON(result.rows[0]);
            return result.rows[0];
        });
    };
    QuerySvc.prototype.getUnpaidSnoozes = function (values) {
        var text = 'SELECT * FROM snoozes WHERE user_uuid = $1 AND paid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                console.log('there were no snoozes in this period');
                return [];
            }
            else {
                return result.rows;
            }
        });
    };
    QuerySvc.prototype.getUnpaidDismisses = function (values) {
        var text = 'SELECT * FROM dismisses WHERE user_uuid = $1 AND paid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                console.log('there were no dismisses in this period');
                return [];
            }
            else {
                return result.rows;
            }
        });
    };
    QuerySvc.prototype.getUnpaidWakes = function (values) {
        var text = 'SELECT * FROM wakes WHERE user_uuid = $1 AND paid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                console.log('there were no wakes in this period');
                return [];
            }
            else {
                return result.rows;
            }
        });
    };
    QuerySvc.prototype.getUserSettings = function (values) {
        var text = 'SELECT * FROM user_settings where user_uuid = $1';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Nothing in the database here...');
            }
            else {
                return result.rows[0];
            }
        });
    };
    QuerySvc.prototype.getUserFormsOfPayment = function (values) {
        var text = 'SELECT * FROM payment_credit WHERE user_uuid = $1';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                console.log('No saved payments');
                return [];
            }
            else {
                return result.rows;
            }
        });
    };
    QuerySvc.prototype.getPendingPayments = function (values) {
        var text = 'SELECT org_trans_total FROM org_transactions WHERE org_uuid = $1 AND sent = $2';
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.getFormOfPayment = function (values) {
        var text = 'SELECT * FROM payment_credit WHERE user_uuid = $1 AND card_number = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Nothing in the database like that...');
            }
            else {
                return {
                    name: result.rows[0].name,
                    card_number: result.rows[0].card_number,
                    exp_date: result.rows[0].exp_date,
                    exp_month: result.rows[0].exp_month,
                    cvv: result.rows[0].cvv,
                    address_1: result.rows[0].address_1,
                    city: result.rows[0].city,
                    state: result.rows[0].state,
                    zip: result.rows[0].zip,
                    user_uuid: result.rows[0].user_uuid
                };
            }
        });
    };
    QuerySvc.prototype.getActiveFormOfPayment = function (values) {
        var text = 'SELECT * FROM payment_credit WHERE user_uuid = $1 AND active = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('No active card on record.');
            }
            else {
                return result.rows[0].card_uuid;
            }
        });
    };
    QuerySvc.prototype.getDaysOfWeek = function (values) {
        var text = 'SELECT * FROM alarms WHERE alarm_uuid = $1 AND user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('There was no alarm by that id that belonged to that user.');
            }
            else {
                return {
                    mon: result.rows[0].mon,
                    tues: result.rows[0].tues,
                    wed: result.rows[0].wed,
                    thur: result.rows[0].thur,
                    fri: result.rows[0].fri,
                    sat: result.rows[0].sat,
                    sun: result.rows[0].sun,
                };
            }
        });
    };
    QuerySvc.prototype.getPushSubscriptions = function (values) {
        var text = 'SELECT * FROM push_subs';
        return this.conn.query(text, values)
            .then(function (result) {
            return result.rows;
        });
    };
    QuerySvc.prototype.checkUserSubscriptions = function (values) {
        var text = 'SELECT * FROM push_subs WHERE user_uuid = $1';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                return false;
            }
            else {
                return true;
            }
        });
    };
    QuerySvc.prototype.getAlarmState = function (values) {
        var text = 'SELECT state FROM alarms WHERE alarm_uuid = $1';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Could not find alarm with that id in the database.');
            }
            else {
                return result.rows[0].state;
            }
        });
    };
    // insert
    QuerySvc.prototype.insertUser = function (values) {
        var text = 'INSERT INTO users(email, phone, name, password, permission) VALUES($1, $2, $3, $4, $5) RETURNING *';
        return this.conn.query(text, values)
            .then(function (result) { return result.rows[0]; });
    };
    QuerySvc.prototype.insertNonce = function (values) {
        var text = 'INSERT INTO nonce (user_uuid, nonce) VALUES ($1, $2)';
        return this.conn.query(text, values)
            .then(function (result) { return result; });
    };
    QuerySvc.prototype.insertSession = function (values) {
        var text = 'INSERT INTO session (user_uuid, sessionID) VALUES ($1, $2)';
        return this.conn.query(text, values)
            .then(function (result) { return result.rows[0]; });
    };
    QuerySvc.prototype.insertSettings = function (values) {
        var text = 'INSERT INTO user_settings(user_uuid) VALUES ($1)';
        return this.conn.query(text, values)
            .then(function (result) { return null; });
    };
    QuerySvc.prototype.insertAlarm = function (values) {
        var text = 'INSERT INTO alarms(user_uuid, title, time) VALUES ($1, $2, $3) RETURNING *';
        return this.conn.query(text, values);
    };
    // SHOULD I BE DEFINING A SPECIAL TYPE FOR THIS ARRAY?
    QuerySvc.prototype.insertTransaction = function (values) {
        var text = 'INSERT INTO transactions(user_uuid, recipient, payment_uuid, snoozes, dismisses, wakes, total) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
        return this.conn.query(text, values)
            .then(function (result) {
            return result.rows[0];
        });
    };
    // SHOULD I BE DEFINING A SPECIAL TYPE FOR THIS ARRAY?
    QuerySvc.prototype.insertOrgPayment = function (values) {
        var text = 'INSERT INTO org_transactions(trans_uuid, user_uuid, recipient, org_trans_total, sent) VALUES ($1, $2, $3, $4, $5)';
        return this.conn.query(text, values)
            .then(function (result) {
            return null;
        });
    };
    // SHOULD I BE DEFINING A SPECIAL TYPE FOR THIS ARRAY?
    QuerySvc.prototype.insertRevenue = function (values) {
        var text = 'INSERT INTO revenue(trans_uuid, user_uuid, trans_revenue_total) VALUES ($1, $2, $3)';
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.insertUserOrg = function (values) {
        var text = 'INSERT INTO user_orgs(user_uuid, org_uuid) VALUES ($1, $2) RETURNING *';
        return this.conn.query(text, values)
            .then(function (result) {
            return result.rows[0].active;
        });
    };
    QuerySvc.prototype.insertFormOfPayment = function (values) {
        var text = 'INSERT INTO payment_credit (user_uuid, card_number, name, exp_month, exp_date, cvv, address_1, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.insertCardToCart = function (values) {
        var text = 'INSERT INTO cart (card_number, user_uuid) VALUES ($1, $2)';
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.insertPushSubs = function (values) {
        var text = 'INSERT INTO push_subs (user_uuid, p256dh, auth, expiration_time, endpoint) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        return this.conn.query(text, values)
            .then(function (result) {
            return null;
        });
    };
    QuerySvc.prototype.insertDismiss = function (values) {
        var text = 'INSERT INTO dismisses (alarm_uuid, user_uuid) VALUES ($1, $2)';
        return this.conn.query(text, values)
            .then(function (result) { return null; });
    };
    QuerySvc.prototype.insertSnooze = function (values) {
        var text = 'INSERT INTO snoozes (alarm_uuid, user_uuid) VALUES ($1, $2)';
        return this.conn.query(text, values)
            .then(function (result) { return null; });
    };
    QuerySvc.prototype.insertWake = function (values) {
        var text = 'INSERT INTO wakes (alarm_uuid, user_uuid) VALUES ($1, $2)';
        return this.conn.query(text, values)
            .then(function (result) { return null; });
    };
    // update
    QuerySvc.prototype.updateSessionID = function (values) {
        var text = 'UPDATE session SET sessionid = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Nothing in the database here...');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateAllUserOrgsToFalse = function (values) {
        var text = 'UPDATE user_orgs SET active = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Nothing in the database here...');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateActiveOrg = function (values) {
        var text = 'UPDATE user_orgs SET active = $1 WHERE user_uuid = $2 AND org_uuid = $3';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Nothing in the database here...');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateAllFormsOfPaymentToFalse = function (values) {
        var text = 'UPDATE payment_credit SET active = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('No form of payment with that id in the database.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateActiveFormOfPayment = function (values) {
        console.log('update active forms of payment', values);
        var text = 'UPDATE payment_credit SET active = $1 WHERE (card_number, user_uuid) = ($2, $3) RETURNING *';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Nothing in the database here...');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateContactInformation = function (values) {
        var text = 'UPDATE users SET (name, email, phone) = ($1,$2,$3) WHERE user_uuid = $4';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Could not update contact info. No user with that id in the database.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateName = function (values) {
        var text = 'UPDATE users SET name = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Could not update contact info. No user with that id in the database.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updatePassword = function (values) {
        var text = 'UPDATE users SET password = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Could not update password. No user with that id in the database.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updatePaymentScheme = function (values) {
        var text = 'UPDATE user_settings SET payment_scheme = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Payment scheme doesnt exists for this user, or the user doesnt exists, thats not good at all');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateMonthMax = function (values) {
        var text = 'UPDATE user_settings SET month_max = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Month max doesnt exists for this user, or the user doesnt exists, thats not good at all');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updatePricePerSnooze = function (values) {
        var text = 'UPDATE user_settings SET snooze_price = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Snooze price doesnt exists for this user, or the user doesnt exists, thats not good at all');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updatePricePerDismiss = function (values) {
        var text = 'UPDATE user_settings SET dismiss_price = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Dismiss price doesnt exist for this user, or the user doesnt exists, thats not good at all');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updatePricePerWake = function (values) {
        var text = 'UPDATE user_settings SET wake_price = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Wake price doesnt exist for this user, or the user doesnt exists, thats not good at all');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateQuietAfter = function (values) {
        var text = 'UPDATE user_settings SET quiet_after = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Couldn\'t set ring duration becuase that user does not exist in the databse.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateSnoozeLength = function (values) {
        var text = 'UPDATE user_settings SET snooze_length = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Couldn\'t set snooze length becuase that user does not exist in the databse.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateUserPaymentsToFalse = function (values) {
        var text = 'UPDATE payment_credit SET active = $1 WHERE user_uuid = $2';
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.updateFormOfPayment = function (values) {
        var text = 'UPDATE payment_credit SET (card_number, name, exp_month, exp_date, cvv, address_1, city, state, zip) = ($1, $2, $3, $4, $5, $6, $7, $8, $9) WHERE user_uuid = $10 AND card_number = $11';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Something doesnt exist in the database..');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateSnoozeToPaid = function (values) {
        var text = 'UPDATE snoozes SET paid = $1 WHERE snooze_uuid = $2';
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.updateDismissesToPaid = function (values) {
        var text = 'UPDATE dismisses SET paid = $1 WHERE dismiss_uuid = $2';
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.updateWakesToPaid = function (values) {
        var text = 'UPDATE wakes SET paid = $1 WHERE wake_uuid = $2';
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.updateOrgToPaid = function (values) {
        var text = 'UPDATE org_transactions SET sent = $1 WHERE recipient = $2';
        return this.conn.query(text, values);
    };
    QuerySvc.prototype.updateAlarmTime = function (values) {
        var text = 'UPDATE alarms SET time = $1 WHERE alarm_uuid = $2 AND user_uuid = $3';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Cannot update alarms, it doesnt exist in the db.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateAlarmTitle = function (values) {
        var text = 'UPDATE alarms SET title = $1 WHERE alarm_uuid = $2 AND user_uuid = $3';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('That alarm no longer exists.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateAlarmToggleActive = function (values) {
        var text = 'UPDATE alarms SET active = $1 WHERE alarm_uuid = $2 AND user_uuid = $3';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('That alarm no longer exists.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateAlarmRepeat = function (values) {
        var text = 'UPDATE alarms SET repeat = $1 WHERE alarm_uuid = $2 AND user_uuid = $3';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('That alarm no longer exists.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateDaysOfWeek = function (values) {
        var text = "UPDATE alarms SET (mon, tues, wed, thur, fri, sat, sun) = ($1,$2,$3,$4,$5,$6,$7) WHERE user_uuid = $8 AND alarm_uuid = $9";
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Cannot update days of week because there was nothing in the database in that alarm.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.updateAlarmArchived = function (values) {
        var _this = this;
        var text = "UPDATE alarms SET archive = $1 WHERE alarm_uuid = $2 AND user_uuid = $3";
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Cannot update archive because there was nothing in the database under that alarm or user.');
            }
            else {
                return null;
            }
        })
            .then(function () {
            return _this.updateAlarmToggleActive([false, values[1], values[2]]);
        });
    };
    QuerySvc.prototype.updateAlarmState = function (values) {
        var text = 'UPDATE alarms SET state = $1 WHERE alarm_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Cannot update state because there was nothing in the database under that alarm.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.incrementSnoozeTally = function (values) {
        var text = 'UPDATE alarms SET snooze_tally = snooze_tally + 1 WHERE alarm_uuid = $1';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Cannot update snooze tally because there was nothing in the database under that alarm.');
            }
            else {
                return null;
            }
        });
    };
    QuerySvc.prototype.resetSnoozeTally = function (values) {
        var text = 'UPDATE alarms SET snooze_tally = 0 WHERE alarm_uuid = $1';
        return this.conn.query(text, values)
            .then(function (result) {
            if (result.rowCount === 0) {
                throw new Error('Cannot update snooze tally because there was nothing in the database under that alarm.');
            }
            else {
                return null;
            }
        });
    };
    // delete
    QuerySvc.prototype.deleteFormOfPayement = function (values) {
        var text = 'DELETE FROM payment_credit WHERE user_uuid = $1 AND card_number = $2';
        return this.conn.query(text, values)
            .then(function (res) {
            return null;
        });
    };
    QuerySvc.prototype.deleteUserAlarm = function (values) {
        var text = 'DELETE FROM alarms WHERE alarm_uuid = $1 AND user_uuid = $2';
        return this.conn.query(text, values)
            .then(function (res) {
            return null;
        });
    };
    QuerySvc.prototype.deleteUserAlarms = function (values) {
        var text = 'DELETE FROM alarms WHERE user_uuid = $1';
        return this.conn.query(text, values)
            .then(function (res) {
            return null;
        });
    };
    QuerySvc.prototype.deleteAccount = function (values) {
        var text = 'DELETE FROM users WHERE user_uuid = $1';
        return this.conn.query(text, values)
            .then(function (res) {
            return null;
        });
    };
    QuerySvc.prototype.deletePushSub = function (values) {
        var text = 'DELETE FROM push_subs WHERE user_uuiid = $1';
        return this.conn.query(text, values)
            .then(function (result) { return null; });
    };
    QuerySvc.prototype.deleteFromUserOrgs = function (values) {
        var text = 'DELETE FROM user_orgs WHERE user_uuid = $1 AND org_uuid = $2';
        return this.conn.query(text, values)
            .then(function (result) { return null; });
    };
    return QuerySvc;
}());
exports.default = QuerySvc;
;
//# sourceMappingURL=queries.js.map