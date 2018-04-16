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


const index = express.Router();


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
// router.use('/accounts/:email', require('./account/cart'));
// router.use('/accounts/:email', require('./account/coupons'));
// router.use('/accounts/:email', require('./account/orders'));
// router.use('/accounts/:email', require('./account/transactions'));


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
    res.render('test-page')
})


index.get('/dummy-route', (req, res) => {
  res.render('dummy');
})

export default index;
