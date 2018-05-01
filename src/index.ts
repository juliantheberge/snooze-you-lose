import * as express from 'express';
import auth from './routes/guest-authorization';
import accts from './routes/guest-accounts';
import appLayout from './middleware/choose-layout';
import allOrgs from './routes/organizations';

import profile from './routes/user-account'
import alarms from './routes/user-alarms';
import orgs from './routes/user-organizations';
import settings from './routes/user-settings';
import payment from './routes/user-payment';

import trans from './routes/user-trans'

import alarmsAPI from './routes/user-alarms-api';
import authAPI from './routes/guest-authorization-api';
const index = express.Router();

index.use('/', auth);
index.use('/', accts);
index.use('/app*', appLayout);
index.use('/app/orgs', allOrgs);
index.use('/app/accounts/:email', profile);
index.use('/app/accounts/:email/alarms', alarms);
index.use('/app/accounts/:email/orgs', orgs);
index.use('/app/accounts/:email/settings', settings);
index.use('/app/accounts/:email/payment', payment);
index.use('/app/accounts/:email/trans', trans);
// REACT AND REDUX
index.use('/', authAPI)
index.use('/app/accounts/:email/alarms', alarmsAPI);

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

export default index;
