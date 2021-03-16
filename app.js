var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var checkingThrough = require('./routes/')
var indexRouter = require('./routes/index');
var instant = require('./routes/instant');
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',checkingThrough);
app.use('/api', indexRouter);
app.use('/instant',instant);

module.exports = app;
