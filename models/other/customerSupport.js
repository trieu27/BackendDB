const mongoose = require('mongoose');

var customerSupportSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: 'Trường dữ liệu này là bắt buộc.'
    },
    Loai: {
        type: String,
    },
    Info: {
        type: String,
        required: 'Trường dữ liệu này là bắt buộc.'
    },
    img_url: {
        type: String,
    },
    detail: {
        type: String,
    },
});

customerSupportSchema.set('versionKey', false);

mongoose.model('hotro_dukhach_collections', customerSupportSchema);



