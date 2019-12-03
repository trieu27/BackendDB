const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const typeControl = mongoose.model('type_collections');
const typeDetail = mongoose.model('type_detail_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let nameCollection = await getNameCollection();
    res.render('type/AddOrEdit', {
        viewTitle: "Thêm Mới",
        nameCollection: nameCollection
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var type = new typeControl();
    type.maLoai = req.body.maLoai;
    type.tenLoai = req.body.tenLoai;
    type.dependent = req.body.dependent;
    typeControl.findOne({ tenLoai: type.tenLoai }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/type/create');
        }

        else {
            type.save(async function (err, doc) {
                if (!err)
                    res.redirect('type/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let nameCollection = await getNameCollection();
                        res.render("type/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            type: req.body,
                            nameCollection: nameCollection
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

    typeControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('type/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('type/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    type: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    typeControl.find(function (err, docs) {
        if (!err) {
            res.render('type/list', {
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
            case 'maLoai':
                body['maLoaiError'] = err.errors[field].message;
                break;
            case 'tenLoai':
                body['tenLoaiError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

async function getNameCollection(req, res) {
    try {
        const post = await typeDetail.find();
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let nameCollection = await getNameCollection();
    typeControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('type/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                type: doc,
                nameCollection: nameCollection
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    typeControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/type/list');
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

module.exports.typeCount = async function typeCount(req, res) {
    try {
        const count = await typeControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.typeGetNewest = async function typeGetNewest(req, res) {
    try {
        const post = await typeControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.typeGetOldest = async function typeGetOldest(req, res) {
    try {
        const post = await typeControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}