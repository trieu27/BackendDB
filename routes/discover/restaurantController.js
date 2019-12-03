const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const restaurantControl = mongoose.model('nhahang_collections');
const restaurantType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let restaurantType = await restaurantGetType();
    res.render('discover/restaurant/AddOrEdit', {
        viewTitle: "Thêm Mới",
        restaurantType: restaurantType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var restaurant = new restaurantControl();
    restaurant.Name = req.body.Name;
    restaurant.Info = req.body.Info;
    restaurant.Loai = req.body.Loai;
    restaurant.img_url1 = req.body.img_url1;
    restaurant.img_url2 = req.body.img_url2;
    restaurant.detail = req.body.detail;
    restaurantControl.findOne({ Name: restaurant.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/restaurant/create');
        }
        else {
            restaurant.save(async function (err, doc) {
                if (!err)
                    res.redirect('restaurant/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let restaurantType = await restaurantGetType();
                        res.render("discover/restaurant/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            restaurant: req.body,
                            restaurantType: restaurantType
                        });
                    }
                    else
                        console.log('Error during record insertion : ' + err);
                }
            });
        }
    });
}

function updateRecord(req, res) {
    restaurantControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('restaurant/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('discover/restaurant/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    restaurant: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    restaurantControl.find(function (err, docs) {
        if (!err) {
            res.render('discover/restaurant/list', {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving review list :' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'Name':
                body['NameError'] = err.errors[field].message;
                break;
            case 'Info':
                body['InfoError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

async function restaurantGetType(req, res) {
    try {
        const post = await restaurantType.find({ dependent: 'Hệ thống nhà hàng' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let restaurantType = await restaurantGetType();
    restaurantControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('discover/restaurant/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                restaurant: doc,
                restaurantType: restaurantType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    restaurantControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/restaurant/list');
        }
        else { console.log('Error in review delete :' + err); }
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

module.exports.restaurantCount = async function restaurantCount(req, res) {
    try {
        const count = await restaurantControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.restaurantGetNewest = async function restaurantGetNewest(req, res) {
    try {
        const post = await restaurantControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.restaurantGetOldest = async function restaurantGetOldest(req, res) {
    try {
        const post = await restaurantControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}