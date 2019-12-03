const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const hotelControl = mongoose.model('khachsan_collections');
const hotelType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let hotelType = await hotelGetType();
    res.render('service/hotel/AddOrEdit', {
        viewTitle: "Thêm Mới",
        hotelType: hotelType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var hotel = new hotelControl();
    hotel.Name = req.body.Name;
    hotel.Info = req.body.Info;
    hotel.Loai = req.body.Loai;
    hotel.img_url = req.body.img_url;
    hotel.detail = req.body.detail;
    hotelControl.findOne({ Name: hotel.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/hotel/create');
        }
        else {
            hotel.save(async function (err, doc) {
                if (!err)
                    res.redirect('hotel/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let hotelType = await hotelGetType();
                        res.render("service/hotel/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            hotel: req.body,
                            hotelType: hotelType
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
    hotelControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('hotel/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('service/hotel/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    hotel: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    hotelControl.find(function (err, docs) {
        if (!err) {
            res.render('service/hotel/list', {
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

async function hotelGetType(req, res) {
    try {
        const post = await hotelType.find({ dependent: 'Khách sạn' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let hotelType = await hotelGetType();
    hotelControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('service/hotel/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                hotel: doc,
                hotelType: hotelType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    hotelControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/hotel/list');
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

module.exports.hotelCount = async function hotelCount(req, res) {
    try {
        const count = await hotelControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.hotelGetNewest = async function hotelGetNewest(req, res) {
    try {
        const post = await hotelControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.hotelGetOldest = async function hotelGetOldest(req, res) {
    try {
        const post = await hotelControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}