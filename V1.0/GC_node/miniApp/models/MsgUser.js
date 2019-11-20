const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const MsgUserSchema = new Schema({
    openId: {
        type: String,
        required: true
    },
    msgId: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = MsgUser = mongoose.model('msgusers', MsgUserSchema);