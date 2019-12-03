const mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: 'Trường dữ liệu này là bắt buộc.'
    },
    Loai: {
        type: String,
    },
    Comment: {
        type: String,
        required: 'Trường dữ liệu này là bắt buộc.'
    },
    RatingDate: {
        type: String,
        required: 'Trường dữ liệu này là bắt buộc.'
    },
    detail: {
        type: String,
    }
});

reviewSchema.set('versionKey', false);

mongoose.model('review_collections', reviewSchema);