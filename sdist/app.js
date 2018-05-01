"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var hbs = require("express-handlebars");
var path = require("path");
var session = require("express-session");
var methodOverride = require("method-override");
var cors = require("cors");
var index_1 = require("./index");
var errors_1 = require("./errors");
var db_connect_config_1 = require("./services/db-connect-config");
var database_1 = require("./middleware/database");
var alarm_trigger_1 = require("./services/alarm-trigger");
var server_render_state_1 = require("./middleware/server-render-state");
var session_check_1 = require("./middleware/session-check");
var app = express();
app.use(express.static(path.join(__dirname, './public/rollup')));
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50kb' }));
app.set('view engine', "hbs");
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: __dirname + './../views/layouts/website.hbs',
    partialsDir: __dirname + './../views/partials',
    layoutsDir: __dirname + './../views/layouts'
}));
app.set('views', path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, './public')));
app.set('trust proxy', 1);
app.use(database_1.init(db_connect_config_1.dbConfig));
// for cross origin fetch
app.options('*', cors());
app.use(cors());
//session using memory storage for now. Will not be the case in production. see readme session stores
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
app.use(session_check_1.default);
app.use(server_render_state_1.default);
app.use('/', index_1.default);
// AUTONOMOUS ALARM
var alarmTrigger = new alarm_trigger_1.default(db_connect_config_1.dbConfig);
alarmTrigger.start();
// ERROR STUFF
app.use(errors_1.default);
// AWS HOSTING
// app.listen(8000, '172.31.31.153')
// localhost
app.listen(3000, 'localhost', function () { return console.log('app running'); });
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