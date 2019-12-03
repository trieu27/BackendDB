// Import NodeJS-Express Modules
const express = require('express');
const path = require('path');
const expH = require('express-handlebars');
const cookieP = require('cookie-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bodyP = require('body-parser');

// Import Handicraft Modules

require('./models/control/db');
const control = require('./routes/control/index');
const type = require('./routes/control/typeController');
const users = require('./routes/control/users');
const cuisineControl = require('./routes/discover/cuisineController');
const eventControl = require('./routes/discover/eventController');
const experienceControl = require('./routes/discover/experienceController');
const restaurantControl = require('./routes/discover/restaurantController');
const shoppingControl = require('./routes/discover/shoppingController');
const touristDestinationControl = require('./routes/discover/touristDestinationController');
const atmControl = require('./routes/other/atmController');
const customerSupportControl = require('./routes/other/customerSupportController');
const HaiPhongControl = require('./routes/other/HaiPhongController');
const reviewControl = require('./routes/other/reviewController');
const seraiControl = require('./routes/other/seraiController');
const entertainmentControl = require('./routes/service/entertainmentController');
const hotelControl = require('./routes/service/hotelController');
const tourControl = require('./routes/service/tourController');
const transportControl = require('./routes/service/transportController');




var app = express();

app.use(bodyP.urlencoded({
    extended: true
}));
app.use(bodyP.json());
app.use(cookieP());

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expH({
    extname: 'hbs',
    defaultLayout: 'layout.hbs',
    layoutsDir: __dirname + '/views/layouts/'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.listen(8000, function () {
    console.log('Express server started at port : 8000');
});

app.use('/', control);
app.use('/type', type);
app.use('/users', users);
app.use('/atm', atmControl);
app.use('/cuisine', cuisineControl);
app.use('/customerSupport', customerSupportControl);
app.use('/entertainment', entertainmentControl)
app.use('/event', eventControl);
app.use('/experience', experienceControl);
app.use('/HaiPhong', HaiPhongControl);
app.use('/hotel', hotelControl);
app.use('/restaurant', restaurantControl);
app.use('/review', reviewControl);
app.use('/serai', seraiControl);
app.use('/shopping', shoppingControl);
app.use('/tour', tourControl);
app.use('/touristDestination', touristDestinationControl);
app.use('/transport', transportControl);


