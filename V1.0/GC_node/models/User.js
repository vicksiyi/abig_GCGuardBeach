const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 小程序用户
const UserSchema = new Schema({
    nickName: {         // 微信名字
        type: String,
        required: false
    },
    name_true: {    // 真实名字
        type: String,
        required: false
    },
    avatarUrl: {
        type: String,
        required: false
    },
    phone: {        // 手机号码
        type: String,
        required: false
    },
    email: {        // 常用邮箱
        type: String,
        required: false
    },
    openId: {        // openId
        type: String,
        required: true
    },
    password: {     // 用户登录密码
        type: String,
        required: false
    },
    price: {        // 爱心量
        type: Number,
        required: false
    },
    address: {        // 地点
        type: String,
        required: false
    },
    time: {         // 加入时间
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('users', UserSchema);