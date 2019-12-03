const mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
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

eventSchema.set('versionKey', false);

mongoose.model('sukien_collections', eventSchema);



