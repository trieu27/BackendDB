const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const customerSupportControl = mongoose.model('hotro_dukhach_collections');
const customerType = mongoose.model('type_collections');

router.get('/create', ensureAuthenticated, async function (req, res) {
    let customerType = await customerGetType();
    res.render('other/customerSupport/AddOrEdit', {
        viewTitle: "Thêm Mới",
        customerType: customerType
    });
});

router.post('/', function (req, res) {
    if (req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

function insertRecord(req, res) {
    var customerSupport = new customerSupportControl();
    customerSupport.Name = req.body.Name;
    customerSupport.Loai = req.body.Loai;
    customerSupport.Info = req.body.Info;
    customerSupport.img_url = req.body.img_url;
    customerSupport.detail = req.body.detail;
    customerSupportControl.findOne({ Name: customerSupport.Name }, function (err, check) {
        if (err) console.log(err);
        if (check) {
            req.flash('error_msg', 'Tên đã tồn tại');
            res.redirect('/customerSupport/create');
        }
        else {
            customerSupport.save(async function (err, doc) {
                if (!err)
                    res.redirect('customerSupport/list');
                else {
                    if (err.name == 'ValidationError') {
                        handleValidationError(err, req.body);
                        let customerType = await customerGetType();
                        res.render("other/customerSupport/AddOrEdit", {
                            viewTitle: "Thêm Mới",
                            customerSupport: req.body,
                            customerType: customerType
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
    customerSupportControl.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, function (err, doc) {
        if (!err) { res.redirect('customerSupport/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render('other/customerSupport/AddOrEdit', {
                    viewTitle: 'Sửa Thông Tin',
                    customerSupport: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', ensureAuthenticated, function (req, res) {
    customerSupportControl.find(function (err, docs) {
        if (!err) {
            res.render('other/customerSupport/list', {
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

async function customerGetType(req, res) {
    try {
        const post = await customerType.find({ dependent: 'Dịch vụ hỗ trợ du khách' });
        return post;
    } catch (error) {
        return 0;
    }
}

router.get('/modify/:id', ensureAuthenticated, async function (req, res) {
    let customerType = await customerGetType();
    customerSupportControl.findById(req.params.id, function (err, doc) {
        if (!err) {
            res.render('other/customerSupport/AddOrEdit', {
                viewTitle: "Sửa Thông Tin",
                customerSupport: doc,
                customerType: customerType
            });
        }
    });
});

router.get('/delete/:id', ensureAuthenticated, function (req, res) {
    customerSupportControl.findByIdAndRemove(req.params.id, function (err, doc) {
        if (!err) {
            res.redirect('/customerSupport/list');
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

module.exports.customerSupportCount = async function customerSupportCount(req, res) {
    try {
        const count = await customerSupportControl.countDocuments();
        return count;
    } catch (error) {
        return 0;
    }
}

module.exports.customerSupportGetNewest = async function customerSupportGetNewest(req, res) {
    try {
        const post = await customerSupportControl.find().sort({ _id: -1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}

module.exports.customerSupportGetOldest = async function customerSupportGetOldest(req, res) {
    try {
        const post = await customerSupportControl.find().sort({ _id: 1 }).limit(1);
        return post;
    } catch (error) {
        return 0;
    }
}