let express = require('express');
var exphbs  = require('express3-handlebars');
var handlebars = require('handlebars'),   
    groupBy = require('handlebars-group-by');

var bodyParser = require('body-parser');
var session = require('express-session');
// var cookieParser = require('cookie-parser');
// var MySQLStore = require('express-mysql-session')(session);
var flash = require('connect-flash');


var conn = require('./BD/config.js')
let app = express();
let port = process.env.PORT || 3000;
app.use(express.static(__dirname + '/public'));
// app.set('views', path.join(__dirname, 'views'))
//xet file views
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
groupBy(handlebars);
//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));


//sesion
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

//thông báo
app.use(flash());
app.use((req, res, next) =>{
    res.locals.success_mesages = req.flash('success')
    res.locals.error_messages = req.flash('error')
    next()
})


//router
app.use('/', require('./router/index'));
app.use('/nhanvienhanchinh', require('./router/nhanvienhanhchinh'));
app.use('/cayhethong', require('./router/systemtree'));
app.use('/admin',require('./router/admin'))
// app.use('/cayhethong',require('./router/systemtree'));

//Error Not Found
app.use(function(req,res){
    res.status(404).render('error/404PageNotFound');
});








app.listen(port);

console.log('RESTful API server started on: http://localhost:' + port);