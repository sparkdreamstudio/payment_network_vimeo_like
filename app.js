var createError = require('http-errors');
var express = require('express');
const router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var indexRouter = require('./routes/index')
var addBankRouter = require('./routes/addBankCard');
var addEmailRouter = require('./routes/addemail');
var addPhoneRouter = require('./routes/addphone');
var cancelTransactionRouter = require('./routes/cancelTransaction');
var cardlistRouter = require('./routes/cardlist');
var createsendTransactionRouter = require('./routes/createsendtransanction');
var getmonthstatementRouter = require('./routes/getmonthstatement');
var getuserinfoRouter = require('./routes/getuserinfo');
var getuserpandeRouter = require('./routes/getuserphoneandemail');
var payrequestRouter = require('./routes/payrequest');
var registbyemailRouter = require('./routes/registbyemail');
var registbyphoneRouter = require('./routes/registbyphone');
var removecardRouter = require('./routes/removebankcard');
var removephoneRouter = require('./routes/removephone');
var removeemailRouter = require('./routes/removeemail');
var requesttransactionRouter = require('./routes/requesttransaction');
var selectdateStateRouter = require('./routes/selectDateStatement');
var sendmoneytobankRouter = require('./routes/sendMoneyToBank');
var setprimarybankRouter = require('./routes/setprimarybankcard');
var verifyemailRouter = require('./routes/verifyemail');
var verifyphoneRouter = require('./routes/verifyphone');
var loginRouter = require('./routes/login');
var verifySSNRouter = require('./routes/verifyssn');
var logoutRouter = require('./routes/logout');
var moneytobankRouter= require('./routes/moneytobanklist')
var verifyBankCardRouter = require('./routes/verifybankcard');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router
app.use('/', indexRouter);
app.use('/addbankcard',addBankRouter);
app.use('/addphone',addPhoneRouter);
app.use('/addemail',addEmailRouter);
app.use('/canceltransaction',cancelTransactionRouter);
app.use('/cardlist',cardlistRouter);
app.use('/createsendtransaction',createsendTransactionRouter);
app.use('/getmonthstatement',getmonthstatementRouter);
app.use('/getuserinfo',getuserinfoRouter);
app.use('/getuserphoneandemail',getuserpandeRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/payrequest',payrequestRouter);
app.use('/registbyemail',registbyemailRouter);
app.use('/registbyphone',registbyphoneRouter);
app.use('/removebankcard',removecardRouter);
app.use('/moneytobanklist',moneytobankRouter);
app.use('/removeemail',removeemailRouter);
app.use('/removephone',removephoneRouter);
app.use('/requesttransaction',requesttransactionRouter);
app.use('/selectdatestatement',selectdateStateRouter);
app.use('/sendmoneytobank',sendmoneytobankRouter);
app.use('/setprimarybankcard',setprimarybankRouter);
app.use('/verifybankcard',verifyBankCardRouter);
app.use('/verifyemail',verifyemailRouter);
app.use('/verifyphone',verifyphoneRouter);
app.use('/verifyssn', verifySSNRouter);

//config session and cookie
indexRouter.use(cookieParser('tijn'));
indexRouter.use(session({
  name: 'tijn',
  secret: 'tijn',
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 1000*60*10 }
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
