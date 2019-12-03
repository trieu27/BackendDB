const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const seraiControl = mongoose.model('tramnghi_collections');
const seraiType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let seraiType = await seraiGetType();
    res.render('other/serai/AddOrEdit', {
        viewTitle: "Thêm Mới",
        seraiType: seraiType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var serai = new seraiControl();
    serai.Name = req.body.Name;
    serai.Loai = req.body.Loai;
    serai.Info = req.body.Info;
    serai.img_url = req.body.img_url;
    serai.detail = req.body.detail;
    seraiControl.findOne({ Name: serai.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/serai/create');
        }
        else {
            serai.save(async function (err, doc) {
                if (!err)
                    res.redirect('serai/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let seraiType = await seraiGetType();
                        res.render("other/serai/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            serai: req.body,
                            seraiType: seraiType
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
    seraiControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('serai/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('other/serai/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    serai: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    seraiControl.find(function (err, docs) {
        if (!err) {
            res.render('other/serai/list', {
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

async function seraiGetType(req, res) {
    try {
        const post = await seraiType.find({ dependent: 'Trạm dừng nghỉ' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let seraiType = await seraiGetType();
    seraiControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('other/serai/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                serai: doc,
                seraiType: seraiType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    seraiControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/serai/list');
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


module.exports.seraiCount = async function seraiCount(req, res) {
    try {
        const count = await seraiControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.seraiGetNewest = async function seraiGetNewest(req, res) {
    try {
        const post = await seraiControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.seraiGetOldest = async function seraiGetOldest(req, res) {
    try {
        const post = await seraiControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}