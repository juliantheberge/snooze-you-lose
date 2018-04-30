import CreateAcctSvc from '../logic/logic-accounts';
import { dbErrTranslator } from '../services/error-handling';
import * as express from 'express';
const accts = express.Router();

//to sign up page
accts.get('/new-account', (req, res) => res.render('new-account'));

// this seems to do nothing

accts.route('/accounts')
  .post((req,res) => {  
    req.CreateAcctSvc = new CreateAcctSvc(req.querySvc, req.body, req.sessionID)
    
    req.CreateAcctSvc.createAcct()
      .then((result)=> {
        res.render('login');
      })
      .catch((err) => {
        let stack = new Error().stack
        console.log('error', err, 'stack', stack)
        res.render('new-account', {
          dbError:dbErrTranslator(err)
        })
      })
  })

accts.route('/accounts/api')
  .post((req, res) => {
    req.CreateAcctSvc = new CreateAcctSvc(req.querySvc, req.body, req.sessionID)

    req.CreateAcctSvc.createAcct()
      .then((result) => {
        res.json({status:"OK"});
      })
      .catch((err) => {
        let stack = new Error().stack
        console.log('error', err, 'stack', stack)
        res.json({
          status:"FAILED",
          error:err,
          stack:stack
        })
      })
  })
export default accts;
