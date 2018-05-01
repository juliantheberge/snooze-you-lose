import * as V from '../services/validation';
import * as R from '../services/value-objects';
import * as pg from 'pg';

import * as accounts from './queries-accounts';
import { AnalysisOptions } from 'aws-sdk/clients/cloudsearch';
 
export default class QuerySvc {
  conn:pg.PoolClient;

  constructor(conn : pg.PoolClient) {
    this.conn = conn;
  }

  // select
  getAllUsers(values:any):Promise<R.UserDB[]> {
    const text = 'SELECT * FROM users'
    return this.conn.query(text, values)
      .then(result => result.rows)
  }



  getUserViaEmail(values:V.Email[]) : Promise<R.UserDB> {
    const text = "SELECT * FROM users WHERE email = $1"
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Submitted email did not match anything in the database!')
        } else {
          return R.UserDB.fromJSON(result.rows[0]);
        }
      })
  }

  getSessionID(values:[V.UUID]) {
    const text = 'SELECT sessionid FROM session WHERE user_uuid = $1'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error( "Could not find your Your session does not match the saved session. Try to log in again.")
        } else {
          return result.rows[0].sessionid;
        }
      })
  }
  
  getUserOrgs(values:V.UUID[]) {
    const text = "SELECT * FROM user_orgs WHERE user_uuid = $1"
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          console.log('User has no saved orgs')
          return []
        } else {
          return result.rows;
        }
      })
  }

  getActiveOrg(values:[V.UUID, boolean]) {
    const text = 'SELECT * FROM user_orgs WHERE user_uuid = $1 and active = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          console.log('User has no active orgs.')
          return []
        } else {
          return result.rows[0];
        }
      })

  }

  getUserOrgsData(values:[V.UUID]) {
    const text = 'SELECT x.org_uuid, name, description, link, cause, active, img, org_sku, user_uuid FROM orgs x INNER JOIN user_orgs y ON x.org_uuid = y.org_uuid AND (user_uuid = $1)';
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          console.log('User has no saved orgs')
          return []
        } else {
          return result.rows
        }
      })
  }


  getUser(values:V.UUID[]) {
    const text = "SELECT * FROM users WHERE user_uuid = $1";
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'No user with that in the database, sorry.')
        } else {
          return result.rows[0];
        }
      })
  }

  getOrder(values:V.UUID[]) {
    const text = "SELECT * FROM orders WHERE user_uuid = $1"
    return this.conn.query(text, values);
  }

  getCart(values:V.UUID[]) {
    const text = 'SELECT * FROM cart WHERE user_uuid = $1'
    return this.conn.query(text, values);
  }

  getOrgs(values:null[]) {
    const text = 'SELECT * FROM orgs'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error ('Unable to retrieve orgs at this time. No orgs were present.')
        } else {
          for (let i = 0; i < result.rows.length; i++) {
            R.OrgsDB.fromJSON(result.rows[i])
          }
          return result.rows
        }
      })
  }

  getAllActiveAlarms(values:any):Promise<R.AlarmDB[]> {
    const text = 'SELECT * FROM alarms WHERE active = $1'
    values = [true]
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0){
          console.log('No alarms for any user')
        }
        return result.rows
      })
  }

  getUserAlarms(values:V.UUID[]):Promise<R.AlarmDB[]> {
    const text = 'SELECT * FROM alarms WHERE user_uuid = $1'
    return this.conn.query(text, values)
      .then(result => {
        for(let i = 0; i < result.rows.length; i++) {
          R.AlarmDB.fromJSON(result.rows[i])
        }
        return result.rows
      })
  }

  getUserAlarm(values:[V.UUID, V.UUID]):Promise<R.AlarmDB> {
    const text = 'SELECT * FROM alarms WHERE alarm_uuid = $1 AND user_uuid = $2'
    return this.conn.query(text, values)
      .then(result => {
        R.AlarmDB.fromJSON(result.rows[0])
        return result.rows[0]
      })
  }

  getUnpaidSnoozes(values : [V.UUID, boolean]) {
    const text = 'SELECT * FROM snoozes WHERE user_uuid = $1 AND paid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0 ) {
          console.log('there were no snoozes in this period')
          return []
        }  else {
          return result.rows
        }

      })
  }

  getUnpaidDismisses(values:[V.UUID, boolean]) {
    const text = 'SELECT * FROM dismisses WHERE user_uuid = $1 AND paid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0 ) {
          console.log('there were no dismisses in this period')
          return []
        } else {
          return result.rows
        }
      })
  }

  getUnpaidWakes(values:[V.UUID, boolean]) {
    const text = 'SELECT * FROM wakes WHERE user_uuid = $1 AND paid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0 ) {
          console.log('there were no wakes in this period')
          return []
        } else {
          return result.rows
        }
      })
  }

  getUserSettings(values:V.UUID[]) {
    const text = 'SELECT * FROM user_settings where user_uuid = $1'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'Nothing in the database here...')
        } else {
          return result.rows[0];
        }
      })
  }

  getUserFormsOfPayment(values:V.UUID[]) {
    const text = 'SELECT * FROM payment_credit WHERE user_uuid = $1'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          console.log('No saved payments')
          return [];
        } else {
          return result.rows;
        }
      })
  }

  getPendingPayments(values:[V.UUID, boolean]) {
    const text = 'SELECT org_trans_total FROM org_transactions WHERE org_uuid = $1 AND sent = $2';
    return this.conn.query(text, values)
  }

  getFormOfPayment(values:[V.UUID, string]):Promise<V.PaymentCredit> {
    const text = 'SELECT * FROM payment_credit WHERE user_uuid = $1 AND card_number = $2';
    return this.conn.query(text, values)
      .then(result => {
          if(result.rowCount === 0) {
            throw new Error ('Nothing in the database like that...')
          } else {
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
          }
        }
      })
  }

  getActiveFormOfPayment(values:[V.UUID, boolean]) {
    const text = 'SELECT * FROM payment_credit WHERE user_uuid = $1 AND active = $2'
    return this.conn.query(text, values) 
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error ('No active card on record.')
        } else {
          return result.rows[0].card_uuid
        }
      })
  }

  getDaysOfWeek(values:V.UUID[]) {
    const text = 'SELECT * FROM alarms WHERE alarm_uuid = $1 AND user_uuid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0 ) {
          throw new Error ('There was no alarm by that id that belonged to that user.')
        } else {
          return {
            mon:result.rows[0].mon,
            tues:result.rows[0].tues,
            wed:result.rows[0].wed,
            thur:result.rows[0].thur,
            fri:result.rows[0].fri,
            sat:result.rows[0].sat,
            sun:result.rows[0].sun,
          }
        }
      })
    }


  getPushSubscriptions(values:void[]):Promise<Subs[]> {
    const text = 'SELECT * FROM push_subs'
    return this.conn.query(text, values)
      .then(result => {
        return result.rows
      })
  }

  checkUserSubscriptions(values:[V.UUID]):Promise<boolean> {
    const text = 'SELECT * FROM push_subs WHERE user_uuid = $1'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          return false
        } else {
          return true
        }
      })
  }

  getAlarmState(values:[V.UUID]):Promise<string> {
    const text = 'SELECT state FROM alarms WHERE alarm_uuid = $1'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error ('Could not find alarm with that id in the database.')
        } else {
          return result.rows[0].state;
        }
      })
  }

  // insert


  insertUser(values: [V.Email, V.NumOnly, V.CharOnly, V.String, V.String]) {
    const text = 'INSERT INTO users(email, phone, name, password, permission) VALUES($1, $2, $3, $4, $5) RETURNING *'
    return this.conn.query(text, values)
      .then(result => result.rows[0])
  }

  insertNonce(values:[V.UUID, string]) {
    const text = 'INSERT INTO nonce (user_uuid, nonce) VALUES ($1, $2)';
    return this.conn.query(text, values)
      .then(result => result)
  }

  insertSession(values:[V.UUID, string]) {
    const text = 'INSERT INTO session (user_uuid, sessionID) VALUES ($1, $2)';
    return this.conn.query(text, values)
      .then(result => result.rows[0])
  }

  insertSettings(values:V.UUID[]) {
    const text = 'INSERT INTO user_settings(user_uuid) VALUES ($1)';
    return this.conn.query(text, values)
      .then(result => null)
  }

  insertAlarm(values: [V.UUID, string, string]) {
    const text = 'INSERT INTO alarms(user_uuid, title, time) VALUES ($1, $2, $3) RETURNING *';
    return this.conn.query(text, values);
  }

  // SHOULD I BE DEFINING A SPECIAL TYPE FOR THIS ARRAY?
  insertTransaction(values:any[]): Promise<any> {
    console.log('insert transaction started')
    const text = 'INSERT INTO transactions(user_uuid, recipient, payment_uuid, snoozes, dismisses, wakes, total) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *'
    return this.conn.query(text, values)
      .then(result => {
        console.log(result)
        return result.rows[0]
      })
  }

  // SHOULD I BE DEFINING A SPECIAL TYPE FOR THIS ARRAY?
  insertOrgPayment(values:any[]):Promise<void> {
    const text = 'INSERT INTO org_transactions(trans_uuid, user_uuid, recipient, org_trans_total, sent) VALUES ($1, $2, $3, $4, $5)'
    return this.conn.query(text, values)
      .then(result => {
        return null
      })
  }

  // SHOULD I BE DEFINING A SPECIAL TYPE FOR THIS ARRAY?
  insertRevenue(values:any[]) {
    const text = 'INSERT INTO revenue(trans_uuid, user_uuid, trans_revenue_total) VALUES ($1, $2, $3)'
    return this.conn.query(text, values)
  }

  insertUserOrg(values:V.UUID[]) {
    const text = 'INSERT INTO user_orgs(user_uuid, org_uuid) VALUES ($1, $2) RETURNING *'
    return this.conn.query(text, values)
      .then(result => {
        console.log('insert user orgs active', result.rows[0].active)
        return result.rows[0].active
      })
  }

  insertFormOfPayment(values:(string | V.UUID)[]) {
    const text = 'INSERT INTO payment_credit (user_uuid, card_number, name, exp_month, exp_date, cvv, address_1, city, state, zip) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    return this.conn.query(text, values)
  }

  insertCardToCart(values:[string, V.UUID]) {
    const text = 'INSERT INTO cart (card_number, user_uuid) VALUES ($1, $2)'
    return this.conn.query(text, values)
  }


  insertPushSubs(values:string[]):Promise<void> {
    const text = 'INSERT INTO push_subs (user_uuid, p256dh, auth, expiration_time, endpoint) VALUES ($1, $2, $3, $4, $5) RETURNING *'
    return this.conn.query(text, values)
      .then(result => {
        return null
      })
  }

  insertDismiss(values:V.UUID[]) {
    const text = 'INSERT INTO dismisses (alarm_uuid, user_uuid) VALUES ($1, $2)'
    return this.conn.query(text, values)
      .then(result => null)
  }

  insertSnooze(values: V.UUID[]) {
    const text = 'INSERT INTO snoozes (alarm_uuid, user_uuid) VALUES ($1, $2)'
    return this.conn.query(text, values)
      .then(result => null)
  }

  insertWake(values: V.UUID[]) {
    const text = 'INSERT INTO wakes (alarm_uuid, user_uuid) VALUES ($1, $2)'
    return this.conn.query(text, values)
      .then(result => null)
  }  

  // update
  updateSessionID(values:V.UUID[]):Promise<void> {
    const text = 'UPDATE session SET sessionid = $1 WHERE user_uuid = $2';
    return this.conn.query(text, values)
       .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'Nothing in the database here...')
        } else {
          return null;
        }
      })
  }

  updateAllUserOrgsToFalse(values:[boolean, V.UUID]) {
    const text = 'UPDATE user_orgs SET active = $1 WHERE user_uuid = $2'
    return this.conn.query(text, values)
       .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'Nothing in the database here...')
        } else {
          return null;
        }
      })
  }

  updateActiveOrg(values : [boolean, V.UUID, V.UUID]):Promise<void> {
    const text = 'UPDATE user_orgs SET active = $1 WHERE user_uuid = $2 AND org_uuid = $3';
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'Nothing in the database here...')
        } else {
          return null;
        }
      })
  }

  updateAllFormsOfPaymentToFalse(values:[boolean, V.UUID]):Promise<void> {
    const text = 'UPDATE payment_credit SET active = $1 WHERE user_uuid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'No form of payment with that id in the database.')
        } else {
          return null;
        }
      })
  }

  updateActiveFormOfPayment(values: [boolean, string, V.UUID]){
    console.log('update active forms of payment', values)
    const text = 'UPDATE payment_credit SET active = $1 WHERE (card_number, user_uuid) = ($2, $3) RETURNING *'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Nothing in the database here...')
        } else {
          return null
        }
      })
  }
  
  updateContactInformation(values: [string, V.Email, V.NumOnly, V.UUID]): Promise<void> {
    const text = 'UPDATE users SET (name, email, phone) = ($1,$2,$3) WHERE user_uuid = $4';
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Could not update contact info. No user with that id in the database.')
        } else {
          return null;
        }
      })
  }

  updateName(values: [string, V.UUID]): Promise<void> {
    const text = 'UPDATE users SET name = $1 WHERE user_uuid = $2';
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Could not update contact info. No user with that id in the database.')
        } else {
          return null;
        }
      })
  }

  updatePassword(values: [string, V.UUID]):Promise<void> {
    const text = 'UPDATE users SET password = $1 WHERE user_uuid = $2';
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Could not update password. No user with that id in the database.')
        } else {
          return null;
        }
      })
  }

  updatePaymentScheme(values : [string, V.UUID]) : Promise < void > {
    const text =  'UPDATE user_settings SET payment_scheme = $1 WHERE user_uuid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'Payment scheme doesnt exists for this user, or the user doesnt exists, thats not good at all')
        } else {
          return null;
        }
      })
  }

  updateMonthMax(values : [string, V.UUID]) : Promise < void > {
    const text =  'UPDATE user_settings SET month_max = $1 WHERE user_uuid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'Month max doesnt exists for this user, or the user doesnt exists, thats not good at all')
        } else {
          return null;
        }
      })
  }

  updatePricePerSnooze(values : [string, V.UUID]) : Promise < void > {
    const text =  'UPDATE user_settings SET snooze_price = $1 WHERE user_uuid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'Snooze price doesnt exists for this user, or the user doesnt exists, thats not good at all')
        } else {
          return null;
        }
      })
  }

    updatePricePerDismiss(values : [string, V.UUID]) : Promise < void > {
    const text =  'UPDATE user_settings SET dismiss_price = $1 WHERE user_uuid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'Dismiss price doesnt exist for this user, or the user doesnt exists, thats not good at all')
        } else {
          return null;
        }
      })
  }

  updatePricePerWake(values: [string, V.UUID]): Promise<void> {
    const text = 'UPDATE user_settings SET wake_price = $1 WHERE user_uuid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Wake price doesnt exist for this user, or the user doesnt exists, thats not good at all')
        } else {
          return null;
        }
      })
  }

  updateQuietAfter(values:[number, V.UUID]):Promise<void> {
    const text = 'UPDATE user_settings SET quiet_after = $1 WHERE user_uuid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Couldn\'t set ring duration becuase that user does not exist in the databse.')
        } else {
          return null;
        }
      })
  }

  updateSnoozeLength(values: [number, V.UUID]): Promise<void> {
    const text = 'UPDATE user_settings SET snooze_length = $1 WHERE user_uuid = $2'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Couldn\'t set snooze length becuase that user does not exist in the databse.')
        } else {
          return null;
        }
      })
  }

  updateUserPaymentsToFalse(values:[boolean, V.UUID]) {
    const text = 'UPDATE payment_credit SET active = $1 WHERE user_uuid = $2'
    return this.conn.query(text, values)
  }

  updateFormOfPayment(values : (V.UUID | string)[]){
    const text =  'UPDATE payment_credit SET (card_number, name, exp_month, exp_date, cvv, address_1, city, state, zip) = ($1, $2, $3, $4, $5, $6, $7, $8, $9) WHERE user_uuid = $10 AND card_number = $11'
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error( 'Something doesnt exist in the database..')
        } else {
          return null;
        }
      })
  }

  updateSnoozeToPaid(values:V.UUID[]) {
    const text = 'UPDATE snoozes SET paid = $1 WHERE snooze_uuid = $2';
    return this.conn.query(text, values);
  }
  updateDismissesToPaid(values:string[]) {
    const text = 'UPDATE dismisses SET paid = $1 WHERE dismiss_uuid = $2';
    return this.conn.query(text, values);
  }
  updateWakesToPaid(values:string[]) {
    const text = 'UPDATE wakes SET paid = $1 WHERE wake_uuid = $2';
    return this.conn.query(text, values);
  }

  updateOrgToPaid(values:string[]) {
    const text = 'UPDATE org_transactions SET sent = $1 WHERE recipient = $2';
    return this.conn.query(text, values);
  }

  updateAlarmTime(values: [string, V.UUID, V.UUID]): Promise<void>{
    const text = 'UPDATE alarms SET time = $1 WHERE alarm_uuid = $2 AND user_uuid = $3';
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error ('Cannot update alarms, it doesnt exist in the db.')
        } else {
          return null;
        }      
      })
  }

  updateAlarmTitle(values: [string, V.UUID, V.UUID]):Promise<void> {
    const text = 'UPDATE alarms SET title = $1 WHERE alarm_uuid = $2 AND user_uuid = $3';
    return this.conn.query(text,values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error ('That alarm no longer exists.')
        } else {
          return null
        }      
      })
  }

  updateAlarmToggleActive(values: [boolean, V.UUID, V.UUID]):Promise<void> {
    const text = 'UPDATE alarms SET active = $1 WHERE alarm_uuid = $2 AND user_uuid = $3';
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error ('That alarm no longer exists.')
        } else {
          return null;
        }      
      })
    }

  updateAlarmRepeat(values: [boolean, V.UUID, V.UUID]):Promise<void> {
    const text = 'UPDATE alarms SET repeat = $1 WHERE alarm_uuid = $2 AND user_uuid = $3';
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error ('That alarm no longer exists.')
        } else {
          return null;
        }      
      })
    }

  updateDaysOfWeek(values:(boolean|V.UUID)[]):Promise<void> {
    const text = "UPDATE alarms SET (mon, tues, wed, thur, fri, sat, sun) = ($1,$2,$3,$4,$5,$6,$7) WHERE user_uuid = $8 AND alarm_uuid = $9";
    return this.conn.query(text, values)
      .then(result => {
        if(result.rowCount === 0) {
          throw new Error ('Cannot update days of week because there was nothing in the database in that alarm.')
        } else {
          return null;
        }
      })
  }

  updateAlarmArchived(values:[V.Bool, V.UUID, V.UUID]):Promise<void> {
    const text = "UPDATE alarms SET archive = $1 WHERE alarm_uuid = $2 AND user_uuid = $3" 
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Cannot update archive because there was nothing in the database under that alarm or user.')
        } else {
          return null;
        }
      })
      .then(() => { // turn off alarms that are archived
        return this.updateAlarmToggleActive([false, values[1], values[2]])
      })
  }

  updateAlarmState(values:[string, V.UUID]) {
    const text = 'UPDATE alarms SET state = $1 WHERE alarm_uuid = $2';
    return this.conn.query(text,values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Cannot update state because there was nothing in the database under that alarm.')
        } else {
          return null;
        }
      })
  }

  incrementSnoozeTally(values:[V.UUID]):Promise<void> {
    const text = 'UPDATE alarms SET snooze_tally = snooze_tally + 1 WHERE alarm_uuid = $1';
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Cannot update snooze tally because there was nothing in the database under that alarm.')
        } else {
          return null;
        }
      })
  }

  resetSnoozeTally(values: [V.UUID]): Promise<void> {
    const text = 'UPDATE alarms SET snooze_tally = 0 WHERE alarm_uuid = $1';
    return this.conn.query(text, values)
      .then(result => {
        if (result.rowCount === 0) {
          throw new Error('Cannot update snooze tally because there was nothing in the database under that alarm.')
        } else {
          return null;
        }
      })
  }
  // delete
  deleteFormOfPayement(values:[V.UUID, string]) : Promise<void>{
    const text = 'DELETE FROM payment_credit WHERE user_uuid = $1 AND card_number = $2'
    return this.conn.query(text, values)
      .then(res => {
        return null;
      })
  }

  deleteUserAlarm(values:[V.UUID, V.UUID]) : Promise<void> {
    const text = 'DELETE FROM alarms WHERE alarm_uuid = $1 AND user_uuid = $2'
    return this.conn.query(text, values)
      .then(res => {
        return null;
      })
  }

  deleteUserAlarms(values: [V.UUID]) : Promise<void>{
    const text = 'DELETE FROM alarms WHERE user_uuid = $1'
    return this.conn.query(text, values)
      .then(res => {
        return null;
      })
  }

  deleteAccount(values: [V.UUID]): Promise<void> {
    const text = 'DELETE FROM users WHERE user_uuid = $1'
    return this.conn.query(text, values)
      .then(res => {
        return null;
      })
  }

  deletePushSub(values:[V.UUID]):Promise<void> {
    const text = 'DELETE FROM push_subs WHERE user_uuiid = $1'
    return this.conn.query(text, values)
      .then(result => null)
  }

  deleteFromUserOrgs(values:V.UUID[]):Promise<void> {
    const text = 'DELETE FROM user_orgs WHERE user_uuid = $1 AND org_uuid = $2'
    return this.conn.query(text, values)
      .then(result => null)
  }
};