import * as express from 'express';
import auth from './routes/guest-authorization';
import accts from './routes/guest-accounts';
import appLayout from './middleware/choose-layout';
import allOrgs from './routes/organizations';

import profile from './routes/user-account'
import allUserData from './routes/user-all';
import alarms from './routes/user-alarms';
import orgs from './routes/user-organizations';
import settings from './routes/user-settings';
import payment from './routes/user-payment';
import pusher from './routes/push-notifications';
import trans from './routes/user-trans'

import alarmsAPI from './routes/user-alarms-api';
const index = express.Router();

import {
    payPal,
    ach,
    aliPay,
    googlePlay,
    stripe
} from './services/transaction-helpers';
import * as R from './services/value-objects';
import * as V from './services/validation'

index.use('/', auth);
index.use('/', accts);
index.use('/', pusher);
// router.use('/', require('./guest/email'));
// router.use('/guest', require('./guest/shopping'));

index.use('/app*', appLayout)
index.use('/app/orgs', allOrgs);

// router.use('/admin', require('./admin/products'));
// router.use('/admin', require('./admin/coupons'));
// router.use('/admin', require('./admin/accounts'));

index.use('/app/accounts/:email', profile)
index.use('/app/accounts/:email', allUserData)
index.use('/app/accounts/:email/alarms', alarms);
index.use('/app/accounts/:email/orgs', orgs);
index.use('/app/accounts/:email/settings', settings);
index.use('/app/accounts/:email/payment', payment);
index.use('/app/accounts/:email/trans', trans)
// router.use('/accounts/:email', require('./account/cart'));
// router.use('/accounts/:email', require('./account/coupons'));
// router.use('/accounts/:email', require('./account/orders'));
// router.use('/accounts/:email', require('./account/transactions'));



index.route('/anythingatall').get((req,res) => res.json({status:"OK"}))


// ABSURD TRANS TEST

index.route('/trans')
    .get((req, res) => {
        console.log('testing get trans')
        res.redirect('/app/accounts')
    })
    .post((req, res) => {
        console.log('|||||||||||||||||', 'transaction started')
        let dismisses: number;
        let unpaidDismisses: any;
        let dismissTot: number;
        let snoozes: number;
        let unpaidSnoozes: any;
        let snoozeTot: number;
        let wakes: number;
        let unpaidWakes: any;
        let wakeTot: number;
        let total: number;
        let payment_uuid: string;
        let recipient: V.UUID;
        let org_trans_total: number;
        let trans_uuid: V.UUID;
        let revenue: number;
        let snoozePrice: number;
        let dismissPrice: number;
        let wakePrice: number;

        let user = R.UserSession.fromJSON(req.session.user);
        req.querySvc.getUnpaidSnoozes([user.uuid, false])
            .then((result) => {
                console.log('|||||||||||||||||', 'get unpaid snoozes', result.rows)
                console.log('|||||||||||||||||','snoozes', result.rowCount)
                snoozes = result.rowCount
                unpaidSnoozes = result.rows
                console.log(req.querySvc)
                return req.querySvc.getUnpaidDismisses([user.uuid, false])
            })
            .then((result) => {
                console.log('|||||||||||||||||','dismisses', result.rowCount)
                dismisses = result.rowCount
                unpaidDismisses = result.rows
                return req.querySvc.getUnpaidWakes([user.uuid, false])
            })
            .then((result) => {
                console.log('|||||||||||||||||','wakes', result.rowCount)
                wakes = result.rowCount
                unpaidWakes = result.rows
                return req.querySvc.getActiveOrg([user.uuid, true])
            })
            .then((activeOrg) => {
                recipient = activeOrg.org_uuid;
                console.log('|||||||||||||||||', recipient)
                return req.querySvc.getUserSettings([user.uuid])
            })
            .then((settings) => {
                snoozePrice = parseFloat(settings.snooze_price);
                dismissPrice = parseFloat(settings.dismiss_price);
                wakePrice = parseFloat(settings.wake_price);

                snoozeTot = (snoozePrice * snoozes)
                dismissTot = (dismissPrice * dismisses)
                wakeTot = (wakePrice * wakes)
                total = ( snoozeTot + dismissTot + wakeTot )

                org_trans_total = stripe.orgCut(total);
                revenue = stripe.revenue(total);

                let inputs = [
                        user.uuid,
                        recipient,
                        settings.active_payment,
                        snoozes,
                        dismisses,
                        wakes,
                        total
                    ]
                console.log('|||||||||||||||||', inputs)
                return req.querySvc.insertTransaction(inputs)
            })
            .then((result) => {
                trans_uuid = result.rows[0].trans_uuid // could just return trans_uuid
                console.log('|||||||||||||||||||', result.rows[0])
                let payArr = [];

                for (let i = 0; i < unpaidSnoozes.length; i++ ) {
                    let input = [ true, unpaidSnoozes[i].snooze_uuid]
                    let promise = req.querySvc.updateSnoozeToPaid(input);
                    payArr.push(promise)
                }

                for (let i = 0; i < unpaidDismisses.length; i++ ) {
                    let input = [ true, unpaidDismisses[i].dismiss_uuid]
                    let promise = req.querySvc.updateDismissesToPaid(input);
                    payArr.push(promise)
                }

                for (let i = 0; i < unpaidWakes.length; i++ ) {
                    let input = [ true, unpaidWakes[i].wakes_uuid]
                    let promise = req.querySvc.updateWakesToPaid(input);
                    payArr.push(promise)
                }

                return Promise.all(payArr)
            })
            .then((info) => { // why info?
                return req.querySvc.insertOrgPayment([trans_uuid, user.uuid, recipient, org_trans_total, false])
            })
            .then((result) => {
                return req.querySvc.insertRevenue([trans_uuid, user.uuid, revenue])
            })
            .then(() => res.redirect('/app/account'))
            .catch((error) => {
                console.log(error)
                throw new Error('there was an error: ' + error)
            })

    })




