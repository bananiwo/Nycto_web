const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true});

// automatically look for "Users" collection (adds s)
const User = mongoose.model('User', userSchema);
module.exports = User;