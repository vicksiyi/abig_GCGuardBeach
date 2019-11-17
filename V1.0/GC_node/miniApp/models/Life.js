const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema
const LifeSchema = new Schema({
    nickName: {             // 发送人昵称
        type: String,
        required: true
    },
    avatarUrl: {            // 发送人头像
        type: String,
        required: true
    },
    picture: {              // 发送的图片
        type: Array,
        required: false
    },
    content: {              // 正文
        type: String,
        required: false
    },
    openId: {               // 用户唯一值
        type: String,
        required: true
    },
    type: {                 // 发送类型
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
})

module.exports = Life = mongoose.model('lifes', LifeSchema);