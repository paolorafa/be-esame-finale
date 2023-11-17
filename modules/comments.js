const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
    comment: {
        type: String
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "clientModel"
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"productModel"
    }
}, {timestamps: true, strict: true});

module.exports = mongoose.model('commentsModel', CommentSchema, 'comments');