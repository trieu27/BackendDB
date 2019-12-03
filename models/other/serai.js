const mongoose = require('mongoose');

var seraiSchema = new mongoose.Schema({
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

seraiSchema.set('versionKey', false);

mongoose.model('tramnghi_collections', seraiSchema);



