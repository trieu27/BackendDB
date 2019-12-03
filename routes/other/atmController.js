const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const atmControl = mongoose.model('atm_collections');
const atmType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let atmType = await atmGetType();
    res.render('other/atm/AddOrEdit', {
        viewTitle: "Thêm Mới",
        atmType: atmType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var atm = new atmControl();
    atm.Name = req.body.Name;
    atm.Info = req.body.Info;
    atm.Loai = req.body.Loai;
    atm.img_url = req.body.img_url;
    atm.detail = req.body.detail;
    atmControl.findOne({ Name: atm.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/atm/create');
        }
        else {
            atm.save(async function (err, doc) {
                if (!err)
                    res.redirect('atm/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let atmType = await atmGetType();
                        res.render("other/atm/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            atm: req.body,
                            atmType: atmType
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
    atmControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('atm/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('other/atm/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    atm: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    atmControl.find(function (err, docs) {
        if (!err) {
            res.render('other/atm/list', {
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

async function atmGetType(req, res) {
    try {
        const post = await atmType.find({ dependent: 'Các cây ATM' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let atmType = await atmGetType();
    atmControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('other/atm/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                atm: doc,
                atmType: atmType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    atmControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/atm/list');
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

module.exports.atmCount = async function atmCount(req, res) {
    try {
        const count = await atmControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.atmGetNewest = async function atmGetNewest(req, res) {
    try {
        const post = await atmControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.atmGetOldest = async function atmGetOldest(req, res) {
    try {
        const post = await atmControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}