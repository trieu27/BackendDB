const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const entertainmentControl = mongoose.model('khuvuichoi_rapphim_collections');
const entertainmentType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let entertainmentType = await entertainmentGetType();
    res.render('service/entertainment/AddOrEdit', {
        viewTitle: "Thêm Mới",
        entertainmentType: entertainmentType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var entertainment = new entertainmentControl();
    entertainment.Name = req.body.Name;
    entertainment.Info = req.body.Info;
    entertainment.Loai = req.body.Loai;
    entertainment.img_url = req.body.img_url;
    entertainment.detail = req.body.detail;
    entertainmentControl.findOne({ Name: entertainment.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/entertainment/create');
        }
        else {
            entertainment.save(async function (err, doc) {
                if (!err)
                    res.redirect('entertainment/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let entertainmentType = await entertainmentGetType();
                        res.render("service/entertainment/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            entertainment: req.body,
                            entertainmentType: entertainmentType
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
    entertainmentControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('entertainment/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('service/entertainment/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    entertainment: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    entertainmentControl.find(function (err, docs) {
        if (!err) {
            res.render('service/entertainment/list', {
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

async function entertainmentGetType(req, res) {
    try {
        const post = await entertainmentType.find({ dependent: 'Khu vui chơi và rạp chiếu phim' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let entertainmentType = await entertainmentGetType();
    entertainmentControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('service/entertainment/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                entertainment: doc,
                entertainmentType: entertainmentType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    entertainmentControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/entertainment/list');
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

module.exports.entertainmentCount = async function entertainmentCount(req, res) {
    try {
        const count = await entertainmentControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.entertainmentGetNewest = async function entertainmentGetNewest(req, res) {
    try {
        const post = await entertainmentControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.entertainmentGetOldest = async function entertainmentGetOldest(req, res) {
    try {
        const post = await entertainmentControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}