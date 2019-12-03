const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'This field is required.'
    },
    email: {
        type: String,
        required: 'This field is required.'
    },
    username: {
        type: String,
        index: true,
        required: 'This field is required.'
    },
    password: {
        type: String,
        required: 'This field is required.'
    },
});

userSchema.set('versionKey', false);

var User = module.exports = mongoose.model('user', userSchema);

module.exports.createUser = function (newUser, callback) {

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(newUser.password, salt, function (err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function (username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
};

module.exports.getUserByID = function (ID, callback) {

    User.findById(ID, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function (err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};


