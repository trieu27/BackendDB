const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const tourControl = mongoose.model('tour_collections');
const tourType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let tourType = await tourGetType();
    res.render('service/tour/AddOrEdit', {
        viewTitle: "Thêm Mới",
        tourType: tourType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var tour = new tourControl();
    tour.Name = req.body.Name;
    tour.Info = req.body.Info;
    tour.Loai = req.body.Loai;
    tour.ChiTiet = req.body.ChiTiet;
    tour.img_url = req.body.img_url;
    tour.detail = req.body.detail;
    tourControl.findOne({ Name: tour.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/tour/create');
        }
        else {
            tour.save(async function (err, doc) {
                if (!err)
                    res.redirect('tour/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let tourType = await tourGetType();
                        res.render("service/tour/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            tour: req.body,
                            tourType: tourType
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
    tourControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) {
            res.redirect('tour/list');
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('service/tour/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    tour: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    tourControl.find(function (err, docs) {
        if (!err) {
            res.render('service/tour/list', {
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
            case 'ChiTiet':
                body['ChiTietError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

async function tourGetType(req, res) {
    try {
        const post = await tourType.find({ dependent: 'Các Tour du lịch' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let tourType = await tourGetType();
    tourControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('service/tour/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                tour: doc,
                tourType: tourType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    tourControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/tour/list');
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

module.exports.tourCount = async function tourCount(req, res) {
    try {
        const count = await tourControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.tourGetNewest = async function tourGetNewest(req, res) {
    try {
        const post = await tourControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.tourGetOldest = async function tourGetOldest(req, res) {
    try {
        const post = await tourControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}