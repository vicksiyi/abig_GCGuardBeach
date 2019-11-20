const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const LifeFocusSchema = new Schema({
    openId: {           // 关注人
        type: String,
        required: true
    },
    focusId: {          // 关注类别
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = LifeFocus = mongoose.model('lifefocuss', LifeFocusSchema);