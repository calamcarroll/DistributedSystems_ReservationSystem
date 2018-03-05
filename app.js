var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var router = express.Router();
var Routes = require('./routes/api')(router);// tells the application to use the router object with this route
//middleware that logs requests ie time of request and error code
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api',Routes);// allows server to use API file for all routes created
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static(__dirname, +'/public'));
//default error pages created by webstorm
var index = require('./routes/error pages/index');
var users = require('./routes/error pages/users');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// FOR WHEN ON HEROKU TO USE WHATEVER PORT THEY MIGHT HAVE. IF NOT THEN 2000
app.listen(process.env.PORT ||2000, function () {
    console.log('Listening to server on port 2000');
});
mongoose.connect('mongodb://localhost:27017/ReservationSystem', function(err){
    if(err){
        console.log('Could not connect to database ReservationSystem')
    }else{
        console.log('Connected Successful to ReservationSystem Database')
    }
});
///no matter what gets typed feed them the following page. Thats what the * does
app.get('*', function(req,res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'))
});
// bellow here is for when there is an error and what the default redirect page is
app.use('/', index);
app.use('/users', users);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
