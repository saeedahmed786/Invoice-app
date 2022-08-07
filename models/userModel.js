const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    file: {
        type: Object
    }
}, { timestamps: true }
);

const userModel = new mongoose.model('User', userSchema);
module.exports = userModel;
