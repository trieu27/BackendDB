const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const experienceControl = mongoose.model('trainghiem_collections');
const experienceType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let experienceType = await experienceGetType();
    res.render('discover/experience/AddOrEdit', {
        viewTitle: "Thêm Mới",
        experienceType: experienceType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var experience = new experienceControl();
    experience.Name = req.body.Name;
    experience.Info = req.body.Info;
    experience.Loai = req.body.Loai;
    experience.img_url = req.body.img_url;
    experience.detail = req.body.detail;
    experienceControl.findOne({ Name: experience.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/experience/create');
        }
        else {
            experience.save(async function (err, doc) {
                if (!err)
                    res.redirect('experience/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let experienceType = await experienceGetType();
                        res.render("discover/experience/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            experience: req.body,
                            experienceType: experienceType
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
    experienceControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('experience/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('discover/experience/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    experience: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    experienceControl.find(function (err, docs) {
        if (!err) {
            res.render('discover/experience/list', {
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

async function experienceGetType(req, res) {
    try {
        const post = await experienceType.find({ dependent: 'Các trải nghiệm du lịch' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let experienceType = await experienceGetType();
    experienceControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('discover/experience/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                experience: doc,
                experienceType: experienceType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    experienceControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/experience/list');
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


module.exports.experienceCount = async function experienceCount(req, res) {
    try {
        const count = await experienceControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.experienceGetNewest = async function experienceGetNewest(req, res) {
    try {
        const post = await experienceControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.experienceGetOldest = async function experienceGetOldest(req, res) {
    try {
        const post = await experienceControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}