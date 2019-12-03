const express = require('express');
const mongoose = require('mongoose');
var router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;
const Users = mongoose.model('user');

router.get('/register', function (req, res) {
    res.render('begin/register');
});

router.get('/login', function (req, res) {
    res.render('begin/login');
});

router.post('/register', function (req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    req.checkBody('name', 'Yêu cầu nhập họ tên').notEmpty();
    req.checkBody('email', 'Yêu cầu nhập email').notEmpty();
    req.checkBody('email', 'Email không tồn tại').isEmail();
    req.checkBody('username', 'Yêu cầu nhập tên đăng nhập').notEmpty();
    req.checkBody('password', 'Yêu cầu nhập mật khẩu').notEmpty();
    req.checkBody('password2', 'Mật khẩu nhập lại không khớp').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        res.render('begin/register', {
            errors: errors
        });
    }
    else {
        Users.findOne({ username: username }, function (err, check) {
            if (err) console.log(err);
            if (check) {
                req.flash('error_msg', 'Tên đăng nhập đã tồn tại');
                res.redirect('/users/register');
            }
            else {
                Users.findOne({ email: email }, function (err, test) {
                    if (err) console.log(err);
                    if (test) {
                        req.flash('error_msg', 'Email đã tồn tại');
                        res.redirect('/users/register');
                    }
            else {
                var newUser = new Users({
                    name: name,
                    email: email,
                    username: username,
                    password: password
                });
                Users.createUser(newUser, function (err, user) {
                    if (err) throw err;
                });
                req.flash('success_msg', 'Đăng ký thành công. Bạn có thể đăng nhập');
                res.redirect('/users/login');
            }
              });
             }
        });
    }
});

passport.use(new LocalStrategy(function (username, password, done) {
    Users.getUserByUsername(username, function (err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, { message: 'Sai tên đăng nhập' });
        }
        Users.comparePassword(password, user.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            }
            else {
                return done(null, false, { message: 'Sai mật khẩu' });
            }
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Users.getUserByID(id, function (err, user) {
        done(err, user);
    });
});

router.post('/login', passport.authenticate('local',
    { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    function (req, res) {
        res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success_msg', 'Đăng xuất thành công');
    res.redirect('/users/login');
});

router.get('/create', ensureAuthenticated, function (req, res) {
    res.render('users/AddUser', {
        viewTitle: "Thêm Người Dùng"
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var client = new Users();
    client.name = req.body.name;
    client.email = req.body.email;
    client.username = req.body.username;
    client.password = req.body.password;

    Users.findOne({ username: client.username }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đăng nhập đã tồn tại');
            res.redirect('/users/create');
        }
        else {
            Users.findOne({ email: email }, function (err, test) {
                if (err) console.log(err);
                if (test) {
                    req.flash('error_msg', 'Email đã tồn tại');
                    res.redirect('/users/register');
                }
        else {
            Users.createUser(client, function (err, user) {
                if (!err) {
                    req.flash('success_msg', 'Successful');
                    res.redirect('/users/list');
                }
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        res.render("users/AddUser", {
                            viewTitle: "Thêm Mới",
                            client: req.body
                        });
                    }
                    else
                        console.log('Error during record insertion : ' + err);
                }
            });
        }
    });
}
    });
}


function updateRecord(req, res) {
    // hash password before save
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hashedPassword) {
            const update = {
                ...req.body,
                password: hashedPassword
            }
            Users.findOneAndUpdate({ _id: req.body._id }, update, { new: true }, function (err, doc) {
                if (!err) {
                    // doc update
                    res.redirect('users/list');
                }
                else {

                    res.render('users/AddUser', {
                        viewTitle: 'Update User',
                        client: req.body
                    });
                }

            });
        });


    });
}

router.get('/list', ensureAuthenticated, function (req, res) {

    Users.find(function (err, docs) {
        if (!err) {
            res.render('users/list', {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving service list :' + err);
        }
    });
});


function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'name':
                body['nameError'] = err.errors[field].message;
                break;
            case 'email':
                body['emailError'] = err.errors[field].message;
                break;
            case 'username':
                body['usernameError'] = err.errors[field].message;
                break;
            case 'password':
                body['passwordError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

router.get('/modify/:id', ensureAuthenticated, function (req, res) {
    Users.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('users/EditUser', {
                viewTitle: "Update User",
                client: doc
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    Users.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/users/list');
        }
        else { console.log('Error in service delete :' + err); }
    });
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {

        res.redirect('/users/login');
    }
}

module.exports = router;

module.exports.userCount = async function userCountCount(req, res) {
    try {
        const count = await Users.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.userGetNewest = async function userGetNewest(req, res) {
    try {
        const post = await Users.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.userGetOldest = async function userGetOldest(req, res) {
    try {
        const post = await Users.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

