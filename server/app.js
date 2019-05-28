var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose=require('mongoose');
var ejs = require('ejs')
// var index = require('./routers/index');
var users = require('./routers/users');
var goods = require('./routers/goods');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next) {
  if(req.cookies.userId){
    next();
  }else{
      if(req.originalUrl=='/users/login' || req.originalUrl=='/users/logout' || req.path=='/goods'){
          next();
      }else{
          res.json({
            status:'1',
            msg:'当前未登录',
            result:''
          });
      }
  }
});

// app.use('/', index);
app.use('/api-dev/users', users);
app.use('/api-dev/goods', goods);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

//连接MongoDB数据库
// var db = 'mongodb://localhost:27017/dumall';

var db = 'mongodb://cjh:cjh666@120.77.246.68:3389/dumall';
// 连接
mongoose.connect(db);
var connection = mongoose.connection;
//检测是否连接成功
connection.on('connected', function() {
  console.log('数据库连接成功');
});
connection.once('open', function(callback){
  console.log('数据库启动了');
});


module.exports = app;
