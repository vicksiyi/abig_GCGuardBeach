const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const FeedBackSchema = new Schema({
    openId: {
        type: String,
        required: false
    },
    msg: {
        type: String,
        required: false
    },
    picture: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = FeedBack = mongoose.model('feedbacks', FeedBackSchema);