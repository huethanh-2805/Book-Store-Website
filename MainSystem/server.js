require ('dotenv').config();
const path=require('path');
const morgan=require('morgan');
const express=require ('express');
const {engine}=require('express-handlebars');
const methodOverride=require("method-override");
const cookieParser=require("cookie-parser");
const https=require('https');
const bodyparser = require("body-parser");

const app=express();
const port=process.env.MAIN_PORT || 3000;

const db=require('./utils/db');
const fs = require('fs');
const route=require("./routes");

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.use('/public/image',express.static(__dirname+'/public/image'));
app.use('/public/js',express.static(__dirname+'/public/js'));
app.use('/public/css',express.static(__dirname+'/public/css'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(methodOverride('_method'));

app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        helpers:{
            sum: (a,b)=>a+b,
            section:function(name, options){
                if(!this._sections){this._sections = {}};
                this._sections[name] = options.fn(this);
                return null;
            }
        }
    })
);

app.set('view engine','hbs');
app.set('views',path.join(__dirname,'views'));

const session=require('express-session')
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));

route(app);

app.use(cookieParser());

const credentials = {
    key: process.env.PRIVATE_KEY,
    cert: process.env.CERTIFICATE,
};

app.use((err, req, res, next) => {
    const statusCode = err.statusCode | 500;
    res.status(statusCode).send(err.message);
  });

var server = https.createServer(credentials, app);
server.listen(port, () =>
  console.log(`Auth server listening on port ${port}`));