const mongoose = require('mongoose');

var HaiPhongSchema = new mongoose.Schema({
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

HaiPhongSchema.set('versionKey', false);

mongoose.model('haiphong_collections', HaiPhongSchema);

