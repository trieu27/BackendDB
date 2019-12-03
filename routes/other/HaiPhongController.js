const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const HaiPhongControl = mongoose.model('haiphong_collections');
const hpType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let hpType = await hpGetType();
    res.render('other/HaiPhong/AddOrEdit', {
        viewTitle: "Thêm Mới",
        hpType: hpType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var HaiPhong = new HaiPhongControl();
    HaiPhong.Name = req.body.Name;
    HaiPhong.Info = req.body.Info;
    HaiPhong.Loai = req.body.Loai;
    HaiPhong.img_url = req.body.img_url;
    HaiPhong.detail = req.body.detail;
    HaiPhongControl.findOne({ Name: HaiPhong.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/HaiPhong/create');
        }
        else {
            HaiPhong.save(async function (err, doc) {
                if (!err)
                    res.redirect('HaiPhong/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let hpType = await hpGetType();
                        res.render("other/HaiPhong/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            HaiPhong: req.body,
                            hpType: hpType
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
    HaiPhongControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) {
            res.redirect('HaiPhong/list');
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('other/HaiPhong/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    HaiPhong: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    HaiPhongControl.find(function (err, docs) {
        if (!err) {
            res.render('other/HaiPhong/list', {
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

async function hpGetType(req, res) {
    try {
        const post = await hpType.find({ dependent: 'Giới thiệu chung về Hải Phòng' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated,async function (req, res) {
    let hpType = await hpGetType();
    HaiPhongControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('other/HaiPhong/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                HaiPhong: doc,
                hpType: hpType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    HaiPhongControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/HaiPhong/list');
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

module.exports.HaiPhongCount = async function HaiPhongCount(req, res) {
    try {
        const count = await HaiPhongControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.HaiPhongGetNewest = async function HaiPhongGetNewest(req, res) {
    try {
        const post = await HaiPhongControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.HaiPhongGetOldest = async function HaiPhongGetOldest(req, res) {
    try {
        const post = await HaiPhongControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}