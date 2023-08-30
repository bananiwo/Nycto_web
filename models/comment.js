const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
}, {timestamps: true});

// automatically look for "Comments" collection (adds s)
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;