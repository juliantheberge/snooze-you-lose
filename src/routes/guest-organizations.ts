import * as express from 'express';
import * as r from '../services/value-objects'
import { deepMerge } from '../services/merge'
import { db } from '../middleware/database';
const gOrgs = express.Router();

// gOrgs.route('/orgs')
//   .post((req, res) => {
//     // all happens via admin
//   })
//   .get((req, res) => {
//     let user = r.UserSession.fromJSON(req.session.user)

//     req.aQuery.selectOrgs([])
//       .then((result) => {
//         let organizationContent = result.rows;

//         for (let i = 0; i < organizationContent.length; i++) {
//           let org = r.OrgsDB.fromJSON(organizationContent[i]) // at least it catches problems
//           organizationContent[i].email = user.email;
//           // organizationContent[i].frontEndID = idMaker(organizationContent[i].name)
//         }

//         res.render('guest/organizations', {
//           organizationContent:organizationContent,
//           email: user.email
//         })
//       })
//       .catch((err) => {
//         console.log(err);
//         res.render('guest/organizations', { dbError: err });
//       });
//   })


gOrgs.route('/')
  .post((req, res) => {
    // all happens via admin
  })
  .get((req, res) => {
    req.aQuery.selectOrgs([])
      .then((result) => {
        let organizationContent = result.rows;

        for (let i = 0; i < organizationContent.length; i++) {
          let org = r.OrgsDB.fromJSON(organizationContent[i]) // at least it catches problems
          // organizationContent[i].frontEndID = idMaker(organizationContent[i].name)
        }
        res.render('guest/organizations', {
          organizationContent:organizationContent
        })
      })
      .catch((err) => {
        console.log(err);
        res.render('guest/organizations', { dbError: err });
      });
  })

export default gOrgs;
