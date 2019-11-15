const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const LifeTypeSchema = new Schema({
    oneType: {          // 一级类型
        type: String,
        required: true
    },
    twoType: {          // 二级类型
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = LifeType = mongoose.model('lifetypes', LifeTypeSchema);