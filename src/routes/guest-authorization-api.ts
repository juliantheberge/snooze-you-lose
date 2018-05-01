import AuthSvc, { regenerateSession, updateToInactiveSessionID, destroySession } from '../logic/logic-authorization';
import * as express from 'express';
const authAPI = express.Router();

authAPI.post('/authorized/api', (req, res) => {
  let inputs = {
    email: req.body.email,
    password: req.body.password
  }

  regenerateSession(req.session)
    .then(() => {
      req.AuthSvc = new AuthSvc(req.querySvc, inputs, req.sessionID)
      return req.AuthSvc.doAuth()
    })
    .then((userDataForSession) => {
      req.session.user = userDataForSession
      res.json({redirect:"/app"})
    })
    .catch(err => {
      console.log(err.message, err)
      console.log(JSON.stringify(err))
      res.json({
        status:"failed",
        error:err.message
      })
    })
})

export default authAPI;