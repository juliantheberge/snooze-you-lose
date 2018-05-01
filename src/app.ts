// const https = require('https');
// const http = require('http');
import * as fs from "fs"; // only using with https
import * as express from "express";
import * as bodyParser from "body-parser";
import * as hbs from "express-handlebars";
import * as path from "path";
import * as session from "express-session";
import * as methodOverride from 'method-override';
import * as cors from 'cors';
import index from './index';
import errors from './errors'
import { dbConfig } from "./services/db-connect-config";
import { init } from './middleware/database'
import AlarmTrigger from './services/alarm-trigger'
import renderState from './middleware/server-render-state';
import sessionCheck from "./middleware/session-check";


const app = express();
app.use(express.static(path.join(__dirname, './public/rollup')));

app.use(methodOverride('_method'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true,limit:'50kb'}));
app.set('view engine', "hbs");
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout:__dirname + './../views/layouts/website.hbs',
  partialsDir:__dirname + './../views/partials',
  layoutsDir:__dirname + './../views/layouts'
}));
app.set('views', path.join(__dirname, "../views"));
app.use(express.static(path.join(__dirname, './public')));


app.set('trust proxy', 1);

app.use(init(dbConfig));
// for cross origin fetch
app.options('*', cors())
app.use(cors())
//session using memory storage for now. Will not be the case in production. see readme session stores
app.set('trust proxy', 1) // necessary of server is behind a proxy and using secure:true for cookie
app.use(session({
  name:'id',
  secret: 'this is my secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
      httpOnly:true,
      // secure: true // will not send cookie unless https connection is established
    },
  })
);

app.use(sessionCheck);
app.use(renderState);
app.use('/', index)

// AUTONOMOUS ALARM
const alarmTrigger = new AlarmTrigger(dbConfig)
alarmTrigger.start()

// ERROR STUFF

app.use(errors)

// AWS HOSTING
// app.listen(8000, '172.31.31.153')

// localhost
app.listen(3000, 'localhost')

// // easy switch to https
// http.createServer({
//    key: fs.readFileSync('key.pem'),
//    cert: fs.readFileSync('cert.pem'),
//    passphrase: 'Mapex133'
//  },
//   app).listen(3000, function () {
//    console.log('App running');
//  });
