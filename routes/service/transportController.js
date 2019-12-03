const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const transportControl = mongoose.model('phuongtien_collections');
const transportType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let transportType = await transportGetType();
    res.render('service/transport/AddOrEdit', {
        viewTitle: "Thêm Mới",
        transportType: transportType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var transport = new transportControl();
    transport.Name = req.body.Name;
    transport.Info = req.body.Info;
    transport.Loai = req.body.Loai;
    transport.img_url = req.body.img_url;
    transport.detail = req.body.detail;
    transportControl.findOne({ Name: transport.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/transport/create');
        }
        else {
            transport.save(async function (err, doc) {
                if (!err)
                    res.redirect('transport/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let transportType = await transportGetType();
                        res.render("service/transport/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            transport: req.body,
                            transportType: transportType
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
    transportControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('transport/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('service/transport/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    transport: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    transportControl.find(function (err, docs) {
        if (!err) {
            res.render('service/transport/list', {
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

async function transportGetType(req, res) {
    try {
        const post = await transportType.find({ dependent: 'Các phương tiện di chuyển' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let transportType = await transportGetType();
    transportControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('service/transport/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                transport: doc,
                transportType: transportType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    transportControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/transport/list');
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

module.exports.transportCount = async function transportCount(req, res) {
    try {
        const count = await transportControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.transportGetNewest = async function transportGetNewest(req, res) {
    try {
        const post = await transportControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.transportGetOldest = async function transportGetOldest(req, res) {
    try {
        const post = await transportControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}