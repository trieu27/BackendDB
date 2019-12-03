const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const shoppingControl = mongoose.model('muasam_collections');
const shoppingType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let shoppingType = await shoppingGetType();
    res.render('discover/shopping/AddOrEdit', {
        viewTitle: "Thêm Mới",
        shoppingType: shoppingType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var shopping = new shoppingControl();
    shopping.Name = req.body.Name;
    shopping.Info = req.body.Info;
    shopping.Loai = req.body.Loai;
    shopping.img_url1 = req.body.img_url1;
    shopping.img_url2 = req.body.img_url2;
    shopping.detail = req.body.detail;
    shoppingControl.findOne({ Name: shopping.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/shopping/create');
        }
        else {
            shopping.save(async function (err, doc) {
                if (!err)
                    res.redirect('shopping/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let shoppingType = await shoppingGetType();
                        res.render("discover/shopping/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            shopping: req.body,
                            shoppingType: shoppingType
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
    shoppingControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('shopping/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('discover/shopping/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    shopping: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    shoppingControl.find(function (err, docs) {
        if (!err) {
            res.render('discover/shopping/list', {
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

async function shoppingGetType(req, res) {
    try {
        const post = await shoppingType.find({ dependent: 'Các địa điểm mua sắm' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let shoppingType = await shoppingGetType();
    shoppingControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('discover/shopping/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                shopping: doc,
                shoppingType: shoppingType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    shoppingControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/shopping/list');
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

module.exports.shoppingCount = async function shoppingCount(req, res) {
    try {
        const count = await shoppingControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.shoppingGetNewest = async function shoppingGetNewest(req, res) {
    try {
        const post = await shoppingControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.shoppingGetOldest = async function shoppingGetOldest(req, res) {
    try {
        const post = await shoppingControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}