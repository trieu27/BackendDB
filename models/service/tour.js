const mongoose = require('mongoose');

var tourSchema = new mongoose.Schema({
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
    ChiTiet: {
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

tourSchema.set('versionKey', false);

mongoose.model('tour_collections', tourSchema);