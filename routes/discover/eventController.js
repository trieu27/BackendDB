const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const eventControl = mongoose.model('sukien_collections');
const eventType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let eventType = await eventGetType();
    res.render('discover/event/AddOrEdit', {
        viewTitle: "Thêm Mới",
        eventType: eventType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var event = new eventControl();
    event.Name = req.body.Name;
    event.Info = req.body.Info;
    event.Loai = req.body.Loai;
    event.img_url = req.body.img_url;
    event.detail = req.body.detail;
    eventControl.findOne({ Name: event.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/event/create');
        }
        else {
            event.save(async function (err, doc) {
                if (!err)
                    res.redirect('event/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let eventType = await eventGetType();
                        res.render("discover/event/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            event: req.body,
                            eventType: eventType
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
    eventControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('event/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('discover/event/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    event: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    eventControl.find(function (err, docs) {
        if (!err) {
            res.render('discover/event/list', {
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

async function eventGetType(req, res) {
    try {
        const post = await eventType.find({ dependent: 'Các sự kiện' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let eventType = await eventGetType();
    eventControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('discover/event/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                event: doc,
                eventType: eventType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    eventControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/event/list');
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

module.exports.eventCount = async function eventCount(req, res) {
    try {
        const count = await eventControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.eventGetNewest = async function eventGetNewest(req, res) {
    try {
        const post = await eventControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.eventGetOldest = async function eventGetOldest(req, res) {
    try {
        const post = await eventControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}