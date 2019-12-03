const mongoose = require('mongoose');

var typeDetailSchema = new mongoose.Schema({
    tenBang: {
        type: String,
    }
});

typeDetailSchema.set('versionKey', false);

mongoose.model('type_detail_collections', typeDetailSchema);