// REACT AND REDUX

index.use('/app/accounts/:email/alarms', alarmsAPI);

// subscribe to push this is working poorly


index.post('/subscribe', (req, res) => {
    // console.log('this is from the subscribe route', req.body, req.session.user)

    req.querySvc.checkUserSubscriptions([req.session.user.uuid])
        .then(boolean => {
            if (boolean) {
                console.log('no record of this users subscription')
                res.setHeader('Content-Type', 'applications/json')
                res.send(JSON.stringify({ data: { success: true, inDB: false } }))
                
            } else {
                console.log('this user is already subscribed')
                res.setHeader('Content-Type', 'applications/json')
                res.send(JSON.stringify({ data: { success: true, inDB:true } }))
            }
        })
        .catch(e => {
            console.log(e)
            res.status(500)
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify({
                error: {
                    id: 'unable-to-save-subscription',
                    message: 'The subscription was recieved but we were unable to save it to our database.',
                    e: e
                }
            }))
        })
    // check if user already has subscription
    // if not, add 
    // else move on to check
   
    // let uuid = '58354c53-18cf-4f36-bdea-571d5e9d59df'
    // if (req.session.user.uuid === 'user') {
    //     uuid = req.session.user.uuid
    // }
    // req.querySvc.insertPushSubs([uuid, req.body.keys.p256dh, req.body.keys.auth, req.body.expirationTime, req.body.endpoint])
    //     .then(() => {
    //         res.setHeader('Content-Type', 'applications/json')
    //         res.send(JSON.stringify({ data: { success: true } }))
    //     })
    //     .catch(e => {
    //         console.log(e)
    //         res.status(500)
    //         res.setHeader('Content-Type', 'application/json')
    //         res.send(JSON.stringify({
    //             error: {
    //                 id: 'unable-to-save-subscription',
    //                 message: 'The subscription was recieved but we were unable to save it to our database.',
    //                 e: e
    //             }
    //         }))
    //     })
})


// NEW NAME

index.post('/new-name', (req, res) => {
    if (!req.body) {
        return res.status(400).send({ error: true, message: 'Please provide new name' });
    }
    req.querySvc.updateName([req.body.name, req.session.user.uuid])
        .then(() => req.querySvc.getUser([req.session.user.uuid]))
        .then(user => {
            res.json(user)
        })
        .catch(e => console.log(e))
    
})

// HOME

index.get('/', (req, res) => {
    res.render('home', { home:true })
})

// TO LOGIN PAGE
index.get('/to-login', (req, res) => {
    res.render('login');
})

// APP
index.get('/app', (req, res) => 
    req.session.user ? res.redirect('app/account') : res.redirect('app/guest')
)

index.get('/app/guest', (req, res) => {
  res.render('guest/app')
})

index.get('/app/account', (req, res) => {
    req.session.user ? res.render('app') : res.redirect('/app/guest')
})

// NO JS ALARMS

index.get('/app/guest/alarms', (req, res) => {
    res.render('guest/alarms');
})

// TEST
let dummy = {
    "video": [
        {
            "id": "12312412312",
            "name": "Ecuaciones Diferenciales",
            "url": "/video/math/edo/12312412312",
            "author": {
                "data": [
                    {
                        "name_author": "Alejandro Morales",
                        "uri": "/author/alejandro-morales",
                        "type": "master"
                    }
                ]
            }
        }
    ]
}

index.get('/test', (req, res) => {
    res.render('test-page');
})


index.get('/dummy-route', (req, res) => {
  res.render('dummy');
})

export default index;
