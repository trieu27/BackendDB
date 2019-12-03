const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const touristDestinationControl = mongoose.model('diemdulich_collections');
const destinationType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let destinationType = await destinationGetType();
    res.render('discover/touristDestination/AddOrEdit', {
        viewTitle: "Thêm Mới",
        destinationType: destinationType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var touristDestination = new touristDestinationControl();
    touristDestination.Name = req.body.Name;
    touristDestination.Info = req.body.Info;
    touristDestination.Loai = req.body.Loai;
    touristDestination.img_url = req.body.img_url;
    touristDestination.detail = req.body.detail;
    touristDestinationControl.findOne({ Name: touristDestination.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/touristDestination/create');
        }
        else {
            touristDestination.save(async function (err, doc) {
                if (!err)
                    res.redirect('touristDestination/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let destinationType = await destinationGetType();
                        res.render("discover/touristDestination/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            touristDestination: req.body,
                            destinationType: destinationType
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
    touristDestinationControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) {
            res.redirect('touristDestination/list');
        }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('discover/touristDestination/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    touristDestination: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    touristDestinationControl.find(function (err, docs) {
        if (!err) {
            res.render('discover/touristDestination/list', {
                list: docs,
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

async function destinationGetType(req, res) {
    try {
        const post = await destinationType.find({ dependent: 'Các điểm du lịch' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let destinationType = await destinationGetType();
    touristDestinationControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('discover/touristDestination/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                touristDestination: doc,
                destinationType: destinationType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    touristDestinationControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/touristDestination/list');
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

module.exports.destinationCount = async function destinationCount(req, res) {
    try {
        const count = await touristDestinationControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.destinationGetNewest = async function destinationGetNewest(req, res) {
    try {
        const post = await touristDestinationControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.destinationGetOldest = async function destinationGetOldest(req, res) {
    try {
        const post = await touristDestinationControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}