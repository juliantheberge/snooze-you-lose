import OrgSvc from '../logic/logic-organizations';
import * as R from '../services/value-objects';
import * as express from 'express';
const orgs = express.Router();

orgs.route('/')
  .post((req, res) => {
    req.OrgSvc = new OrgSvc(req.querySvc, req.session.user, req.body.org_uuid)
    req.OrgSvc.addToUserOrgs()
      .then(() => res.redirect('/app/accounts/' + req.session.user.uuid + '/orgs'))
      .catch((error) => {
        console.log(error);
        res.render('organizations', error)
      })
  })
  .get((req, res) => {
      req.OrgSvc = new OrgSvc(req.querySvc, req.session.user, null)

      req.OrgSvc.getUserOrgsAndActiveOrg()
        .then(renderOrgs => {
          console.log('getuser orgs and active orgs', renderOrgs)
          res.render('organizations', renderOrgs)
        })
        .catch((err) => {
          console.log(err);
          res.render('organizations', { dbError: err });
        });
  })


orgs.route('/:org_uuid')
  .put((req,res) => {
    req.OrgSvc = new OrgSvc(req.querySvc, req.session.user, req.body.org_uuid)

    req.OrgSvc.setDefaultOrg()
      .then((result) => res.redirect('/app/accounts/' + req.session.user.uuid + '/orgs/' ))
      .catch((error) => {
        console.log(error)
        res.render('error', { errMessage:error })
      })
  })
  .delete((req,res) => {
    req.OrgSvc = new OrgSvc(req.querySvc, req.session.user, req.body.org_uuid)

    req.OrgSvc.removeFromUserOrgs()
      .then((result) => res.redirect('/app/accounts/' + req.session.user.uuid + '/orgs/' ))
      .catch((error) => {
        console.log(error)
        res.render('organizations', {error:error, dbError:'try refreshing the page'})
      })
  })

orgs.route('/:org_uuid/remove-default')
  .put((req, res) => {
    req.OrgSvc = new OrgSvc(req.querySvc, req.session.user, req.body.org_uuid)
    req.OrgSvc.unsetDefaultOrg()
      .then((result) => res.redirect('/app/accounts/' + req.session.user.uuid + '/orgs/' ))
      .catch((error) => {
        console.log(error)
        res.render('error', { errMessage:error })
      })
  })


export default orgs;


