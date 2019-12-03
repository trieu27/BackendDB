const mongoose = require('mongoose');

var cuisineSchema = new mongoose.Schema({
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

cuisineSchema.set('versionKey', false);

mongoose.model('amthuc_collections', cuisineSchema);



