const mongoose = require('mongoose');

var atmSchema = new mongoose.Schema({
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

atmSchema.set('versionKey', false);

mongoose.model('atm_collections', atmSchema);



