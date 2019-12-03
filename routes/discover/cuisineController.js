const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const cuisineControl = mongoose.model('amthuc_collections');
const cuisineType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let cuisineType = await cuisineGetType();
    res.render('discover/cuisine/AddOrEdit', {
        viewTitle: "Thêm Mới",
        cuisineType: cuisineType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var cuisine = new cuisineControl();
    cuisine.Name = req.body.Name;
    cuisine.Info = req.body.Info;
    cuisine.Loai = req.body.Loai;
    cuisine.img_url = req.body.img_url;
    cuisine.detail = req.body.detail;
    cuisineControl.findOne({ Name: cuisine.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/cuisine/create');
        }
        else {
            cuisine.save(async function (err, doc) {
                if (!err)
                    res.redirect('cuisine/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let cuisineType = await cuisineGetType();
                        res.render("discover/cuisine/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            cuisine: req.body,
                            cuisineType: cuisineType
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
    cuisineControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) {
            res.redirect('cuisine/list');
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('discover/cuisine/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    cuisine: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    cuisineControl.find(function (err, docs) {
        if (!err) {
            res.render('discover/cuisine/list', {
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

async function cuisineGetType(req, res) {
    try {
        const post = await cuisineType.find({ dependent: 'Khám phá ẩm thực' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let cuisineType = await cuisineGetType();
    cuisineControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('discover/cuisine/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                cuisine: doc,
                cuisineType: cuisineType
            });
        }
    });
});


router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    cuisineControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/cuisine/list');
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

module.exports.cuisineCount = async function cuisineCount(req, res) {
    try {
        const count = await cuisineControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.cuisineGetNewest = async function cuisineGetNewest(req, res) {
    try {
        const post = await cuisineControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.cuisineGetOldest = async function cuisineGetOldest(req, res) {
    try {
        const post = await cuisineControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}