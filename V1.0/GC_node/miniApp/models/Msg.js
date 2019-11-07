const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const MsgSchema = new Schema({
    msg_title: {
        type: String,
        required: true
    },
    msg_address: {
        type: String,
        required: true
    },
    msg_content: {
        type: String,
        required: true
    },
    msg_image: {
        type: String,
        required: true
    },
    msg_person: {
        type: Number,
        required: false
    },
    msg_day: {
        type: String,
        required: true
    },
    msg_latitude: {
        type: String,
        required: true
    },
    msg_longitude: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = Msg = mongoose.model('msgs', MsgSchema);