const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const reviewControl = mongoose.model('review_collections');
const reviewType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let reviewType = await reviewGetType();
    res.render('other/review/AddOrEdit', {
        viewTitle: "Thêm Mới",
        reviewType: reviewType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var review = new reviewControl();
    review.Name = req.body.Name;
    review.Loai = req.body.Loai;
    review.Comment = req.body.Comment;
    review.RatingDate = req.body.RatingDate;
    review.detail = req.body.detail;
    reviewControl.findOne({ Comment: review.Comment }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Nội dung đã tồn tại');
            res.redirect('/review/create');
        }
        else {
            review.save(async function (err, doc) {
                if (!err)
                    res.redirect('review/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let reviewType = await reviewGetType();
                        res.render("other/review/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            review: req.body,
                            reviewType: reviewType
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
    reviewControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('review/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('other/review/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    review: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    reviewControl.find(function (err, docs) {
        if (!err) {
            res.render('other/review/list', {
                list: docs
            });
        }
        else {
            console.log('Error in retrieving other list :' + err);
        }
    });
});

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case 'Name':
                body['NameError'] = err.errors[field].message;
                break;
            case 'Comment':
                body['CommentError'] = err.errors[field].message;
            case 'RatingDate':
                body['RatingDateError'] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

async function reviewGetType(req, res) {
    try {
        const post = await reviewType.find({ dependent: 'Đánh giá của du khách' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let reviewType = await reviewGetType();
    reviewControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('other/review/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                review: doc,
                reviewType: reviewType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    reviewControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/review/list');
        }
        else { console.log('Error in other delete :' + err); }
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

module.exports.reviewCount = async function reviewCount(req, res) {
    try {
        const count = await reviewControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.reviewGetNewest = async function reviewGetNewest(req, res) {
    try {
        const post = await reviewControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.reviewGetOldest = async function reviewGetOldest(req, res) {
    try {
        const post = await reviewControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}