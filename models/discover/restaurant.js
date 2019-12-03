const mongoose = require('mongoose');

var restaurantSchema = new mongoose.Schema({
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
    img_url1: {
        type: String,
    },
    img_url2: {
        type: String,
    },
    detail: {
        type: String,
    },
});

restaurantSchema.set('versionKey', false);

mongoose.model('nhahang_collections', restaurantSchema);

