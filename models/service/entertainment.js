const mongoose = require('mongoose');

var entertainmentSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: 'Trường dữ liệu này là bắt buộc.'
    },
    Info: {
        type: String,
        required: 'Trường dữ liệu này là bắt buộc.'
    },
    Loai: {
        type: String,
    },
    img_url: {
        type: String,
    },
    detail: {
        type: String,
    },
});

entertainmentSchema.set('versionKey', false);

mongoose.model('khuvuichoi_rapphim_collections', entertainmentSchema);

