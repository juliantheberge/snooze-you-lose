"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var hbs = require("express-handlebars");
var path = require("path");
var combiner_1 = require("./config/combiner");
var database_1 = require("./middleware/database");
var session = require("express-session");
var sessionCheck = require("./middleware/session-check");
var methodOverride = require("method-override");
var app = express();
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50kb' }));
app.set('view engine', "hbs");
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: __dirname + './../views/layouts/react.hbs',
    partialsDir: __dirname + './../views/partials',
    layoutsDir: __dirname + './../views/layouts'
}));
app.set('views', path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, './public')));
app.set('trust proxy', 1);
app.use(database_1.init(combiner_1.dbConfig));
//session using memory storage (I think this is application memory) for now. Will not be the case in production. see readme session stores
app.set('trust proxy', 1); // necessary of server is behind a proxy and using secure:true for cookie
app.use(session({
    name: 'id',
    secret: 'this is my secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
    },
}));
// AND REPORTS ON SESSION DATA
// app.use((req, res, next) => {
//   if (typeof req.session.user === 'undefined') {
//     console.log('user is undf')
//     console.log('user: ', req.session.user)
//     console.log('sessionID: ', req.sessionID)
//     // req.session.user = { permission: 'guest' }
//   } else if (req.session.user.permission === 'guest') {
//     console.log('user is guest')
//     console.log('user: ', req.session.user)
//     console.log('sessionID: ', req.sessionID)
//     // req.session.user = { permission: 'guest' }
//   } else {
//     console.log('user is a guest')
//     console.log('user: ', req.session.user)
//     console.log('sessionID: ', req.sessionID)
//   }
//
//   next();
// })
app.use(sessionCheck.check);
// app.use('/accounts/\*', sessionCheck.check)
// app.use('/admin/\*', sessionCheck.adminCheck)
app.use('/', require('./routes/index'));
app.use(function (req, res, next) {
    res.status(404);
    res.render('error', { errName: null, errMessage: "We couldn't find this page." });
});
app.use(function (err, req, res, next) {
    console.log('err name: ', err.name);
    console.log(err);
    if (err.name === 'PayloadTooLargeError') {
        res.status(413);
        res.render('error', { errName: err.message, errMessage: "You entered something over 50kb. Please make your inputs are smaller and try again." });
    }
    else if (err.name === 'ReferenceError') {
        res.status(500);
        res.render('error', { errName: err.message, errMessage: "Something was missing." });
    }
    else {
        res.status(500);
        res.render('error', { errName: err.message, errMessage: null });
    }
});
// production
// app.listen(8000, '172.31.31.153')
// localhost
app.listen(8000, 'localhost', function () {
    console.log('app is running');
});
// // easy switch to https
// http.createServer({
//    key: fs.readFileSync('key.pem'),
//    cert: fs.readFileSync('cert.pem'),
//    passphrase: 'Mapex133'
//  },
//   app).listen(3000, function () {
//    console.log('App running');
//  });
//# sourceMappingURL=app.js.map