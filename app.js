var createError = require('http-errors');
var express = require('express');
const fileupload = require("express-fileupload");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
global.appRoot = path.resolve(__dirname);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var bodyParser = require("body-parser");
var cors = require('cors');
var helmet = require('helmet');

var app = express();
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors());
app.use(fileupload())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var dbMenuItems = require('./MySql/API/MenuItems/MenuItemsAPI');
var dbPageItems = require('./Mysql/API/PageItems/PageItemsAPI');
var dbMediaItems = require('./Mysql/API/MediaItems/MediaItemsAPI');
var dbErrorItems = require('./Mysql/API/ErrorItems/ErrorItemsAPI');

app.get('/getMenuItems', dbMenuItems.getMenuItems);
app.get('/getMediaItems', dbMediaItems.getMediaItems);
app.post('/addMenuItem', dbMenuItems.addMenuItem);

app.post('/editMenuItem', dbMenuItems.editMenuItem);
app.post('/addMediaItem', dbMediaItems.addMediaItem);
app.get('/getPageItems', dbPageItems.getPageItems);
app.post('/addPageItem', dbPageItems.addPageItem);
app.post('/editPageItem', dbPageItems.editPageItem);
app.post('/getPageInfo', dbPageItems.getPageInfo);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use('/public/images',express.static(__dirname + '/public/images'));
//app.use(express.static('files'));
app.use('/files', express.static(__dirname + '\\files'));
//app.use('/files/images', express.static(__dirname + '/images'));
//app.use('/files/videos', express.static(__dirname + '/videos'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  dbErrorItems.addErrorItem(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
