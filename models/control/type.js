const mongoose = require('mongoose');

var typeSchema = new mongoose.Schema({
    maLoai: {
        type: String,
        required: 'Trường dữ liệu này là bắt buộc.'
    },
    tenLoai: {
        type: String,
        required: 'Trường dữ liệu này là bắt buộc.'
    },
    dependent: {
        type: String,
    }
});

typeSchema.set('versionKey', false);

mongoose.model('type_collections', typeSchema);



